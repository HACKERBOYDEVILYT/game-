import * as THREE from 'three';
import { audioManager } from '../audio/SpatialAudioEngine.ts';

export interface MotorcycleInput {
  forward: number; // -1 (reverse/brake) to 1 (throttle)
  steer: number;   // -1 (left) to 1 (right)
  handbrake?: boolean;
}

export class MotorcycleController {
  public mesh: THREE.Group;
  public isMounted = false;

  // Transform state
  public position = new THREE.Vector3();
  public velocity = new THREE.Vector3();
  public speed = 0; // forward speed in m/s
  public yaw = 0;   // facing angle (radians)
  public steerAngle = 0; // current turning angle (radians)
  public leanAngle = 0;  // roll angle into turns (radians)
  public pitchAngle = 0; // suspension dive/squat (radians)
  private wheelRotation = 0; // spin angle of wheels (radians)

  // Sub-mesh references for dynamic animation
  private frontWheel: THREE.Object3D | null = null;
  private rearWheel: THREE.Object3D | null = null;
  private forkL: THREE.Object3D | null = null;
  private forkR: THREE.Object3D | null = null;
  private handlebars: THREE.Object3D | null = null;
  private kickstand: THREE.Object3D | null = null;
  private bikeLight: THREE.SpotLight | null = null;
  private bikeLightTarget: THREE.Object3D | null = null;

  // Physics handling parameters
  public readonly maxSpeedForward = 15.5; // ~56 km/h cruising speed
  public readonly maxSpeedReverse = -3.2;  // ~11 km/h reverse speed
  public readonly acceleration = 8.5;     // m/s^2 throttle power
  public readonly brakeForce = 16.0;      // m/s^2 brake power
  public readonly naturalFriction = 3.2;  // m/s^2 rolling resistance
  public readonly maxSteerAngle = 0.52;   // ~30 degrees max steer
  public readonly maxLeanAngle = 0.28;    // ~16 degrees lean bank
  public readonly wheelRadius = 0.36;     // meters

  constructor(bikeGroup: THREE.Group, initialPos: THREE.Vector3, initialYaw = 0) {
    this.mesh = bikeGroup;
    this.position.copy(initialPos);
    this.yaw = initialYaw;

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.yaw;

    this.extractChildReferences();
  }

  /**
   * Traverse the composite motorbike mesh and extract dynamic part references
   */
  private extractChildReferences() {
    this.mesh.traverse((child) => {
      if (child instanceof THREE.SpotLight) {
        this.bikeLight = child;
        if (child.target) this.bikeLightTarget = child.target;
      }
    });

    // The environment builder adds children in known sequence:
    // child 0: frontWheel (group with tire & rim at z = -0.85)
    // child 1: rearWheel (group with tire & rim at z = 0.85)
    // child 2, 3: forkL, forkR
    // child 10: kickstand
    this.mesh.children.forEach((child) => {
      // Identify wheels by position
      if (child.position.z < -0.7 && child.position.z > -1.0 && child.position.y > 0.25) {
        this.frontWheel = child;
      } else if (child.position.z > 0.7 && child.position.z < 1.0 && child.position.y > 0.25) {
        this.rearWheel = child;
      } else if (child.position.x < -0.1 && child.position.y < 0.3 && child.position.z > 0.0) {
        this.kickstand = child;
      } else if (child.position.y > 0.95 && child.position.z < -0.5) {
        this.handlebars = child;
      }
    });
  }

  /**
   * Mount player onto the bike
   */
  public mount(playerPos: THREE.Vector3): boolean {
    const dist = Math.hypot(this.position.x - playerPos.x, this.position.z - playerPos.z);
    if (dist > 3.0) return false;

    this.isMounted = true;

    // Retract kickstand
    if (this.kickstand) {
      this.kickstand.rotation.z = 0;
      this.kickstand.rotation.x = 0;
    }

    // Straighten bike lean from kickstand rest
    this.mesh.rotation.z = 0;

    // Start 4-stroke thumping idle engine audio
    audioManager.startMotorcycleEngine();

    // Turn on headlight beam brightly
    if (this.bikeLight) {
      this.bikeLight.intensity = 5.5;
      this.bikeLight.visible = true;
    }

    return true;
  }

  /**
   * Dismount player safely from the bike
   */
  public dismount(): THREE.Vector3 {
    this.isMounted = false;
    this.speed = 0;
    this.velocity.set(0, 0, 0);

    // Deploy kickstand to lean the bike naturally
    if (this.kickstand) {
      this.kickstand.rotation.z = -0.42;
      this.kickstand.rotation.x = -0.15;
    }
    this.mesh.rotation.z = 0.08; // slight kickstand lean

    // Turn off or dim engine
    audioManager.stopMotorcycleEngine();

    // Calculate safe dismount position (1.2m to left of bike)
    const leftVector = new THREE.Vector3(-1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const dismountPos = this.position.clone().addScaledVector(leftVector, 1.25);
    dismountPos.y = 1.65; // standard standing height

    return dismountPos;
  }

  /**
   * Update physics, movement, handling, steering, leaning, wheels, and engine sound
   */
  public update(delta: number, input: MotorcycleInput) {
    if (!this.isMounted) {
      // Stationary on kickstand: keep upright with kickstand lean
      this.mesh.position.copy(this.position);
      this.mesh.rotation.y = this.yaw;
      return;
    }

    const { forward, steer, handbrake } = input;

    // 1. Acceleration & Braking Dynamics
    if (handbrake) {
      // Emergency e-brake skid
      const brakeDecel = this.brakeForce * 1.5;
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - brakeDecel * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + brakeDecel * delta);
      }
    } else if (forward > 0.05) {
      // Throttle applied
      if (this.speed < 0) {
        // Active braking from reverse
        this.speed += this.brakeForce * delta;
      } else {
        // Accelerate forward
        this.speed = Math.min(this.maxSpeedForward, this.speed + this.acceleration * forward * delta);
      }
    } else if (forward < -0.05) {
      // Reverse / Foot brake applied
      if (this.speed > 0.2) {
        // Active brake down from forward motion
        this.speed = Math.max(0, this.speed - this.brakeForce * Math.abs(forward) * delta);
      } else {
        // Reverse backwards
        this.speed = Math.max(this.maxSpeedReverse, this.speed - this.acceleration * 0.5 * Math.abs(forward) * delta);
      }
    } else {
      // Coasting: Natural friction brings bike to a stop
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.naturalFriction * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.naturalFriction * delta);
      }
    }

    // 2. Steering & Yaw Handling
    // Turning responsiveness scales realistically with speed (sharper at low speed, wider radius at high speed)
    const speedRatio = Math.abs(this.speed) / this.maxSpeedForward;
    const steerResponsiveness = 1.0 - (speedRatio * 0.45);
    const targetSteerAngle = -steer * this.maxSteerAngle * steerResponsiveness;
    this.steerAngle = THREE.MathUtils.damp(this.steerAngle, targetSteerAngle, 10, delta);

    // Apply turning rate when moving
    if (Math.abs(this.speed) > 0.05) {
      const turnRate = (this.steerAngle / 1.6) * (this.speed / 2.8);
      this.yaw += turnRate * delta;
    }

    // 3. Realistic Motorcycle Lean & Suspension Pitch
    // Banking into turns: lean increases with steering and forward speed
    const targetLean = -steer * (speedRatio * this.maxLeanAngle);
    this.leanAngle = THREE.MathUtils.damp(this.leanAngle, targetLean, 8, delta);

    // Suspension Pitch (Dive under hard braking, squat under acceleration)
    let targetPitch = 0;
    if (forward > 0.3 && this.speed < this.maxSpeedForward * 0.8) {
      targetPitch = 0.035; // Acceleration squat
    } else if (forward < -0.3 || handbrake) {
      targetPitch = -0.045; // Braking dive
    }
    this.pitchAngle = THREE.MathUtils.damp(this.pitchAngle, targetPitch, 9, delta);

    // 4. World Position Integration & Arena Boundary Clamping
    const forwardVector = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    this.velocity.copy(forwardVector).multiplyScalar(this.speed);

    const nextX = this.position.x + this.velocity.x * delta;
    const nextZ = this.position.z + this.velocity.z * delta;

    // Check boundaries (-54 to 54)
    if (nextX < -54 || nextX > 54 || nextZ < -54 || nextZ > 54) {
      // Wall collision bounce
      this.speed *= -0.3;
      audioManager.playDoorCreak();
    } else {
      this.position.x = nextX;
      this.position.z = nextZ;
    }

    // Ground elevation
    this.position.y = 0;

    // 5. Update 3D Mesh Transforms
    this.mesh.position.copy(this.position);
    this.mesh.rotation.set(this.pitchAngle, this.yaw, this.leanAngle, 'YXZ');

    // 6. Wheels Rolling & Front Wheel Steering Animation
    this.wheelRotation += (this.speed * delta) / this.wheelRadius;

    if (this.frontWheel) {
      this.frontWheel.rotation.y = this.steerAngle + Math.PI / 2;
      this.frontWheel.rotation.x = this.wheelRotation;
    }
    if (this.rearWheel) {
      this.rearWheel.rotation.x = this.wheelRotation;
    }

    // Handlebar steering rotation
    if (this.handlebars) {
      this.handlebars.rotation.y = this.steerAngle;
    }

    // Update Headlight target tracking forward
    if (this.bikeLight && this.bikeLightTarget) {
      const lightForward = new THREE.Vector3(0, -0.05, -20).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      this.bikeLightTarget.position.copy(this.position).add(lightForward);
    }

    // 7. Update Engine Sound (Idle thumping vs Revving throttle)
    const throttleIntensity = Math.max(0, forward);
    audioManager.updateMotorcycleEngine(throttleIntensity, speedRatio);
  }
}
