import * as THREE from 'three';
import { LevelDefinition, PlayerStats, InventoryItem } from '../types/game.ts';
import { EnvironmentBuilder } from './EnvironmentBuilder.ts';
import { GhostAIManager } from './GhostAIManager.ts';
import { audioManager } from '../audio/SpatialAudioEngine.ts';
import { PlayerCharacterModel } from './PlayerCharacterModel.ts';

export interface EngineCallbacks {
  onStatsUpdate: (stats: PlayerStats) => void;
  onSubtitle: (bn: string, en: string) => void;
  onLevelComplete: () => void;
  onGameOver: (reasonBn: string, reasonEn: string) => void;
  onInteractPrompt: (promptBn: string | null, promptEn: string | null) => void;
}

export class ThreeEngine {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private flashlight!: THREE.SpotLight;
  private flashlightSpill!: THREE.PointLight;
  private flashlightTarget!: THREE.Object3D;
  private envBuilder: EnvironmentBuilder;
  private ghostAI!: GhostAIManager;
  public characterModel!: PlayerCharacterModel;
  private level: LevelDefinition;
  private callbacks: EngineCallbacks;

  // Player state & physics
  private playerPos = new THREE.Vector3();
  private playerVelocity = new THREE.Vector3();
  private cameraPitch = 0;
  private cameraYaw = 0;
  private isPointerLocked = false;
  private headBobTimer = 0;
  private footstepTimer = 0;
  private darkExposureTimer = 0;

  // Stats
  public stats: PlayerStats;

  // Input states
  private keys: Record<string, boolean> = {};
  private mobileSprint = false;
  public touchMove = { x: 0, y: 0 };
  public touchLook = { x: 0, y: 0 };

  // Loop control
  private animationFrameId: number | null = null;
  private lastTime = performance.now();
  private isDisposed = false;

  constructor(container: HTMLDivElement, level: LevelDefinition, callbacks: EngineCallbacks) {
    this.container = container;
    this.level = level;
    this.callbacks = callbacks;
    this.envBuilder = new EnvironmentBuilder();

    // Initial inventory with starting consignment parcel
    const initialParcel: InventoryItem = {
      id: `parcel_${level.id}`,
      nameBn: level.parcelNameBn,
      nameEn: level.parcelNameEn,
      category: 'parcel',
      descriptionBn: level.parcelDescriptionBn,
      descriptionEn: level.parcelDescriptionEn,
      loreBn: level.loreUnlockBn,
      loreEn: level.loreUnlockEn,
      iconType: 'parcel'
    };

    this.stats = {
      health: 100,
      sanity: 100,
      battery: 100,
      flashlightOn: true,
      isSprinting: false,
      isCrouched: false,
      isLookingBack: false,
      hasParcel: true,
      cameraViewMode: 'first_person',
      inventoryKeys: [],
      collectedClues: [],
      inventoryItems: [initialParcel]
    };

    this.initScene();
    this.setupListeners();
    this.animate();
  }

  private initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 2. Scene & Atmospheric Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06080d);
    this.scene.fog = new THREE.FogExp2(0x06080d, 0.032); // Slightly clearer fog so torch beam reaches far

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 140);
    this.playerPos.set(this.level.playerSpawn.x, 1.65, this.level.playerSpawn.z);
    this.cameraYaw = this.level.playerSpawn.rotationY;
    this.camera.position.copy(this.playerPos);

    // 4. Ambient & Moonlight Fill (Clearer rural night illumination)
    const moonLight = new THREE.DirectionalLight(0x4a6585, 0.7);
    moonLight.position.set(20, 45, 20);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.bias = -0.0005;
    this.scene.add(moonLight);

    const hemiLight = new THREE.HemisphereLight(0x28384d, 0x121720, 0.58);
    this.scene.add(hemiLight);

    // 5. Flashlight (Ultra-Bright High-Lumen Delivery Spotlight + Spill Light)
    this.flashlight = new THREE.SpotLight(0xfffaea, 12.0, 75, Math.PI / 3.8, 0.45, 1.0);
    this.flashlight.position.copy(this.playerPos);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.bias = -0.0003;

    this.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;
    this.scene.add(this.flashlight);

    // Forward ambient spill light: illuminates the motorbike, ground, and immediate area
    this.flashlightSpill = new THREE.PointLight(0xfff5e0, 2.8, 16, 1.2);
    this.flashlightSpill.position.copy(this.playerPos);
    this.scene.add(this.flashlightSpill);

    // 6. Build Level 3D Environment
    this.envBuilder.buildLevelEnvironment(this.level, this.scene);

    // 7. Player Character 3D Model (First-Person hands and Third-Person full body)
    this.characterModel = new PlayerCharacterModel();
    this.camera.add(this.characterModel.fpGroup);
    this.scene.add(this.camera);
    this.scene.add(this.characterModel.tpGroup);

    // 8. Setup Ghost AI & Mesh
    this.ghostAI = new GhostAIManager(this.level, (bn, en) => {
      this.callbacks.onSubtitle(bn, en);
    });
    this.scene.add(this.ghostAI.ghostMesh);

    // Initial Subtitle showing Level Rule
    this.callbacks.onSubtitle(this.level.ruleBn, this.level.ruleEn);
  }

  // --- INPUT HANDLING ---
  private setupListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    this.renderer.domElement.addEventListener('click', () => {
      if (!this.isPointerLocked && document.pointerLockElement !== this.renderer.domElement) {
        this.renderer.domElement.requestPointerLock().catch(() => {});
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
    });

    document.addEventListener('mousemove', this.onMouseMove);
  }

  private onResize = () => {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;

    if (e.code === 'KeyF') {
      this.toggleFlashlight();
    }

    if (e.code === 'KeyV') {
      this.toggleCameraViewMode();
    }

    if (e.code === 'KeyC') {
      this.toggleCrouch();
    }

    if (e.code === 'KeyE') {
      this.handleInteraction();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  public toggleCameraViewMode() {
    this.stats.cameraViewMode = this.stats.cameraViewMode === 'first_person' ? 'third_person' : 'first_person';
    const isTp = this.stats.cameraViewMode === 'third_person';
    this.callbacks.onSubtitle(
      isTp ? 'ক্যামেরা ভিউ: ৩য় ব্যক্তি ফুল বডি ভিউ (3rd Person View)' : 'ক্যামেরা ভিউ: ১ম ব্যক্তি হ্যান্ডস ভিউ (1st Person View)',
      isTp ? 'Camera View: 3rd Person Full Body' : 'Camera View: 1st Person Hands'
    );
    this.callbacks.onStatsUpdate({ ...this.stats });
  }

  public toggleCrouch() {
    this.stats.isCrouched = !this.stats.isCrouched;
    const isCr = this.stats.isCrouched;
    this.callbacks.onSubtitle(
      isCr ? 'নিচু হয়ে বসা (Sit Down / Crouched)' : 'সোজা হয়ে দাঁড়ানো (Sit Up / Standing)',
      isCr ? 'Crouched / Sitting Down' : 'Standing Up'
    );
    this.callbacks.onStatsUpdate({ ...this.stats });
  }

  public setSprint(sprint: boolean) {
    this.mobileSprint = sprint;
    this.stats.isSprinting = sprint;
    this.callbacks.onStatsUpdate({ ...this.stats });
  }

  public toggleSprint() {
    this.setSprint(!this.mobileSprint);
    this.callbacks.onSubtitle(
      this.mobileSprint ? 'দৌড়ানো মোড চালু (Sprint / Run Enabled)' : 'স্বাভাবিক হাঁটার মোড (Walking Mode)',
      this.mobileSprint ? 'Sprint / Run Enabled' : 'Normal Walk Mode'
    );
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isPointerLocked) return;
    const sensitivity = 0.0022;
    this.cameraYaw -= e.movementX * sensitivity;
    this.cameraPitch -= e.movementY * sensitivity;
    this.cameraPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.cameraPitch));
  };

  public handleTouchLookDelta(dx: number, dy: number) {
    const sensitivity = 0.0035;
    this.cameraYaw -= dx * sensitivity;
    this.cameraPitch -= dy * sensitivity;
    this.cameraPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.cameraPitch));
  }

  public toggleFlashlight() {
    if (this.stats.battery <= 2) {
      this.stats.flashlightOn = false;
      this.flashlight.visible = false;
      if (this.flashlightSpill) this.flashlightSpill.visible = false;
      return;
    }
    this.stats.flashlightOn = !this.stats.flashlightOn;
    this.flashlight.visible = this.stats.flashlightOn;
    if (this.flashlightSpill) this.flashlightSpill.visible = this.stats.flashlightOn;
    audioManager.playFlashlightClick(this.stats.flashlightOn);
  }

  public handleInteraction() {
    const dest = this.level.destination;
    const distToDest = Math.hypot(this.playerPos.x - dest.x, this.playerPos.z - dest.z);

    if (distToDest < dest.radius) {
      audioManager.playDoorCreak();
      this.callbacks.onLevelComplete();
      return;
    }

    // Check if near Delivery Bike
    const distToBike = Math.hypot(this.playerPos.x - 2.2, this.playerPos.z - 23.5);
    if (distToBike < 2.5) {
      audioManager.playFlashlightClick(true);
      this.callbacks.onSubtitle(
        "ডেলিভারি বাইক: ঘন কুয়াশায় ইঞ্জিন বন্ধ হয়ে গেছে... বাকি পথটুকু হেঁটেই সাবধানে পার্সেল পৌঁছে দিতে হবে!",
        "Delivery Bike: Engine stalled in the 3 AM cold fog... The remaining delivery must be made on foot!"
      );
      return;
    }

    // Check if near clues or keys to collect
    this.level.clues.forEach((clue) => {
      if (!clue.found) {
        clue.found = true;
        this.stats.collectedClues.push(clue.id);

        // Add to interactive inventory
        const newItem: InventoryItem = {
          id: clue.id,
          nameBn: clue.titleBn,
          nameEn: clue.titleEn,
          category: clue.iconType === 'key' ? 'key' : clue.iconType === 'talisman' ? 'talisman' : 'note',
          descriptionBn: clue.contentBn,
          descriptionEn: clue.contentEn,
          loreBn: `অধ্যায় ${this.level.number} এর গোপন ক্লু: ${clue.titleBn}`,
          loreEn: `Chapter ${this.level.number} secret clue: ${clue.titleEn}`,
          iconType: clue.iconType === 'key' ? 'key' : clue.iconType === 'talisman' ? 'talisman' : 'note'
        };

        this.stats.inventoryItems.push(newItem);
        this.callbacks.onSubtitle(`নতুন ক্লু সংগ্রহ: ${clue.titleBn}`, `New Clue Collected: ${clue.titleEn}`);
      }
    });
  }

  // --- MAIN SIMULATION LOOP ---
  private animate = () => {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.updatePlayerMovement(delta);
    this.updateFlashlight();
    this.updateSanityAndFear(delta);
    this.updateGhostAndEnvironment(delta);

    // Render 3D Scene
    this.renderer.render(this.scene, this.camera);
  };

  // --- SANITY / FEAR MECHANIC ---
  private updateSanityAndFear(delta: number) {
    // 1. Check if player is in safe lantern station
    let inLanternSafeZone = false;
    for (const station of this.level.lanternStations) {
      const dist = Math.hypot(this.playerPos.x - station.x, this.playerPos.z - station.z);
      if (dist < station.safeRadius) {
        inLanternSafeZone = true;
        break;
      }
    }

    // 2. Standing in the dark logic
    if (!this.stats.flashlightOn && !inLanternSafeZone) {
      this.darkExposureTimer += delta;
      // Sanity drains rapidly in total darkness (-7.5/sec)
      this.stats.sanity = Math.max(0, this.stats.sanity - 7.5 * delta);

      // Play eerie auditory hallucination whispers when prolonged in dark
      if (this.darkExposureTimer > 3.0 && Math.random() < 0.05) {
        audioManager.playWhisper('behind', 'অন্ধকার তোমাকে গ্রাস করছে...');
        this.darkExposureTimer = 0;
      }
    } else if (inLanternSafeZone) {
      this.darkExposureTimer = 0;
      // Sanity restores in warm lantern light (+6.0/sec)
      this.stats.sanity = Math.min(100, this.stats.sanity + 6.0 * delta);
      // Battery regenerates near lantern kerosene station
      this.stats.battery = Math.min(100, this.stats.battery + 3.0 * delta);
    } else {
      // Normal flashlight exploration: slight atmospheric pressure (-0.6/sec)
      this.darkExposureTimer = 0;
      this.stats.sanity = Math.max(0, this.stats.sanity - 0.6 * delta);
    }

    // 3. Vision clarity adjustment based on sanity
    // Thicken fog when sanity decreases
    const fearRatio = (100 - this.stats.sanity) / 100;
    const targetFog = 0.045 + fearRatio * 0.05;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.density = THREE.MathUtils.damp(this.scene.fog.density, targetFog, 2.5, delta);
    }

    // Dim and jitter tone mapping exposure when panic is severe
    const baseExposure = 0.95 * Math.max(0.65, this.stats.sanity / 100);
    const jitter = (this.stats.sanity < 40) ? (Math.random() - 0.5) * 0.08 : 0;
    this.renderer.toneMappingExposure = Math.max(0.5, baseExposure + jitter);

    // Camera shake/tremor when fear is acute
    if (this.stats.sanity < 45) {
      const shakeIntensity = ((45 - this.stats.sanity) / 45) * 0.025;
      this.camera.position.x += (Math.random() - 0.5) * shakeIntensity;
      this.camera.position.z += (Math.random() - 0.5) * shakeIntensity;
    }

    // Heartbeat pace tied to fear level
    audioManager.setHeartbeatRate(fearRatio);

    // 4. Fail Condition: Sanity reaches 0
    if (this.stats.sanity <= 0) {
      this.callbacks.onGameOver(
        "অন্ধকারের ভয়ে আপনার মানসিক ভারসাম্য সম্পূর্ণ ভেঙে গেছে...",
        "Your sanity shattered into madness in the unforgiving dark..."
      );
    }
  }

  private updatePlayerMovement(delta: number) {
    let moveForward = 0;
    let moveRight = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveForward += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveForward -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveRight += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveRight -= 1;

    moveForward += this.touchMove.y;
    moveRight += this.touchMove.x;

    const isMoving = Math.abs(moveForward) > 0.05 || Math.abs(moveRight) > 0.05;
    const wantsSprint = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.mobileSprint);
    this.stats.isSprinting = wantsSprint && isMoving;

    // Movement speed affected by sanity level!
    // As sanity drops, player becomes sluggish and stumbles
    const sanityFactor = Math.max(0.55, this.stats.sanity / 100);
    let speed = 3.2 * sanityFactor;
    if (this.stats.isSprinting) speed = 5.4 * sanityFactor;
    if (this.stats.isCrouched) speed = 1.8 * sanityFactor;

    const dir = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

    dir.addScaledVector(forward, moveForward);
    dir.addScaledVector(right, moveRight);
    if (dir.lengthSq() > 0.01) {
      dir.normalize();
    }

    this.playerVelocity.x = THREE.MathUtils.damp(this.playerVelocity.x, dir.x * speed, 8, delta);
    this.playerVelocity.z = THREE.MathUtils.damp(this.playerVelocity.z, dir.z * speed, 8, delta);

    const nextX = this.playerPos.x + this.playerVelocity.x * delta;
    const nextZ = this.playerPos.z + this.playerVelocity.z * delta;

    this.playerPos.x = Math.max(-55, Math.min(55, nextX));
    this.playerPos.z = Math.max(-55, Math.min(55, nextZ));

    const baseHeight = this.stats.isCrouched ? 1.05 : 1.65;
    if (isMoving) {
      this.headBobTimer += delta * (this.stats.isSprinting ? 14 : 9);
      const bobY = Math.sin(this.headBobTimer) * (this.stats.isSprinting ? 0.07 : 0.04);
      this.camera.position.y = baseHeight + bobY;

      this.footstepTimer += delta;
      const stepInterval = this.stats.isSprinting ? 0.32 : 0.52;
      if (this.footstepTimer >= stepInterval) {
        audioManager.playFootstep('mud');
        this.footstepTimer = 0;
      }
    } else {
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, baseHeight, 6, delta);
    }

    // Update 3D Character Model Position & Animation
    this.characterModel.tpGroup.position.set(this.playerPos.x, 0, this.playerPos.z);
    this.characterModel.update(
      delta,
      {
        isMoving,
        isSprinting: this.stats.isSprinting,
        isCrouched: this.stats.isCrouched,
        walkTimer: this.headBobTimer,
        pitch: this.cameraPitch,
        yaw: this.cameraYaw,
        flashlightOn: this.stats.flashlightOn
      },
      this.stats.cameraViewMode
    );

    // Apply Camera Perspective (First Person Hands vs Third Person Full Body)
    if (this.stats.cameraViewMode === 'first_person') {
      this.camera.position.x = this.playerPos.x;
      this.camera.position.z = this.playerPos.z;

      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.x = this.cameraPitch;
      euler.y = this.cameraYaw;
      this.camera.quaternion.setFromEuler(euler);
    } else {
      // Third Person: Cinematic Over-the-Shoulder camera tracking behind player
      const camDist = 2.8;
      const camHeight = 1.9;
      const sideOffset = 0.35;

      const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
      const rightDir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

      const camTargetPos = new THREE.Vector3(this.playerPos.x, baseHeight, this.playerPos.z)
        .addScaledVector(forwardDir, -camDist * Math.cos(this.cameraPitch))
        .addScaledVector(rightDir, sideOffset)
        .add(new THREE.Vector3(0, camHeight + Math.sin(this.cameraPitch) * camDist * 0.75, 0));

      this.camera.position.copy(camTargetPos);

      const lookTarget = new THREE.Vector3(this.playerPos.x, baseHeight + 0.1, this.playerPos.z)
        .addScaledVector(forwardDir, 10);
      this.camera.lookAt(lookTarget);
    }
  }

  private updateFlashlight() {
    if (this.stats.cameraViewMode === 'first_person') {
      this.flashlight.position.copy(this.camera.position);
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      this.flashlightTarget.position.copy(this.camera.position).addScaledVector(forward, 15);
    } else {
      const flPos = new THREE.Vector3();
      if (this.characterModel.tpFlashlightRef) {
        this.characterModel.tpFlashlightRef.getWorldPosition(flPos);
      } else {
        flPos.copy(this.playerPos).add(new THREE.Vector3(0.26, 1.1, 0));
      }
      this.flashlight.position.copy(flPos);

      const forward = new THREE.Vector3(0, Math.sin(this.cameraPitch), -Math.cos(this.cameraPitch))
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
      this.flashlightTarget.position.copy(flPos).addScaledVector(forward, 15);
    }

    if (this.flashlightSpill) {
      this.flashlightSpill.position.copy(this.flashlight.position);
      this.flashlightSpill.visible = this.stats.flashlightOn;
    }

    if (this.stats.flashlightOn) {
      this.stats.battery = Math.max(0, this.stats.battery - 0.7 * 0.016);
      if (this.stats.battery <= 0) {
        this.toggleFlashlight();
      }
    }
  }

  private updateGhostAndEnvironment(delta: number) {
    let inLanternSafeZone = false;
    for (const station of this.level.lanternStations) {
      const dist = Math.hypot(this.playerPos.x - station.x, this.playerPos.z - station.z);
      if (dist < station.safeRadius) {
        inLanternSafeZone = true;
        break;
      }
    }

    const playerFacing = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);

    const ghostResult = this.ghostAI.update(
      delta,
      this.playerPos,
      playerFacing,
      this.stats.flashlightOn,
      inLanternSafeZone
    );

    // Ghost proximity accelerates sanity drain
    this.stats.sanity = Math.max(0, this.stats.sanity - ghostResult.sanityDrain);
    if (ghostResult.playerDamaged) {
      this.stats.health = Math.max(0, this.stats.health - 40 * delta);
    }

    // Interaction prompts
    const distToDest = Math.hypot(this.playerPos.x - this.level.destination.x, this.playerPos.z - this.level.destination.z);
    const distToBike = Math.hypot(this.playerPos.x - 2.2, this.playerPos.z - 23.5);

    if (distToDest < this.level.destination.radius) {
      this.callbacks.onInteractPrompt(
        "[E / Tap] পার্সেল ডেলিভারি করুন (Deliver Parcel)",
        "[E / Tap] Deliver Parcel"
      );
    } else if (distToBike < 2.5) {
      this.callbacks.onInteractPrompt(
        "[E / Tap] ডেলিভারি বাইক পরীক্ষা করুন (Inspect Bike)",
        "[E / Tap] Inspect Delivery Bike"
      );
    } else if (inLanternSafeZone) {
      this.callbacks.onInteractPrompt(
        "নিরাপদ লণ্ঠনের আশ্রয় (Safe Lantern Station)",
        "Safe Lantern Sanctuary"
      );
    } else {
      this.callbacks.onInteractPrompt(null, null);
    }

    if (this.stats.health <= 0) {
      this.callbacks.onGameOver(
        "অশরীরী আত্মা আপনাকে গ্রাস করেছে...",
        "The supernatural specter has taken you..."
      );
    }

    this.callbacks.onStatsUpdate({ ...this.stats });
  }

  public setQuality(quality: 'low' | 'med' | 'high') {
    if (quality === 'low') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
    } else if (quality === 'med') {
      this.renderer.setPixelRatio(1.25);
      this.renderer.shadowMap.enabled = true;
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
    }
  }

  public dispose() {
    this.isDisposed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
