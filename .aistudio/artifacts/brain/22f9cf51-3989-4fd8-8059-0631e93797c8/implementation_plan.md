# রাত ৩টার ডেলিভারি (3 AM Delivery) - 3D Horror Game Implementation Plan

A comprehensive, production-grade first-person 3D psychological horror puzzle game set in rural Bengal at 3:00 AM, combining an instantly playable WebGL/Three.js 3D game engine (responsive for PC and Android touchscreens) with rich Bengali spatial audio, complete 10-level campaign progression, 3 intelligent folklore ghost entities, and exportable Godot 4.x source files and Android/Web export configurations.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned via interactive user clarification and creative directives:

- **Confirmed Decision 1 (Dual Engine Delivery)**: The primary experience will be a 100% playable real-time 3D first-person game engine running directly in the browser via Three.js (WebGL 2, PBR materials, procedural textures, dynamic flashlight, volumetric fog, smooth mouse look & virtual touchscreen joystick for Android). In parallel, a complete, cleanly structured Godot 4.x project directory (`/godot_project/`) with full GDScript source files, scenes, collision shapes, audio buses, and Android/Web export presets (`export_presets.cfg`) will be provided and exportable.
- **Confirmed Decision 2 (Atmospheric Psychological Pacing)**: The gameplay prioritizes suspense, atmospheric dread, and rule-based survival over cheap, repetitive jumpscares. Silence is treated as a core mechanic; fear is driven by ambient shift, distant calls, and environmental cues.
- **Confirmed Decision 3 (Bangla Soundscape & Voice System)**: Implements an authentic Web Audio API spatial 3D sound synthesizer and directional audio engine with binaural distance attenuation, rural night ambiance (Bengali crickets, bullfrogs, howling jackals, wind through bamboo groves, tin roof creaks, water lap), realistic surface footsteps (mud, puddle, wooden floor), and layered Bengali whispers with English subtitles.

---

## 1. Overview & Core Concept

- **What It Does**: The player takes on the role of a night delivery rider in rural Bangladesh. At 3:00 AM, mysterious delivery assignments arrive on an old burner phone. The player must navigate rural pathways—bamboo groves (*বাঁশঝাড়*), ancient banyan trees (*বটতলা*), muddy pond banks (*পুকুর ঘাট*), cremation grounds (*শ্মশান*), abandoned primary schools (*পরিত্যক্ত স্কুল*), and crumbling zamindar palaces (*জমিদারবাড়ি*)—to deliver occult parcels while strictly obeying local supernatural rules to survive.
- **Target Audience / Persona**: Fans of atmospheric folk horror (e.g., *Devotion*, *Fears to Fathom*, *Ray's supernatural stories*) and Bengali folklore enthusiasts seeking an authentic rural Bangladeshi horror experience on both desktop browsers and Android mobile devices.
- **Key Value**: Delivers an immediate, zero-install, zero-404 playable 3D experience with full 10-level progression and touch/keyboard input, accompanied by production-ready Godot 4 project assets for native compilation.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Title & Menu Screen**:
   - Atmospheric charcoal/crimson title screen with Bengali typography (`রাত ৩টার ডেলিভারি / 3 AM Delivery`), flickering lantern glow, distant thunder, and cricket ambiances.
   - Menu actions: **নতুন খেলা (New Game)**, **চালিয়ে যান (Continue)**, **অধ্যায় নির্বাচন (Chapters)**, **সেটিংস (Settings)**, **Godot প্রজেক্ট ডাউনলোড (Godot Source)**, **কৃতজ্ঞতা (Credits)**.
2. **In-Game First-Person Exploration**:
   - High-fidelity 3D viewport: player holds a delivery parcel in one hand and a dynamic flashlight (*টর্চলাইট*) in the other.
   - Minimalist cinematic HUD: battery gauge, parcel status, current mission objective in Bengali with English toggle, and prompt keys (`[E] ধরুন / Interact`, `[F] টর্চ / Flashlight`, `[Shift] দৌড় / Sprint`, `[C] বসুন / Crouch`).
   - Mobile touch layout: virtual dual-stick joystick (left thumb movement, right swipe camera look), action buttons with haptic feedback, and auto-clue drawer.
3. **Ghost Encounters & Rule-Based Counterplay**:
   - **পেছনের ডাক (The Caller Behind)**: A chilling voice calls from behind using human tone. *Rule: Never look back or turn 180 degrees while walking forward until reaching the shelter lantern.*
   - **ছায়ামورٹی (The Shadow Stalker)**: Moves only when unobserved or in absolute pitch black. *Rule: Keep light focused and move from lantern to lantern without lingering in open shadows.*
   - **নিশির অতিথি (Nishi's Deception)**: Mimics familiar friendly voices calling toward false doors and death traps. *Rule: Check parcel address runes and lantern oil colors before opening doors.*
4. **Mission Completion & Narrative Archive**:
   - Delivering the parcel triggers a satisfying door lock mechanism, handwritten story fragment reveal, and level rating based on sanity and time, saving progress automatically.

### Visual Identity & Theme

- **Aesthetic Direction**: Grounded rural Bangladeshi gothic realism at 3 AM. Mud paths, rustic tin-roof houses with bamboo fencing (*বেড়া*), water hyacinth ponds, weathered brick ruins, and dense bamboo clusters.
- **Color Palette & Mood**:
  - Neutral Canvas (60%): Deep midnight black `#080A0F`, swamp slate `#0F171E`, and damp mud `#1A1612`.
  - Structural Surfaces (30%): Weathered bamboo green `#243328`, rusted corrugated tin `#3B3530`, and moonlight silver-blue `#2E3A4A`.
  - Accent Budget (10%): Warm kerosene lantern amber `#FF9E2C` (safe zones), eerie pale specter white `#E2E8F0`, and warning talisman crimson `#DC2626`.
- **Typography & Hierarchy**:
  - Primary Bengali Display: *Hind Siliguri* & *Anek Bangla* with high legibility on dark backgrounds.
  - English Secondary: *Plus Jakarta Sans* for clean, modern HUD indicators.
  - Data & Coordinates: Tabular numerals for battery percentage, parcel delivery timer, and coordinates.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct In-Browser Playable Three.js WebGL Engine**:
  - *Chosen Approach*: Build a full 60fps first-person 3D WebGL engine inside React using Three.js r160+ with procedural PBR materials, custom geometry generators (bamboo groves, tin huts, rural fences, ponds, lanterns), dynamic lighting, and collision meshes.
  - *Why*: Allows instantaneous playability inside AI Studio's preview window and any mobile or desktop browser without requiring users to download or compile external tools first.
  - *Alternatives Considered*: Showing only Godot GDScript code text would leave the user with an empty screen in AI Studio; Three.js delivers an immediate playable game.
- **Decision 2: Exportable Godot 4 Project Generator**:
  - *Chosen Approach*: Include an in-app Godot export inspector and ZIP packager containing all 10 Godot `.tscn` level scenes, complete `.gd` scripts, project configuration (`project.godot`), export presets (`export_presets.cfg` for Android APK and WebAssembly), and build instructions.
  - *Why*: Perfectly satisfies the user's explicit requirement for Godot 4.x GDScript source code while keeping the web preview active and engaging.
- **Decision 3: Zero-404 Procedural Web Audio 3D Spatial Engine**:
  - *Chosen Approach*: Synthesize realistic 3D soundscapes via Web Audio API nodes (sub-bass room tones, pink-noise filtered wind, procedural cricket chirps, resonant tin vibrations, footstep acoustics on mud vs wood, and layered formant whispers) with HRTF spatial panners.
  - *Why*: Guaranteed 100% reliable audio with zero external file 404s, instantaneous load times, and dynamic responsiveness to player distance from ghosts and safe zones.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Main Root Hub)                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
┌───▼───────────────────────────┐               ┌───────────────────▼───┐
│        UI & Menu System       │               │    Three.js 3D View   │
│  - MainMenuScreen             │               │  - WebGLRenderer      │
│  - LevelSelectionModal        │               │  - PerspectiveCamera  │
│  - SettingsModal (Graphics/SFX│               │  - FogExp2 & Lighting │
│  - ClueJournal & ParcelHUD    │               │  - Collision World    │
│  - GodotExportExporter        │               │  - Procedural Meshes  │
└───┬───────────────────────────┘               └───┬───────────────────┘
    │                                               │
    │  State & Actions                              │  Render & Physics
    ▼                                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      GameEngineController (Core)                       │
│  - LevelManager (10 Mission Layouts, Objectives & Win/Fail Conditions) │
│  - PlayerController (First-Person, WASD/Touch, Flashlight, Battery)   │
│  - GhostAIManager (Patrol, Stalk, Chase, Counterplay State Machine)    │
│  - SpatialAudioEngine (3D Web Audio: Whispers, Crickets, Steps, Heart) │
│  - SaveManager (LocalStorage Persistence for Progress & Settings)      │
└────────────────────────────────────────────────────────────────────────┘
```

### The 10 Unique Playable Missions

| Level | Title (Bengali & English) | Setting | Unique Supernatural Rule | Parcel Item |
| :--- | :--- | :--- | :--- | :--- |
| **01** | বটতলার শেষ বাড়ি (The Last House at Bottola) | Ancient Banyan Crossroads | *Never turn back when hearing your name called from behind.* | Black Talisman Box |
| **02** | বাঁশঝাড়ের পথ (Path Through the Bamboo Grove) | Dense Creaking Bamboo Tunnel | *If a pale figure appears ahead, bow flashlight down and follow firefly lamps.* | White Shroud Offering |
| **03** | পুরোনো বাড়ি (The Ancestral Homestead) | Dilapidated Brick Courtyard | *Only enter the door that responds with 3 knocks; beware false echoes.* | Brass Oil Lamp |
| **04** | শ্মশানের পথ (The Cremation Byway) | Mist-shrouded Riverbank Pier | *Stay within the circle of moonlight; do not step into unlit marsh shadows.* | Clay Burial Urn |
| **05** | পরিত্যক্ত স্কুল (The Abandoned Schoolhouse) | Overgrown Rural High School | *Solve blackboard chalk puzzle to decipher the classroom gate sequence.* | Vintage Register Book |
| **06** | নদীর ঘাট (The River Ghat) | Black Water Ferry Crossing | *Ignore illusions in water reflections; rely only on the boatman's bell.* | Sealed River Salt Sack |
| **07** | বটগাছের মোড় (The Endless Crossroads) | Looping Mist Corridor | *Find subtle environmental discrepancies (broken fence, tilted clay pot) to break the loop.* | Red Thread Knot |
| **08** | কবরস্থানের পাশ (Beside the Graveyard) | Forgotten Burial Grounds | *Listen for temple bell chimes to rush into sheltered gazebos before ghosts converge.* | Incense Censer |
| **09** | জমিদারবাড়ি (The Zamindar Mansion) | Ruined Colonial Estate | *Find 3 antique iron keys while hiding in cupboards from the roving Shadow Stalker.* | Silver Crested Box |
| **10** | শেষ ডেলিভারি (The Final Delivery) | The Forgotten Shrine of 3 AM | *Combine all previous survival rules in a climactic ritual to deliver the final forbidden parcel.* | The 3 AM Master Parcel |

### Three Supernatural Ghost Entities

1. **পেছনের ডাক (The Caller Behind)**:
   - *AI States*: `IDLE` -> `STALKING_BEHIND` -> `CALLING_VOICE` -> `ENRAGE_IF_TURNED` -> `ATTACK`.
   - *Mechanic*: Spawns behind player distance (12m). Checks dot product of player camera facing vs ghost position. If player looks within 45 degrees, trigger scream and speed boost; player must keep eyes forward.
2. **ছায়ামূর্তি (The Shadow Stalker)**:
   - *AI States*: `HIDE_IN_DARK` -> `APPROACH_IN_SHADOW` -> `FREEZE_IN_BEAM` -> `VANISH`.
   - *Mechanic*: Only moves when player's flashlight is off or pointed away. Shining the flashlight directly freezes it, causing it to emit a hiss and slowly fade into smoke.
3. **নিশির অতিথি (Nishi's Deception)**:
   - *AI States*: `LURE_TARGET` -> `DISGUISE_VOICE` -> `AMBUSH_TRAP`.
   - *Mechanic*: Plays familiar audio whispers from wrong doorways or side alleys. Player must consult their parcel delivery map and glowing safe runes to verify legitimacy before approaching.

### Godot 4 Project Structure (`/godot_project/`)

- `project.godot`: Engine settings, input mappings (mouse capture, WASD, touch emulation), 3D render pipeline.
- `export_presets.cfg`: Presets for Android APK (GLES3/Compatibility renderer, touch permissions) and WebAssembly.
- `scripts/`:
  - `player_controller.gd`: First-person movement, head bob, flashlight battery, raycast interaction.
  - `ghost_ai.gd`: State machine with detection cones, navmesh pathfinding, and attack triggers.
  - `puzzle_manager.gd`: Level objective verifier and door unlocking logic.
  - `audio_manager.gd`: AudioBus setup for master, ambience, sfx, and voice with reverb and lowpass filters.
- `scenes/`:
  - `main_menu.tscn`, `player.tscn`, `levels/level_01_bottola.tscn` through `level_10_final.tscn`.
- `README.md`: Godot 4 setup, Android SDK export guide, and HTML5 deployment steps.

---

## 5. Verification & Quality Assurance Plan

1. **3D Performance & Graphics**: Test WebGL 2 on both desktop mouse/keyboard and mobile virtual touch controls. Ensure 60fps frame rates with low-overhead procedural geometry and instanced foliage.
2. **Audio Spatialisation**: Verify Web Audio API directional panning, distance attenuation, and smooth ambient transitions on headphones and mobile speakers.
3. **Gameplay Mechanics**: Complete play-through verification of all 10 levels from Level 1 to the final Level 10 ending, verifying save persistence, retry checkpoints, and settings (SFX volume, sensitivity, graphics quality).
4. **Godot Project Integrity**: Ensure all GDScripts, scenes, and export configs conform to Godot 4.x standards with clean syntax and documented integration steps.
