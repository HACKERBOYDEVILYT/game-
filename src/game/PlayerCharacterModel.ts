import * as THREE from 'three';

export interface CharacterAnimState {
  isMoving: boolean;
  isSprinting: boolean;
  isCrouched: boolean;
  isMounted?: boolean;
  walkTimer: number;
  pitch: number;
  yaw: number;
  flashlightOn: boolean;
}

export class PlayerCharacterModel {
  // 1st-person view model (Hands attached to camera)
  public fpGroup: THREE.Group;
  private fpRightArm!: THREE.Group;
  private fpLeftArm!: THREE.Group;
  private fpFlashlight!: THREE.Group;
  private fpParcel!: THREE.Mesh;

  // 3rd-person full body model (Attached to world/player)
  public tpGroup: THREE.Group;
  private tpHead!: THREE.Group;
  private tpTorso!: THREE.Group;
  private tpLeftArm!: THREE.Group;
  private tpRightArm!: THREE.Group;
  private tpLeftLeg!: THREE.Group;
  private tpRightLeg!: THREE.Group;
  private tpBackpack!: THREE.Group;
  public tpFlashlightRef!: THREE.Object3D;

  private jacketMat!: THREE.MeshStandardMaterial;
  private skinMat!: THREE.MeshStandardMaterial;
  private pantsMat!: THREE.MeshStandardMaterial;
  private bootsMat!: THREE.MeshStandardMaterial;
  private reflectiveMat!: THREE.MeshStandardMaterial;
  private metalMat!: THREE.MeshStandardMaterial;

  constructor() {
    this.fpGroup = new THREE.Group();
    this.tpGroup = new THREE.Group();

    this.initMaterials();
    this.buildFirstPersonHands();
    this.buildThirdPersonFullBody();
  }

  private initMaterials() {
    // Delivery rider dark navy courier jacket
    this.jacketMat = new THREE.MeshStandardMaterial({
      color: 0x1c2b38,
      roughness: 0.75,
      metalness: 0.1
    });

    // High-visibility neon reflective safety tape
    this.reflectiveMat = new THREE.MeshStandardMaterial({
      color: 0xc8ff00,
      roughness: 0.3,
      emissive: 0x668800,
      emissiveIntensity: 0.35
    });

    // Realistic South Asian skin tone
    this.skinMat = new THREE.MeshStandardMaterial({
      color: 0x8d5c3f,
      roughness: 0.8,
      metalness: 0.05
    });

    // Dark denim cargo pants
    this.pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1a2128,
      roughness: 0.85,
      metalness: 0.05
    });

    // Weathered muddy delivery boots
    this.bootsMat = new THREE.MeshStandardMaterial({
      color: 0x1f1915,
      roughness: 0.9,
      metalness: 0.15
    });

    // Metal hardware / flashlight casing
    this.metalMat = new THREE.MeshStandardMaterial({
      color: 0x3a4048,
      metalness: 0.85,
      roughness: 0.25
    });
  }

  // --- 1. FIRST-PERSON HANDS (Visible on screen in 1st Person) ---
  private buildFirstPersonHands() {
    this.fpGroup.name = 'fp_hands';

    // --- Right Arm & Flashlight ---
    this.fpRightArm = new THREE.Group();
    this.fpRightArm.position.set(0.28, -0.26, -0.42);

    // Forearm sleeve (Delivery jacket with reflective cuff)
    const sleeveGeo = new THREE.CylinderGeometry(0.048, 0.055, 0.35, 12);
    sleeveGeo.rotateX(Math.PI / 2.6);
    const sleeve = new THREE.Mesh(sleeveGeo, this.jacketMat);
    sleeve.position.set(0, 0, 0.12);
    this.fpRightArm.add(sleeve);

    // Reflective stripe around wrist
    const stripeGeo = new THREE.CylinderGeometry(0.051, 0.051, 0.04, 12);
    stripeGeo.rotateX(Math.PI / 2.6);
    const stripe = new THREE.Mesh(stripeGeo, this.reflectiveMat);
    stripe.position.set(0, -0.02, 0.03);
    this.fpRightArm.add(stripe);

    // Right Hand (Palm & Fingers grasping flashlight)
    const palmGeo = new THREE.BoxGeometry(0.065, 0.04, 0.09);
    const palm = new THREE.Mesh(palmGeo, this.skinMat);
    palm.position.set(0, -0.05, -0.06);
    palm.rotation.x = -0.3;
    this.fpRightArm.add(palm);

    // Fingers curled
    for (let i = 0; i < 4; i++) {
      const fingerGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.055, 8);
      fingerGeo.rotateZ(Math.PI / 2);
      const finger = new THREE.Mesh(fingerGeo, this.skinMat);
      finger.position.set(0.03, -0.06 + i * 0.008, -0.09 + i * 0.018);
      this.fpRightArm.add(finger);
    }

    // Flashlight 3D Model held firmly in hand
    this.fpFlashlight = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.022, 0.025, 0.22, 12);
    bodyGeo.rotateX(Math.PI / 2);
    const flBody = new THREE.Mesh(bodyGeo, this.metalMat);
    this.fpFlashlight.add(flBody);

    const headGeo = new THREE.CylinderGeometry(0.042, 0.025, 0.08, 12);
    headGeo.rotateX(Math.PI / 2);
    const flHead = new THREE.Mesh(headGeo, this.metalMat);
    flHead.position.z = -0.12;
    this.fpFlashlight.add(flHead);

    const lensGeo = new THREE.CircleGeometry(0.038, 16);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xfff6cf,
      emissive: 0xffdd66,
      emissiveIntensity: 1.5,
      roughness: 0.1
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.z = -0.161;
    this.fpFlashlight.add(lens);

    this.fpFlashlight.position.set(0, -0.05, -0.07);
    this.fpFlashlight.rotation.x = 0.05;
    this.fpRightArm.add(this.fpFlashlight);
    this.fpGroup.add(this.fpRightArm);

    // --- Left Arm & Consignment Parcel ---
    this.fpLeftArm = new THREE.Group();
    this.fpLeftArm.position.set(-0.28, -0.28, -0.4);

    const leftSleeve = new THREE.Mesh(sleeveGeo, this.jacketMat);
    leftSleeve.position.set(0, 0, 0.12);
    leftSleeve.rotation.y = 0.3;
    this.fpLeftArm.add(leftSleeve);

    const leftPalm = new THREE.Mesh(palmGeo, this.skinMat);
    leftPalm.position.set(0, -0.04, -0.05);
    leftPalm.rotation.x = -0.2;
    this.fpLeftArm.add(leftPalm);

    // Delivery Courier Parcel held under left arm
    const parcelGeo = new THREE.BoxGeometry(0.16, 0.1, 0.22);
    const parcelMat = new THREE.MeshStandardMaterial({
      color: 0x5a422d,
      roughness: 0.9,
      metalness: 0.05
    });
    this.fpParcel = new THREE.Mesh(parcelGeo, parcelMat);
    this.fpParcel.position.set(0.04, -0.02, -0.12);
    this.fpParcel.rotation.set(0.1, 0.2, -0.15);
    this.fpLeftArm.add(this.fpParcel);

    this.fpGroup.add(this.fpLeftArm);
  }

  // --- 2. THIRD-PERSON FULL BODY (Visible in 3rd Person View) ---
  private buildThirdPersonFullBody() {
    this.tpGroup.name = 'tp_character_body';

    // 1. Torso & Delivery Jacket
    this.tpTorso = new THREE.Group();
    this.tpTorso.position.y = 1.05;

    const chestGeo = new THREE.BoxGeometry(0.44, 0.52, 0.26);
    const chest = new THREE.Mesh(chestGeo, this.jacketMat);
    chest.castShadow = true;
    chest.receiveShadow = true;
    this.tpTorso.add(chest);

    // High-visibility reflective chest stripes (Diagonal / Cross bands)
    const stripeHGeo = new THREE.BoxGeometry(0.444, 0.06, 0.264);
    const stripeH = new THREE.Mesh(stripeHGeo, this.reflectiveMat);
    stripeH.position.y = 0.08;
    this.tpTorso.add(stripeH);

    const stripeVGeo = new THREE.BoxGeometry(0.06, 0.524, 0.264);
    const stripeVL = new THREE.Mesh(stripeVGeo, this.reflectiveMat);
    stripeVL.position.set(-0.12, 0, 0);
    this.tpTorso.add(stripeVL);

    const stripeVR = new THREE.Mesh(stripeVGeo, this.reflectiveMat);
    stripeVR.position.set(0.12, 0, 0);
    this.tpTorso.add(stripeVR);

    // 2. Courier Delivery Backpack (Strapped on back)
    this.tpBackpack = new THREE.Group();
    const packGeo = new THREE.BoxGeometry(0.38, 0.44, 0.22);
    const packMat = new THREE.MeshStandardMaterial({
      color: 0x992222,
      roughness: 0.8,
      metalness: 0.1
    });
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 0.05, 0.23);
    pack.castShadow = true;
    this.tpBackpack.add(pack);

    // High-vis reflective band across backpack
    const packStripeGeo = new THREE.BoxGeometry(0.384, 0.05, 0.224);
    const packStripe = new THREE.Mesh(packStripeGeo, this.reflectiveMat);
    packStripe.position.set(0, 0.05, 0.23);
    this.tpBackpack.add(packStripe);

    this.tpTorso.add(this.tpBackpack);

    // 3. Head & Cap
    this.tpHead = new THREE.Group();
    this.tpHead.position.set(0, 0.38, 0);

    // Head base
    const headGeo = new THREE.SphereGeometry(0.115, 12, 12);
    headGeo.scale(1, 1.15, 1);
    const headMesh = new THREE.Mesh(headGeo, this.skinMat);
    headMesh.castShadow = true;
    this.tpHead.add(headMesh);

    // Courier Cap / Beanie
    const capGeo = new THREE.SphereGeometry(0.12, 12, 10, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x141a22,
      roughness: 0.85
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0.03, -0.01);
    this.tpHead.add(cap);

    // Cap visor bill facing forward
    const visorGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.02, 12, 1, false, Math.PI * 0.75, Math.PI * 0.5);
    const visor = new THREE.Mesh(visorGeo, capMat);
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 0.02, -0.1);
    this.tpHead.add(visor);

    this.tpTorso.add(this.tpHead);

    // 4. Arms (Pivot at shoulder)
    // Left Arm
    this.tpLeftArm = new THREE.Group();
    this.tpLeftArm.position.set(-0.26, 0.2, 0);
    const armGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.44, 10);
    armGeo.translate(0, -0.22, 0);
    const armMeshL = new THREE.Mesh(armGeo, this.jacketMat);
    armMeshL.castShadow = true;
    this.tpLeftArm.add(armMeshL);

    const handGeo = new THREE.BoxGeometry(0.06, 0.08, 0.05);
    const handL = new THREE.Mesh(handGeo, this.skinMat);
    handL.position.set(0, -0.46, 0);
    this.tpLeftArm.add(handL);
    this.tpTorso.add(this.tpLeftArm);

    // Right Arm (Holds Flashlight)
    this.tpRightArm = new THREE.Group();
    this.tpRightArm.position.set(0.26, 0.2, 0);
    const armMeshR = new THREE.Mesh(armGeo, this.jacketMat);
    armMeshR.castShadow = true;
    this.tpRightArm.add(armMeshR);

    const handR = new THREE.Mesh(handGeo, this.skinMat);
    handR.position.set(0, -0.46, 0);
    this.tpRightArm.add(handR);

    // Flashlight attached to right hand in 3rd person
    const flModel = new THREE.Group();
    const flCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.024, 0.2, 10),
      this.metalMat
    );
    flCyl.rotation.x = Math.PI / 2;
    flModel.add(flCyl);

    const flLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.035, 12),
      new THREE.MeshStandardMaterial({
        color: 0xfff3db,
        emissive: 0xffcc44,
        emissiveIntensity: 1.5
      })
    );
    flLens.position.z = -0.105;
    flModel.add(flLens);

    flModel.position.set(0, -0.46, -0.06);
    this.tpRightArm.add(flModel);
    this.tpFlashlightRef = flModel;

    this.tpTorso.add(this.tpRightArm);

    this.tpGroup.add(this.tpTorso);

    // 5. Legs & Boots (Pivoting at hips)
    // Left Leg
    this.tpLeftLeg = new THREE.Group();
    this.tpLeftLeg.position.set(-0.12, 0.78, 0);

    const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.52, 10);
    legGeo.translate(0, -0.26, 0);
    const legMeshL = new THREE.Mesh(legGeo, this.pantsMat);
    legMeshL.castShadow = true;
    this.tpLeftLeg.add(legMeshL);

    const bootGeo = new THREE.BoxGeometry(0.11, 0.16, 0.22);
    bootGeo.translate(0, -0.08, -0.03);
    const bootL = new THREE.Mesh(bootGeo, this.bootsMat);
    bootL.position.set(0, -0.52, 0);
    bootL.castShadow = true;
    this.tpLeftLeg.add(bootL);
    this.tpGroup.add(this.tpLeftLeg);

    // Right Leg
    this.tpRightLeg = new THREE.Group();
    this.tpRightLeg.position.set(0.12, 0.78, 0);

    const legMeshR = new THREE.Mesh(legGeo, this.pantsMat);
    legMeshR.castShadow = true;
    this.tpRightLeg.add(legMeshR);

    const bootR = new THREE.Mesh(bootGeo, this.bootsMat);
    bootR.position.set(0, -0.52, 0);
    bootR.castShadow = true;
    this.tpRightLeg.add(bootR);
    this.tpGroup.add(this.tpRightLeg);

    // Default 3rd person group hidden until switched
    this.tpGroup.visible = false;
  }

  // --- ANIMATION UPDATE ---
  public update(delta: number, state: CharacterAnimState, viewMode: 'first_person' | 'third_person') {
    if (viewMode === 'first_person') {
      this.fpGroup.visible = true;
      this.tpGroup.visible = false;

      if (state.isMounted) {
        // Motorcycle riding pose: both hands forward gripping handlebars
        const engineVibe = Math.sin(Date.now() * 0.05) * 0.003;
        this.fpRightArm.position.set(0.24, -0.28 + engineVibe, -0.38);
        this.fpRightArm.rotation.set(-0.35, 0, -0.05);
        this.fpLeftArm.position.set(-0.24, -0.28 + engineVibe, -0.38);
        this.fpLeftArm.rotation.set(-0.35, 0, 0.05);
      } else {
        // Animate 1st person hands walking/sprinting
        const speed = state.isSprinting ? 14 : 9;
        const bobY = state.isMoving ? Math.sin(state.walkTimer * speed) * 0.025 : Math.sin(state.walkTimer * 2) * 0.005;
        const bobX = state.isMoving ? Math.cos(state.walkTimer * (speed * 0.5)) * 0.015 : 0;

        this.fpRightArm.position.y = -0.26 + bobY;
        this.fpRightArm.position.x = 0.28 + bobX;
        this.fpLeftArm.position.y = -0.28 + bobY * 0.8;
        this.fpLeftArm.position.x = -0.28 - bobX * 0.8;

        // Slight tilt with sprint
        this.fpRightArm.rotation.z = state.isSprinting ? -0.1 : 0;
        this.fpLeftArm.rotation.z = state.isSprinting ? 0.1 : 0;
      }

    } else {
      this.fpGroup.visible = false;
      this.tpGroup.visible = true;

      // Update 3rd person full character body
      // Torso facing
      this.tpGroup.rotation.y = state.yaw;

      if (state.isMounted) {
        // Motorcycle rider seated posture
        const engineVibe = Math.sin(Date.now() * 0.04) * 0.006;
        this.tpTorso.position.y = 0.85 + engineVibe;
        this.tpTorso.rotation.x = 0.22; // leaning slightly forward towards handlebars

        // Legs bent forward onto bike footpegs
        this.tpLeftLeg.rotation.x = -0.55;
        this.tpRightLeg.rotation.x = -0.55;

        // Arms reaching forward to handlebars
        this.tpLeftArm.rotation.x = -1.1;
        this.tpRightArm.rotation.x = -1.1;

        // Head tracking forward
        this.tpHead.rotation.x = state.pitch * 0.4;
      } else if (state.isMoving) {
        const strideSpeed = state.isSprinting ? 13 : 8.5;
        const strideAngle = (state.isSprinting ? 0.55 : 0.38) * Math.sin(state.walkTimer * strideSpeed);

        this.tpTorso.rotation.x = 0;
        // Legs alternate swing
        this.tpLeftLeg.rotation.x = strideAngle;
        this.tpRightLeg.rotation.x = -strideAngle;

        // Arms alternate swing in counter motion
        this.tpLeftArm.rotation.x = -strideAngle * 0.9;
        // Right arm holds flashlight forward and tracks vertical pitch + subtle swing
        this.tpRightArm.rotation.x = -Math.PI / 3.5 + (state.pitch * 0.8) + (strideAngle * 0.2);

        // Torso subtle vertical bob
        this.tpTorso.position.y = 1.05 + Math.abs(Math.sin(state.walkTimer * strideSpeed)) * 0.035;
      } else {
        // Idle breathing on foot
        this.tpTorso.rotation.x = 0;
        const idleBreath = Math.sin(state.walkTimer * 2.5) * 0.015;
        this.tpLeftLeg.rotation.x = THREE.MathUtils.damp(this.tpLeftLeg.rotation.x, 0, 8, delta);
        this.tpRightLeg.rotation.x = THREE.MathUtils.damp(this.tpRightLeg.rotation.x, 0, 8, delta);
        this.tpLeftArm.rotation.x = THREE.MathUtils.damp(this.tpLeftArm.rotation.x, 0, 8, delta);
        this.tpRightArm.rotation.x = THREE.MathUtils.damp(this.tpRightArm.rotation.x, -Math.PI / 3.5 + state.pitch * 0.8, 8, delta);
        this.tpTorso.position.y = 1.05 + idleBreath;
      }

      // Head tracks pitch slightly
      if (!state.isMounted) {
        this.tpHead.rotation.x = state.pitch * 0.5;
      }

      // Crouch posture
      if (state.isCrouched && !state.isMounted) {
        this.tpGroup.scale.set(1, 0.72, 1);
      } else {
        this.tpGroup.scale.set(1, 1, 1);
      }
    }
  }
}
