import * as THREE from 'three';
import { GhostData, GhostType, GhostBehaviorState, LevelDefinition } from '../types/game.ts';
import { audioManager } from '../audio/SpatialAudioEngine.ts';

export class GhostAIManager {
  public ghostData: GhostData;
  public ghostMesh: THREE.Group;
  private eyesLight: THREE.PointLight | null = null;
  private whisperCooldown = 0;
  private subtitleCallback?: (textBn: string, textEn: string) => void;

  constructor(level: LevelDefinition, onSubtitle?: (textBn: string, textEn: string) => void) {
    this.subtitleCallback = onSubtitle;

    this.ghostData = {
      type: level.ghostType,
      nameBn: this.getGhostNameBn(level.ghostType),
      nameEn: this.getGhostNameEn(level.ghostType),
      loreBn: this.getGhostLoreBn(level.ghostType),
      loreEn: this.getGhostLoreEn(level.ghostType),
      ruleBn: level.ruleBn,
      ruleEn: level.ruleEn,
      x: level.playerSpawn.x,
      z: level.playerSpawn.z + 14, // Starts behind or lurking
      rotationY: 0,
      state: 'stalk',
      speed: 2.2,
      alertLevel: 10,
      distanceToPlayer: 14,
      isObserved: false,
      whisperTimer: 4.0
    };

    this.ghostMesh = this.buildGhost3DMesh(level.ghostType);
    this.ghostMesh.position.set(this.ghostData.x, 0, this.ghostData.z);
  }

  private getGhostNameBn(type: GhostType): string {
    switch (type) {
      case 'caller_behind': return 'পেছনের ডাক';
      case 'shadow_stalker': return 'ছায়ামূর্তি';
      case 'nishi_guest': return 'নিশির অতিথি';
    }
  }

  private getGhostNameEn(type: GhostType): string {
    switch (type) {
      case 'caller_behind': return 'The Caller Behind';
      case 'shadow_stalker': return 'The Shadow Stalker';
      case 'nishi_guest': return "Nishi's Deception";
    }
  }

  private getGhostLoreBn(type: GhostType): string {
    switch (type) {
      case 'caller_behind': return 'অমাবস্যার রাতে নির্জন মেঠোপথে পথিকের ঠিক পেছন থেকে পরিচিত মানুষের গলায় ডাকে। ফিরে তাকালেই মৃত্যু।';
      case 'shadow_stalker': return 'গাঢ় অন্ধকারের ভেতর দিয়ে নিঃশব্দে ভেসে বেড়ায়। কেবল টর্চলাইটের তীব্র আলোয় তার গতি রোধ হয়।';
      case 'nishi_guest': return 'পরিচিত স্বজন বা গ্রাহকের কণ্ঠ নকল করে ভুল দরজা বা জলাশয়ের দিকে টানে। ভুল দরজায় পা দিলে আর ফেরা যায় না।';
    }
  }

  private getGhostLoreEn(type: GhostType): string {
    switch (type) {
      case 'caller_behind': return 'Calls out from directly behind the traveller in a familiar voice on dark new moon nights. Turning to look brings instant doom.';
      case 'shadow_stalker': return 'Glides silently through pitch-black shadows. Freezes and dissolves only when exposed to the direct beam of a flashlight.';
      case 'nishi_guest': return 'Mimics the voices of loved ones or recipients to lure players into false rooms or deep waters. Once stepped inside, there is no return.';
    }
  }

  // --- PROCEDURAL 3D GHOST MESH ---
  private buildGhost3DMesh(type: GhostType): THREE.Group {
    const group = new THREE.Group();

    // 1. Shrouded floating body
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.75, 2.6, 12);
    let bodyColor = 0x11161d;
    let opacity = 0.85;

    if (type === 'caller_behind') {
      bodyColor = 0x1f242b;
    } else if (type === 'shadow_stalker') {
      bodyColor = 0x05070a;
      opacity = 0.95;
    } else {
      // Nishi in pale rural shawl
      bodyColor = 0x3d3936;
      opacity = 0.9;
    }

    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      transparent: true,
      opacity: opacity,
      roughness: 0.95
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.3;
    group.add(body);

    // 2. Hood / Head
    const headGeo = new THREE.SphereGeometry(0.4, 12, 12);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.y = 2.45;
    group.add(head);

    // 3. Glowing supernatural eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const eyeColor = type === 'caller_behind' ? 0xff4433 : (type === 'shadow_stalker' ? 0xffffff : 0x44ddaa);
    const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 2.48, 0.35);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 2.48, 0.35);
    group.add(rightEye);

    // Eerie subtle point light from eyes
    this.eyesLight = new THREE.PointLight(eyeColor, 0.6, 3);
    this.eyesLight.position.set(0, 2.48, 0.4);
    group.add(this.eyesLight);

    // 4. Wisps / trailing mist around feet
    const mistGeo = new THREE.RingGeometry(0.2, 0.9, 12);
    const mistMat = new THREE.MeshBasicMaterial({
      color: bodyColor,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const mist = new THREE.Mesh(mistGeo, mistMat);
    mist.rotation.x = Math.PI / 2;
    mist.position.y = 0.1;
    group.add(mist);

    group.name = "ghost_mesh";
    return group;
  }

  // Update AI State every frame
  public update(
    delta: number,
    playerPos: THREE.Vector3,
    playerFacing: THREE.Vector3,
    flashlightOn: boolean,
    inLanternSafeZone: boolean
  ): { playerDamaged: boolean; sanityDrain: number } {
    let playerDamaged = false;
    let sanityDrain = 0;

    const ghostPos = this.ghostMesh.position;
    const dx = playerPos.x - ghostPos.x;
    const dz = playerPos.z - ghostPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    this.ghostData.distanceToPlayer = dist;

    // Vector from player to ghost
    const toGhost = new THREE.Vector3(ghostPos.x - playerPos.x, 0, ghostPos.z - playerPos.z).normalize();
    const facingDot = playerFacing.dot(toGhost); // > 0 means player is looking towards ghost

    // Proximity static sound update
    const proximity = Math.max(0, 1 - dist / 22);
    audioManager.updateGhostProximityStatic(proximity);

    // Whispers & supernatural calling voice timer (ডাক দেওয়ার শব্দ)
    this.whisperCooldown -= delta;
    if (this.whisperCooldown <= 0 && dist < 24) {
      this.triggerSupernaturalWhisper(facingDot);
      this.whisperCooldown = 4.5 + Math.random() * 3.5;
    }

    // Floating subtle bob
    this.ghostMesh.position.y = Math.sin(Date.now() * 0.003) * 0.15;

    // --- BEHAVIOR STATE LOGIC ---
    if (this.ghostData.type === 'caller_behind') {
      // RULE: Do NOT look back!
      // If player looks within ~45 degrees (dot > 0.65) while ghost is within 18m, TRIGGER ENRAGE
      if (facingDot > 0.65 && dist < 16 && !inLanternSafeZone) {
        if (this.ghostData.state !== 'chase' && this.ghostData.state !== 'attack') {
          this.ghostData.state = 'chase';
          this.ghostData.speed = 5.2;
          audioManager.playGhostScream();
          if (this.subtitleCallback) {
            this.subtitleCallback("তুমি পেছন ফিরে তাকালে কেন?! (Why did you turn back?!)", "Why did you turn back?!");
          }
        }
      }

      if (this.ghostData.state === 'chase') {
        // Fast dash toward player
        ghostPos.x += (dx / dist) * this.ghostData.speed * delta;
        ghostPos.z += (dz / dist) * this.ghostData.speed * delta;
        sanityDrain += 18 * delta;

        if (dist < 1.8) {
          playerDamaged = true;
        }

        // If player enters safe lantern zone, ghost retreats
        if (inLanternSafeZone) {
          this.ghostData.state = 'retreat';
        }
      } else if (this.ghostData.state === 'retreat') {
        // Fall back behind
        ghostPos.z += 6 * delta;
        if (dist > 18) {
          this.ghostData.state = 'stalk';
          this.ghostData.speed = 2.0;
        }
      } else {
        // STALKING: Silently follow 8-12m behind player
        const targetZ = playerPos.z + 10;
        const targetX = playerPos.x;
        ghostPos.x += (targetX - ghostPos.x) * 1.5 * delta;
        ghostPos.z += (targetZ - ghostPos.z) * 1.5 * delta;
        sanityDrain += (inLanternSafeZone ? 0 : 2.5 * delta);
      }
    } else if (this.ghostData.type === 'shadow_stalker') {
      // RULE: Freeze under flashlight beam; crawls rapidly in darkness
      const isInFlashlightBeam = flashlightOn && facingDot > 0.65 && dist < 20;

      if (isInFlashlightBeam) {
        // Ghost is frozen & slowly burns away
        this.ghostData.state = 'frozen';
        if (this.eyesLight) this.eyesLight.intensity = 0.2;
        // Slowly back up away from the blinding light
        ghostPos.x -= (dx / dist) * 1.5 * delta;
        ghostPos.z -= (dz / dist) * 1.5 * delta;
        sanityDrain += 1.0 * delta;
      } else {
        // IN DARKNESS: Stalks and rushes player!
        this.ghostData.state = 'stalk';
        if (this.eyesLight) this.eyesLight.intensity = 1.0;
        const moveSpeed = inLanternSafeZone ? 0.8 : 3.4;
        ghostPos.x += (dx / dist) * moveSpeed * delta;
        ghostPos.z += (dz / dist) * moveSpeed * delta;

        if (!inLanternSafeZone) {
          sanityDrain += 7.0 * delta;
        }

        if (dist < 1.8 && !inLanternSafeZone) {
          playerDamaged = true;
        }
      }
    } else {
      // Nishi Guest (নিশির অতিথি)
      // Lurks near doorways or path branches, attempting to lure player with voices
      if (dist < 2.2 && !inLanternSafeZone) {
        playerDamaged = true;
      }
      sanityDrain += (dist < 10 && !inLanternSafeZone) ? 4.0 * delta : 0;
    }

    // Always face towards the player
    this.ghostMesh.lookAt(playerPos.x, this.ghostMesh.position.y, playerPos.z);

    this.ghostData.x = ghostPos.x;
    this.ghostData.z = ghostPos.z;

    return { playerDamaged, sanityDrain };
  }

  private triggerSupernaturalWhisper(facingDot: number) {
    let phraseBn = "রাত ৩টা বাজে... পার্সেলটি আমার...";
    let phraseEn = "It is 3 AM... that parcel is mine...";
    const dir: 'behind' | 'left' | 'right' | 'front' = facingDot < -0.3 ? 'behind' : (Math.random() > 0.5 ? 'left' : 'right');

    if (this.ghostData.type === 'caller_behind') {
      const phrasesBn = [
        "ভাই, একটু পেছন ফিরে তাকাও না...",
        "এই তো আমি তোমার পেছনে...",
        "নাম ধরে ডাকছি, শুনছো না কেন...?",
        "একবার শুধু চোখ মেলে দেখো..."
      ];
      const phrasesEn = [
        "Brother, won't you turn back and look...",
        "I am right here behind you...",
        "Calling your name, why don't you hear...?",
        "Just open your eyes and turn around once..."
      ];
      const idx = Math.floor(Math.random() * phrasesBn.length);
      phraseBn = phrasesBn[idx];
      phraseEn = phrasesEn[idx];
    } else if (this.ghostData.type === 'shadow_stalker') {
      const phrasesBn = [
        "আলো নিভিয়ে দাও...",
        "অন্ধকারে এসো...",
        "আমরা ছায়ায় দাঁড়িয়ে আছি...",
      ];
      const phrasesEn = [
        "Extinguish that light...",
        "Step into the darkness...",
        "We are waiting in the shadows..."
      ];
      const idx = Math.floor(Math.random() * phrasesBn.length);
      phraseBn = phrasesBn[idx];
      phraseEn = phrasesEn[idx];
    } else {
      const phrasesBn = [
        "আমি ঘরের ভেতর... দরজা খোলো...",
        "পার্সেলটি এদিকে দাও...",
        "তোমার পরিবারের লোক বলছি, শোনো..."
      ];
      const phrasesEn = [
        "I am inside the room... open the door...",
        "Hand the parcel over this way...",
        "Listen, I am your kin speaking..."
      ];
      const idx = Math.floor(Math.random() * phrasesBn.length);
      phraseBn = phrasesBn[idx];
      phraseEn = phrasesEn[idx];
    }

    audioManager.playWhisper(dir, phraseBn);
    if (this.subtitleCallback) {
      this.subtitleCallback(phraseBn, phraseEn);
    }
  }

  public resetPosition(x: number, z: number) {
    this.ghostData.x = x;
    this.ghostData.z = z;
    this.ghostData.state = 'stalk';
    this.ghostMesh.position.set(x, 0, z);
  }
}
