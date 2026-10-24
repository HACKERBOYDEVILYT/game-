import * as THREE from 'three';
import { LevelDefinition } from '../types/game.ts';

export class EnvironmentBuilder {
  private textures: Record<string, THREE.CanvasTexture> = {};

  constructor() {
    this.initProceduralTextures();
  }

  // --- PROCEDURAL 2D CANVAS TEXTURES (ZERO 404s) ---
  private initProceduralTextures() {
    this.textures.mud = this.createMudTexture();
    this.textures.tin = this.createCorrugatedTinTexture();
    this.textures.wood = this.createWoodTexture();
    this.textures.brick = this.createOldBrickTexture();
    this.textures.parcel = this.createParcelTexture();
    this.textures.bamboo = this.createBambooTexture();
    this.textures.dirtRoad = this.createDirtRoadTexture();

    // Bengali Signboard Textures for shops, houses, milestones, and warnings
    this.textures.shopSign1 = this.createBengaliSignTexture(
      "খায়ের স্টোর",
      "মুদি, মনোহারী ও পার্সেল পয়েন্ট",
      "#1a2634",
      "#f59e0b",
      "রাত ১২টার পর বন্ধ"
    );
    this.textures.teaStallSign = this.createBengaliSignTexture(
      "বটতলা চা ঘর",
      "গরম চা, বিস্কুট ও আড্ডা",
      "#261814",
      "#e2e8f0",
      "মোস্তফা মিয়ার দোকান"
    );
    this.textures.houseName1 = this.createBengaliSignTexture(
      "শান্তি নীড়",
      "চৌধুরী বাড়ি (ভিটা নং ৩)",
      "#181f18",
      "#a7f3d0",
      "বহিরাগত প্রবেশ নিষেধ"
    );
    this.textures.houseName2 = this.createBengaliSignTexture(
      "স্মৃতি কুটির",
      "হরিমোহন সরকার (স্থাপিত ১৯৪২)",
      "#221c17",
      "#fef08a",
      "ওঝার মন্ত্রপূত বাড়ি"
    );
    this.textures.warningSign1 = this.createBengaliSignTexture(
      "সতর্কবার্তা!",
      "বাঁশঝাড়ে একা প্রবেশ নিষেধ",
      "#381212",
      "#fca5a5",
      "পেছনে তাকানো নিষেধ"
    );
    this.textures.schoolSign = this.createBengaliSignTexture(
      "রামচন্দ্রপুর প্রাথমিক বিদ্যালয়",
      "স্থাপিত: ১৯৫০ খ্রিঃ · পরিত্যক্ত",
      "#121f28",
      "#93c5fd",
      "রাত ৩টায় ঘণ্টা বাজে"
    );
    this.textures.milestoneSign = this.createBengaliSignTexture(
      "বটতলা মোড় ০ কিমি",
      "শ্মশানঘাট ২.৫ কিমি",
      "#2b2b2b",
      "#f8fafc",
      "সাবধান থাকুন"
    );
  }

  private createMudTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#161310';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 4 + 1;
      const shade = Math.floor(18 + Math.random() * 20);
      ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.85)}, ${Math.floor(shade * 0.7)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 14; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const pr = 20 + Math.random() * 45;
      const grad = ctx.createRadialGradient(px, py, 5, px, py, pr);
      grad.addColorStop(0, 'rgba(8, 12, 16, 0.8)');
      grad.addColorStop(1, 'rgba(22, 19, 16, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createCorrugatedTinTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#2c2f35';
    ctx.fillRect(0, 0, 256, 256);

    for (let x = 0; x < 256; x += 16) {
      const grad = ctx.createLinearGradient(x, 0, x + 16, 0);
      grad.addColorStop(0, '#1c1e22');
      grad.addColorStop(0.5, '#4a505b');
      grad.addColorStop(1, '#1a1c20');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 16, 256);
    }

    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 256;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(92, 42, 24, 0.45)' : 'rgba(120, 55, 30, 0.35)';
      ctx.fillRect(rx, ry, Math.random() * 6 + 2, Math.random() * 12 + 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createWoodTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#2d2118';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 4) {
      ctx.fillStyle = (y % 8 === 0) ? '#1f1610' : '#382b20';
      ctx.fillRect(0, y, 256, 2 + Math.random() * 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createOldBrickTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1e1c1b';
    ctx.fillRect(0, 0, 256, 256);

    const brickH = 24;
    const brickW = 48;
    for (let y = 0; y < 256; y += brickH) {
      const offset = (Math.floor(y / brickH) % 2) * (brickW / 2);
      for (let x = -brickW; x < 256 + brickW; x += brickW) {
        ctx.fillStyle = Math.random() > 0.3 ? '#4d2b24' : '#3d201b';
        ctx.fillRect(x + offset + 2, y + 2, brickW - 4, brickH - 4);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createParcelTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#3d3024';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#8b1d1d';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(128, 0); ctx.lineTo(128, 256);
    ctx.moveTo(0, 128); ctx.lineTo(256, 128);
    ctx.stroke();

    ctx.fillStyle = '#a62525';
    ctx.beginPath();
    ctx.arc(128, 128, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('৩:০০', 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createBambooTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#223825';
    ctx.fillRect(0, 0, 128, 256);

    for (let y = 30; y < 256; y += 50) {
      ctx.fillStyle = '#162318';
      ctx.fillRect(0, y, 128, 5);
      ctx.fillStyle = '#3a593e';
      ctx.fillRect(0, y + 5, 128, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Rural Bengali Dirt Track / Mud Road Texture (কাঁচা মেঠোপথ)
  private createDirtRoadTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base damp earthen dirt path
    ctx.fillStyle = '#261e16';
    ctx.fillRect(0, 0, 512, 512);

    // Parallel wheel ruts & bullock cart tracks running vertically
    ctx.fillStyle = '#140f0b';
    ctx.fillRect(100, 0, 52, 512);
    ctx.fillRect(360, 0, 52, 512);

    // Muddy puddles in wheel ruts with soft reflections
    for (let y = 30; y < 512; y += 110) {
      const grad1 = ctx.createRadialGradient(126, y, 4, 126, y, 22);
      grad1.addColorStop(0, '#090e14');
      grad1.addColorStop(1, '#140f0b');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(126, y, 22, 0, Math.PI * 2);
      ctx.fill();

      const grad2 = ctx.createRadialGradient(386, y + 45, 4, 386, y + 45, 20);
      grad2.addColorStop(0, '#090e14');
      grad2.addColorStop(1, '#140f0b');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(386, y + 45, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Footprints & gravel texture along the center of the track
    for (let i = 0; i < 3000; i++) {
      const x = 50 + Math.random() * 412;
      const y = Math.random() * 512;
      const shade = Math.floor(25 + Math.random() * 30);
      ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.8)}, ${Math.floor(shade * 0.65)})`;
      ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }

    // Grass, moss and weeds on path borders
    for (let y = 0; y < 512; y += 4) {
      ctx.fillStyle = '#111c13';
      ctx.fillRect(0, y, 40 + Math.random() * 20, 4);
      ctx.fillRect(470 - Math.random() * 20, y, 42, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 16);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Helper: Create authentic rural Bengali signboards with weathered borders
  private createBengaliSignTexture(
    titleBn: string,
    subBn: string,
    bgColor: string,
    textColor: string,
    footerBn?: string
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Background base
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 256);

    // Weathered border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 488, 232);
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 472, 216);

    // Weathering scratches & dirt
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, Math.random() * 256);
      ctx.lineTo(Math.random() * 512, Math.random() * 256);
      ctx.stroke();
    }

    // Title Bengali Text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 42px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titleBn, 256, 90);

    // Subtitle Bengali Text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px "Hind Siliguri", sans-serif';
    ctx.fillText(subBn, 256, 145);

    // Optional Footer warning or contact
    if (footerBn) {
      ctx.fillStyle = '#f87171';
      ctx.font = 'italic 18px "Hind Siliguri", sans-serif';
      ctx.fillText(footerBn, 256, 195);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // --- PROCEDURAL 3D SUBJECTS (COMPOSITE 3-12 PART THREE.Group) ---

  // 1. Rural Bengali Tin Hut (টিনের ঘর) with Bengali House Nameplate
  public createTinHut(houseSignType: 'peace' | 'memory' | 'exorcist' = 'peace'): THREE.Group {
    const hut = new THREE.Group();

    // 1. Mud plinth base
    const plinthGeo = new THREE.BoxGeometry(10, 0.8, 8);
    const plinthMat = new THREE.MeshStandardMaterial({
      map: this.textures.mud,
      roughness: 0.95,
      metalness: 0.05
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.4;
    plinth.receiveShadow = true;
    hut.add(plinth);

    // 2. Weathered bamboo walls
    const wallGeo = new THREE.BoxGeometry(9.2, 3.2, 7.2);
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.85
    });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = 2.4;
    walls.castShadow = true;
    walls.receiveShadow = true;
    hut.add(walls);

    // 3. Wooden corner pillars
    const postGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x221812, roughness: 0.9 });
    const corners = [
      [-4.6, 2.4, -3.6],
      [4.6, 2.4, -3.6],
      [-4.6, 2.4, 3.6],
      [4.6, 2.4, 3.6]
    ];
    corners.forEach(([x, y, z]) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(x, y, z);
      post.castShadow = true;
      hut.add(post);
    });

    // 4. Sloped corrugated tin roof
    const roofSlopeGeo = new THREE.BoxGeometry(10.5, 0.15, 4.6);
    const tinMat = new THREE.MeshStandardMaterial({
      map: this.textures.tin,
      roughness: 0.45,
      metalness: 0.75
    });

    const northRoof = new THREE.Mesh(roofSlopeGeo, tinMat);
    northRoof.position.set(0, 4.6, -1.9);
    northRoof.rotation.x = 0.35;
    northRoof.castShadow = true;
    hut.add(northRoof);

    const southRoof = new THREE.Mesh(roofSlopeGeo, tinMat);
    southRoof.position.set(0, 4.6, 1.9);
    southRoof.rotation.x = -0.35;
    southRoof.castShadow = true;
    hut.add(southRoof);

    // 5. Wooden delivery entrance door
    const doorGeo = new THREE.BoxGeometry(1.6, 2.4, 0.15);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x3e281b,
      roughness: 0.75,
      metalness: 0.1
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.0, 3.65);
    door.name = "delivery_door";
    hut.add(door);

    // 6. Authentic Bengali House Nameplate above door!
    const signGeo = new THREE.BoxGeometry(2.0, 0.9, 0.08);
    const signTex = houseSignType === 'peace' ? this.textures.houseName1 : this.textures.houseName2;
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.7
    });
    const houseSign = new THREE.Mesh(signGeo, signMat);
    houseSign.position.set(0, 3.4, 3.66);
    hut.add(houseSign);

    return hut;
  }

  // 2. Rural Bengali Village Shop / Tea Stall (দোকান ঘর)
  public createBengaliShop(shopType: 'grocery' | 'tea' = 'grocery'): THREE.Group {
    const shop = new THREE.Group();

    // 1. Mud plinth
    const plinthGeo = new THREE.BoxGeometry(8, 0.6, 6);
    const plinthMat = new THREE.MeshStandardMaterial({
      map: this.textures.mud,
      roughness: 0.95
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.3;
    shop.add(plinth);

    // 2. Open front timber walls
    const wallGeo = new THREE.BoxGeometry(7.6, 3.0, 5.6);
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.85
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 2.0;
    shop.add(wall);

    // 3. Wooden shop counter table (দোকানের বেঞ্চ ও পাটাতন)
    const counterGeo = new THREE.BoxGeometry(5.0, 1.1, 0.9);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x3a2518, roughness: 0.8 });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.set(0, 1.1, 2.85);
    shop.add(counter);

    // 4. Sloped corrugated tin awning
    const awningGeo = new THREE.BoxGeometry(8.5, 0.1, 4.0);
    const tinMat = new THREE.MeshStandardMaterial({
      map: this.textures.tin,
      roughness: 0.5,
      metalness: 0.7
    });
    const awning = new THREE.Mesh(awningGeo, tinMat);
    awning.position.set(0, 3.6, 2.2);
    awning.rotation.x = 0.28;
    awning.castShadow = true;
    shop.add(awning);

    // 5. Large Hand-Painted Bengali Shop Signboard!
    const signGeo = new THREE.BoxGeometry(4.2, 1.3, 0.1);
    const signTex = shopType === 'grocery' ? this.textures.shopSign1 : this.textures.teaStallSign;
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.6
    });
    const signboard = new THREE.Mesh(signGeo, signMat);
    signboard.position.set(0, 4.2, 3.1);
    signboard.rotation.x = 0.1;
    shop.add(signboard);

    // Small kerosene lantern hanging at shop corner
    const lan = this.createLanternPost();
    lan.position.set(3.5, 0, 3.0);
    lan.scale.set(0.7, 0.7, 0.7);
    shop.add(lan);

    return shop;
  }

  // 3. Roadside Bengali Warning / Milestone Board
  public createRoadsideSignboard(type: 'warning' | 'milestone' | 'school'): THREE.Group {
    const post = new THREE.Group();

    // 2 Bamboo/Wooden posts
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 2.8, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x221914, roughness: 0.9 });

    const poleL = new THREE.Mesh(poleGeo, poleMat);
    poleL.position.set(-1.0, 1.4, 0);
    poleL.castShadow = true;
    post.add(poleL);

    const poleR = new THREE.Mesh(poleGeo, poleMat);
    poleR.position.set(1.0, 1.4, 0);
    poleR.castShadow = true;
    post.add(poleR);

    // Signboard panel
    const signGeo = new THREE.BoxGeometry(2.4, 1.2, 0.08);
    let signTex = this.textures.warningSign1;
    if (type === 'milestone') signTex = this.textures.milestoneSign;
    if (type === 'school') signTex = this.textures.schoolSign;

    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.75
    });
    const panel = new THREE.Mesh(signGeo, signMat);
    panel.position.set(0, 1.9, 0);
    panel.castShadow = true;
    post.add(panel);

    return post;
  }

  // 4. Ancient Banyan Tree (বটবৃক্ষ)
  public createBanyanTree(): THREE.Group {
    const tree = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(1.8, 2.6, 6, 10);
    const barkMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.95
    });
    const trunk = new THREE.Mesh(trunkGeo, barkMat);
    trunk.position.y = 3;
    trunk.castShadow = true;
    tree.add(trunk);

    const branchGeo = new THREE.CylinderGeometry(0.6, 1.2, 5, 8);
    const branchAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
    branchAngles.forEach((ang) => {
      const branch = new THREE.Mesh(branchGeo, barkMat);
      branch.position.set(Math.cos(ang) * 1.8, 5.2, Math.sin(ang) * 1.8);
      branch.rotation.z = Math.cos(ang) * 0.7;
      branch.rotation.x = Math.sin(ang) * 0.7;
      branch.castShadow = true;
      tree.add(branch);

      const rootGeo = new THREE.CylinderGeometry(0.08, 0.12, 5.5, 6);
      const root = new THREE.Mesh(rootGeo, barkMat);
      root.position.set(Math.cos(ang) * 3.4, 2.8, Math.sin(ang) * 3.4);
      root.rotation.z = (Math.random() - 0.5) * 0.15;
      root.castShadow = true;
      tree.add(root);
    });

    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x142017,
      roughness: 0.9,
      metalness: 0.05
    });
    for (let i = 0; i < 7; i++) {
      const folGeo = new THREE.DodecahedronGeometry(2.8 + Math.random() * 1.2, 1);
      const fol = new THREE.Mesh(folGeo, foliageMat);
      fol.position.set(
        (Math.random() - 0.5) * 6,
        6.5 + Math.random() * 2,
        (Math.random() - 0.5) * 6
      );
      fol.castShadow = true;
      tree.add(fol);
    }

    return tree;
  }

  // 5. Dense Bamboo Cluster (বাঁশঝাড়)
  public createBambooCluster(count = 9): THREE.Group {
    const cluster = new THREE.Group();
    const stemGeo = new THREE.CylinderGeometry(0.12, 0.16, 9, 8);
    const bambooMat = new THREE.MeshStandardMaterial({
      map: this.textures.bamboo,
      roughness: 0.6,
      metalness: 0.1
    });

    for (let i = 0; i < count; i++) {
      const stem = new THREE.Mesh(stemGeo, bambooMat);
      const radius = Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      stem.position.set(Math.cos(angle) * radius, 4.5, Math.sin(angle) * radius);
      stem.rotation.z = (Math.random() - 0.5) * 0.22;
      stem.rotation.x = (Math.random() - 0.5) * 0.22;
      stem.castShadow = true;
      cluster.add(stem);
    }

    return cluster;
  }

  // 6. Kerosene Lantern Station (নিরাপদ লণ্ঠন স্ট্যান্ড)
  public createLanternPost(): THREE.Group {
    const post = new THREE.Group();

    const poleGeo = new THREE.CylinderGeometry(0.1, 0.12, 3.2, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x271e16, roughness: 0.9 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.6;
    pole.castShadow = true;
    post.add(pole);

    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6);
    const arm = new THREE.Mesh(armGeo, poleMat);
    arm.position.set(0.3, 3.0, 0);
    arm.rotation.z = Math.PI / 2;
    post.add(arm);

    const lanFrameGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8);
    const lanFrameMat = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.8, roughness: 0.3 });
    const lantern = new THREE.Mesh(lanFrameGeo, lanFrameMat);
    lantern.position.set(0.6, 2.7, 0);
    post.add(lantern);

    const glassGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.35, 8);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0.6, 2.7, 0);
    post.add(glass);

    const light = new THREE.PointLight(0xff9e2c, 2.5, 12, 1.8);
    light.position.set(0.6, 2.7, 0);
    light.castShadow = true;
    light.name = "lantern_light";
    post.add(light);

    return post;
  }

  // 7. Bamboo Fence Segment (বাঁশের বেড়া)
  public createBambooFence(): THREE.Group {
    const fence = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.0, 6);
    const postGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.8, 6);
    const mat = new THREE.MeshStandardMaterial({ color: 0x33281d, roughness: 0.9 });

    const post1 = new THREE.Mesh(postGeo, mat);
    post1.position.set(-1.8, 0.9, 0);
    post1.castShadow = true;
    fence.add(post1);

    const post2 = new THREE.Mesh(postGeo, mat);
    post2.position.set(1.8, 0.9, 0);
    post2.castShadow = true;
    fence.add(post2);

    const rail1 = new THREE.Mesh(railGeo, mat);
    rail1.rotation.z = Math.PI / 2;
    rail1.position.set(0, 0.6, 0);
    fence.add(rail1);

    const rail2 = new THREE.Mesh(railGeo, mat);
    rail2.rotation.z = Math.PI / 2;
    rail2.position.set(0, 1.3, 0);
    fence.add(rail2);

    for (let x = -1.6; x <= 1.6; x += 0.35) {
      const slatGeo = new THREE.BoxGeometry(0.06, 1.5, 0.04);
      const slat = new THREE.Mesh(slatGeo, mat);
      slat.position.set(x, 0.8, 0);
      slat.rotation.z = (Math.random() - 0.5) * 0.15;
      fence.add(slat);
    }

    return fence;
  }

  // 8. Zamindar Palace Ruin Wall with Pillars
  public createZamindarRuin(): THREE.Group {
    const ruin = new THREE.Group();
    const brickMat = new THREE.MeshStandardMaterial({
      map: this.textures.brick,
      roughness: 0.92
    });

    const wallGeo = new THREE.BoxGeometry(14, 5.5, 1.2);
    const wall = new THREE.Mesh(wallGeo, brickMat);
    wall.position.y = 2.75;
    wall.castShadow = true;
    wall.receiveShadow = true;
    ruin.add(wall);

    const colGeo = new THREE.CylinderGeometry(0.55, 0.65, 5.8, 12);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x4a2a22, roughness: 0.85 });
    [-5.5, 5.5].forEach((x) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(x, 2.9, 0.7);
      col.castShadow = true;
      ruin.add(col);
    });

    return ruin;
  }

  // Delivery Courier Motorbike (Hero Commuter Motorcycle with Courier Carrier Box & Headlight)
  public createDeliveryBike(): THREE.Group {
    const bike = new THREE.Group();
    bike.name = 'delivery_bike';

    // Materials
    const metalDarkMat = new THREE.MeshStandardMaterial({ color: 0x1a1c22, metalness: 0.85, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdde3ea, metalness: 0.95, roughness: 0.12 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.92, metalness: 0.05 });
    const bikeBodyMat = new THREE.MeshStandardMaterial({ color: 0x8b1a1a, metalness: 0.7, roughness: 0.28 });
    const leatherSeatMat = new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.85, metalness: 0.05 });

    // 1. Wheels (Front & Rear)
    const wheelGeo = new THREE.TorusGeometry(0.36, 0.075, 12, 24);
    const rimGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.06, 16);
    rimGeo.rotateZ(Math.PI / 2);

    // Front Wheel (z = -0.85, y = 0.36)
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.36, -0.85);
    const fwTire = new THREE.Mesh(wheelGeo, rubberMat);
    fwTire.rotation.y = Math.PI / 2;
    fwTire.castShadow = true;
    frontWheel.add(fwTire);
    const fwRim = new THREE.Mesh(rimGeo, chromeMat);
    frontWheel.add(fwRim);
    bike.add(frontWheel);

    // Rear Wheel (z = 0.85, y = 0.36)
    const rearWheel = new THREE.Group();
    rearWheel.position.set(0, 0.36, 0.85);
    const rwTire = new THREE.Mesh(wheelGeo, rubberMat);
    rwTire.rotation.y = Math.PI / 2;
    rwTire.castShadow = true;
    rearWheel.add(rwTire);
    const rwRim = new THREE.Mesh(rimGeo, chromeMat);
    rearWheel.add(rwRim);
    bike.add(rearWheel);

    // 2. Front Telescopic Fork & Mudguard
    const forkGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.85, 10);
    const forkL = new THREE.Mesh(forkGeo, chromeMat);
    forkL.position.set(-0.11, 0.58, -0.74);
    forkL.rotation.x = 0.28;
    forkL.castShadow = true;
    bike.add(forkL);

    const forkR = new THREE.Mesh(forkGeo, chromeMat);
    forkR.position.set(0.11, 0.58, -0.74);
    forkR.rotation.x = 0.28;
    forkR.castShadow = true;
    bike.add(forkR);

    // Front Fender (Mudguard)
    const fenderGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.12, 16, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    fenderGeo.rotateZ(Math.PI / 2);
    const fenderF = new THREE.Mesh(fenderGeo, bikeBodyMat);
    fenderF.position.set(0, 0.38, -0.85);
    bike.add(fenderF);

    // 3. Main Frame & Swingarm
    const frameMainGeo = new THREE.CylinderGeometry(0.038, 0.038, 1.25, 8);
    frameMainGeo.rotateX(Math.PI / 2.7);
    const frameMain = new THREE.Mesh(frameMainGeo, metalDarkMat);
    frameMain.position.set(0, 0.62, -0.15);
    frameMain.castShadow = true;
    bike.add(frameMain);

    // Rear Swingarm
    const swingarmGeo = new THREE.BoxGeometry(0.24, 0.05, 0.72);
    const swingarm = new THREE.Mesh(swingarmGeo, metalDarkMat);
    swingarm.position.set(0, 0.4, 0.45);
    bike.add(swingarm);

    // 4. Engine Block & Chrome Exhaust
    const engineGeo = new THREE.BoxGeometry(0.26, 0.3, 0.35);
    const engine = new THREE.Mesh(engineGeo, metalDarkMat);
    engine.position.set(0, 0.45, -0.15);
    engine.castShadow = true;
    bike.add(engine);

    // Engine cylinder head cooling fins
    for (let f = 0; f < 4; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.015, 0.3), metalDarkMat);
      fin.position.set(0, 0.48 + f * 0.04, -0.15);
      bike.add(fin);
    }

    // Chrome Exhaust Pipe & Muffler
    const exhaustGeo = new THREE.CylinderGeometry(0.042, 0.036, 0.85, 12);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaust.position.set(0.16, 0.32, 0.45);
    exhaust.castShadow = true;
    bike.add(exhaust);

    // 5. Fuel Tank & Courier Badges
    const tankGeo = new THREE.BoxGeometry(0.3, 0.22, 0.58);
    const tank = new THREE.Mesh(tankGeo, bikeBodyMat);
    tank.position.set(0, 0.82, -0.32);
    tank.rotation.x = -0.15;
    tank.castShadow = true;
    bike.add(tank);

    // Chrome Fuel Cap
    const capGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12);
    const gasCap = new THREE.Mesh(capGeo, chromeMat);
    gasCap.position.set(0, 0.95, -0.35);
    bike.add(gasCap);

    // 6. Leather Dual Seat
    const seatGeo = new THREE.BoxGeometry(0.26, 0.1, 0.65);
    const seat = new THREE.Mesh(seatGeo, leatherSeatMat);
    seat.position.set(0, 0.84, 0.2);
    seat.rotation.x = 0.05;
    seat.castShadow = true;
    bike.add(seat);

    // 7. Handlebars, Instrument Pod & Mirrors
    const barGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.68, 8);
    barGeo.rotateZ(Math.PI / 2);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.position.set(0, 1.02, -0.6);
    bike.add(bar);

    // Handlebar Grips
    [-0.31, 0.31].forEach((gx) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.12, 8), rubberMat);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(gx, 1.02, -0.6);
      bike.add(grip);
    });

    // Rearview mirrors
    [-0.28, 0.28].forEach((mx) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.16, 6), chromeMat);
      stem.position.set(mx, 1.1, -0.6);
      bike.add(stem);
      const mirror = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), chromeMat);
      mirror.position.set(mx, 1.18, -0.6);
      bike.add(mirror);
    });

    // 8. Headlight with Glowing Halogen Lens & Forward Light Beam
    const headlightCasing = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16), chromeMat);
    headlightCasing.rotation.x = Math.PI / 2;
    headlightCasing.position.set(0, 0.86, -0.78);
    bike.add(headlightCasing);

    const headlightLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfff6cf,
        emissive: 0xffdc66,
        emissiveIntensity: 1.6,
        roughness: 0.1
      })
    );
    headlightLens.position.set(0, 0.86, -0.842);
    headlightLens.rotation.y = Math.PI;
    bike.add(headlightLens);

    // Active Bike Headlight Spotlight projecting forward onto the road
    const bikeLight = new THREE.SpotLight(0xffea88, 3.2, 25, Math.PI / 5.2, 0.45, 1.2);
    bikeLight.position.set(0, 0.86, -0.85);
    const bikeLightTarget = new THREE.Object3D();
    bikeLightTarget.position.set(0, 0.1, -15);
    bike.add(bikeLightTarget);
    bikeLight.target = bikeLightTarget;
    bikeLight.castShadow = true;
    bike.add(bikeLight);

    // 9. Rear Carrier Rack & Delivery Courier Box (রাত ৩টার এক্সপ্রেস কুরিয়ার ব্যাগ)
    const rackGeo = new THREE.BoxGeometry(0.38, 0.04, 0.52);
    const rack = new THREE.Mesh(rackGeo, metalDarkMat);
    rack.position.set(0, 0.85, 0.72);
    bike.add(rack);

    // Heavy Delivery Courier Box
    const boxGeo = new THREE.BoxGeometry(0.44, 0.38, 0.42);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x851c1c,
      roughness: 0.75,
      metalness: 0.15
    });
    const courierBox = new THREE.Mesh(boxGeo, boxMat);
    courierBox.position.set(0, 1.05, 0.72);
    courierBox.castShadow = true;
    bike.add(courierBox);

    // Reflective Safety Yellow Straps on Courier Box
    const strapGeo = new THREE.BoxGeometry(0.444, 0.045, 0.424);
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0x854d0e,
      emissiveIntensity: 0.4
    });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.position.set(0, 1.05, 0.72);
    bike.add(strap);

    // 10. Kickstand leaning the bike naturally on the dirt road shoulder
    const kickstandGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.45, 8);
    const kickstand = new THREE.Mesh(kickstandGeo, metalDarkMat);
    kickstand.position.set(-0.16, 0.2, 0.1);
    kickstand.rotation.z = -0.42;
    kickstand.rotation.x = -0.15;
    bike.add(kickstand);

    // Slight realistic lean to the left due to kickstand
    bike.rotation.z = 0.08;

    return bike;
  }

  // Build the complete 3D scene according to Level Definition
  public buildLevelEnvironment(level: LevelDefinition, scene: THREE.Scene): THREE.Object3D[] {
    const interactables: THREE.Object3D[] = [];

    // 1. Mud / Terrain Ground (Dark midnight soil)
    const groundGeo = new THREE.PlaneGeometry(160, 160, 24, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.textures.mud,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. The Village Mud Road (কাঁচা মেঠোপথ) - running directly under player's feet all the way to destination!
    const roadGeo = new THREE.PlaneGeometry(5.2, 85);
    const roadMat = new THREE.MeshStandardMaterial({
      map: this.textures.dirtRoad,
      roughness: 0.85,
      metalness: 0.15
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.03, -3); // slightly above ground to prevent z-fighting
    road.receiveShadow = true;
    scene.add(road);

    // 3. Dense Village Layout flanking the road (Left & Right side):
    // Left side of road (x ~ -6.8 to -7.5):
    // Near spawn (z = 18): Roadside Tea Stall "বটতলা চা ঘর (মোস্তফা মিয়ার দোকান)"
    const teaStallL = this.createBengaliShop('tea');
    teaStallL.position.set(-6.8, 0, 18);
    teaStallL.rotation.y = Math.PI * 0.45;
    scene.add(teaStallL);

    // Mid road (z = 6): Village house "শান্তি নীড় - চৌধুরী বাড়ি"
    const house1 = this.createTinHut('peace');
    house1.position.set(-7.5, 0, 6);
    house1.rotation.y = Math.PI * 0.45;
    scene.add(house1);

    // Further down (z = -8): Grocery shop "খায়ের স্টোর - মুদি ও মনোহারী"
    const groceryShop = this.createBengaliShop('grocery');
    groceryShop.position.set(-6.8, 0, -8);
    groceryShop.rotation.y = Math.PI * 0.45;
    scene.add(groceryShop);

    // Near destination (z = -22): House "স্মৃতি কুটির - হরিমোহন সরকার"
    const house2 = this.createTinHut('memory');
    house2.position.set(-7.5, 0, -22);
    house2.rotation.y = Math.PI * 0.5;
    scene.add(house2);

    // Right side of road (x ~ +6.8 to +7.5):
    // Near spawn (z = 16): Homestead house with tin roof and porch lantern
    const rightHouse1 = this.createTinHut('memory');
    rightHouse1.position.set(7.5, 0, 16);
    rightHouse1.rotation.y = -Math.PI * 0.45;
    scene.add(rightHouse1);

    // Mid road (z = 3): Another village shop with tea kettle & benches
    const teaStallR = this.createBengaliShop('tea');
    teaStallR.position.set(6.8, 0, 3);
    teaStallR.rotation.y = -Math.PI * 0.45;
    scene.add(teaStallR);

    // Ancient Banyan Tree with prop roots beside road at z = -10
    const banyan = this.createBanyanTree();
    banyan.position.set(8.5, 0, -10);
    scene.add(banyan);

    // Further down (z = -24): Another homestead house "শান্তি নীড়"
    const rightHouse2 = this.createTinHut('peace');
    rightHouse2.position.set(7.8, 0, -24);
    rightHouse2.rotation.y = -Math.PI * 0.5;
    scene.add(rightHouse2);

    // Main Destination House at the end of the road (z = -35)!
    const destinationHut = this.createTinHut('peace');
    destinationHut.position.set(level.destination.x, 0, level.destination.z);
    destinationHut.rotation.y = Math.PI;
    scene.add(destinationHut);
    interactables.push(destinationHut);

    // 3.5 Delivery Rider's Commuter Motorbike with Courier Carrier Box (ডেলিভারি ম্যানের বাইক)
    const bike = this.createDeliveryBike();
    bike.position.set(2.2, 0, 23.5);
    bike.rotation.y = -Math.PI * 0.12;
    scene.add(bike);
    interactables.push(bike);

    // 4. Roadside Fences and Street Lanterns every 12m along the path
    for (let z = 28; z >= -34; z -= 12) {
      // Lantern post on left and right verges of the road
      const postL = this.createLanternPost();
      postL.position.set(-3.2, 0, z);
      scene.add(postL);

      // Bamboo fence segments along edges
      const fenceL = this.createBambooFence();
      fenceL.position.set(-3.2, 0, z - 6);
      fenceL.rotation.y = Math.PI / 2;
      scene.add(fenceL);

      const fenceR = this.createBambooFence();
      fenceR.position.set(3.2, 0, z - 6);
      fenceR.rotation.y = Math.PI / 2;
      scene.add(fenceR);
    }

    // Milestones & Warning signs along the road verge right in front of player
    const milestone = this.createRoadsideSignboard('milestone');
    milestone.position.set(2.8, 0, 22);
    milestone.rotation.y = Math.PI;
    scene.add(milestone);

    const warningSign = this.createRoadsideSignboard('warning');
    warningSign.position.set(-2.8, 0, 13);
    warningSign.rotation.y = Math.PI;
    scene.add(warningSign);
    if (level.environmentType === 'schoolhouse') {
      const schoolBoard = this.createRoadsideSignboard('school');
      schoolBoard.position.set(0, 0, 10);
      scene.add(schoolBoard);
    } else if (level.environmentType === 'zamindar_palace') {
      const palace1 = this.createZamindarRuin();
      palace1.position.set(0, 0, -32);
      scene.add(palace1);

      const palaceWingL = this.createZamindarRuin();
      palaceWingL.position.set(-16, 0, -18);
      palaceWingL.rotation.y = Math.PI / 2;
      scene.add(palaceWingL);

      const palaceWingR = this.createZamindarRuin();
      palaceWingR.position.set(16, 0, -18);
      palaceWingR.rotation.y = -Math.PI / 2;
      scene.add(palaceWingR);
    } else {
      for (let i = -3; i <= 3; i++) {
        const fenceL = this.createBambooFence();
        fenceL.position.set(-8, 0, i * 7);
        fenceL.rotation.y = Math.PI / 2;
        scene.add(fenceL);

        const fenceR = this.createBambooFence();
        fenceR.position.set(8, 0, i * 7);
        fenceR.rotation.y = Math.PI / 2;
        scene.add(fenceR);
      }

      const tree = this.createBanyanTree();
      tree.position.set(16, 0, 5);
      scene.add(tree);
    }

    // 7. Fireflies (Glowing floating particles)
    const fireflyCount = 40;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPos = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount * 3; i += 3) {
      fireflyPos[i] = (Math.random() - 0.5) * 60;
      fireflyPos[i + 1] = 0.5 + Math.random() * 2.8;
      fireflyPos[i + 2] = (Math.random() - 0.5) * 60;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0x88ff66,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
    fireflyPoints.name = "fireflies";
    scene.add(fireflyPoints);

    return interactables;
  }
}
