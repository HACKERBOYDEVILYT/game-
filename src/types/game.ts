export type GameScreen = 
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'LEVEL_SELECT'
  | 'SETTINGS'
  | 'JOURNAL'
  | 'GAME_OVER'
  | 'LEVEL_COMPLETE'
  | 'CREDITS'
  | 'GODOT_EXPORT';

export type GhostType = 'caller_behind' | 'shadow_stalker' | 'nishi_guest';

export type GhostBehaviorState = 'patrol' | 'stalk' | 'chase' | 'attack' | 'retreat' | 'frozen';

export interface GhostData {
  type: GhostType;
  nameBn: string;
  nameEn: string;
  loreBn: string;
  loreEn: string;
  ruleBn: string;
  ruleEn: string;
  x: number;
  z: number;
  rotationY: number;
  state: GhostBehaviorState;
  speed: number;
  alertLevel: number; // 0 to 100
  distanceToPlayer: number;
  isObserved: boolean;
  whisperTimer: number;
}

export interface ClueItem {
  id: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  found: boolean;
  iconType: 'note' | 'symbol' | 'key' | 'talisman';
}

export interface InventoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'parcel' | 'key' | 'note' | 'talisman';
  descriptionBn: string;
  descriptionEn: string;
  loreBn: string;
  loreEn: string;
  iconType: 'parcel' | 'key' | 'note' | 'talisman';
}

export interface LevelDefinition {
  id: number;
  number: number;
  titleBn: string;
  titleEn: string;
  locationBn: string;
  locationEn: string;
  ruleBn: string;
  ruleEn: string;
  objectiveBn: string;
  objectiveEn: string;
  parcelNameBn: string;
  parcelNameEn: string;
  parcelDescriptionBn: string;
  parcelDescriptionEn: string;
  parcelWeight: string;
  parcelWeightEn: string;
  loreUnlockBn: string;
  loreUnlockEn: string;
  ghostType: GhostType;
  playerSpawn: { x: number; z: number; rotationY: number };
  destination: { x: number; z: number; radius: number; labelBn: string; labelEn: string };
  lanternStations: Array<{ x: number; z: number; safeRadius: number }>;
  clues: ClueItem[];
  puzzleCodeRequired?: string;
  environmentType: 'village_crossroads' | 'bamboo_grove' | 'old_homestead' | 'river_ghat' | 'cremation_ground' | 'schoolhouse' | 'zamindar_palace' | 'graveyard' | 'endless_loop' | 'final_shrine';
}

export interface GameSettings {
  graphicsQuality: 'low' | 'med' | 'high';
  masterVolume: number;
  ambientVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  mouseSensitivity: number;
  invertY: boolean;
  language: 'bn' | 'en';
  subtitles: boolean;
  vibration: boolean;
  cameraViewMode: 'first_person' | 'third_person';
}

export interface PlayerStats {
  health: number; // 0 to 100
  sanity: number; // 0 to 100
  battery: number; // 0 to 100
  flashlightOn: boolean;
  isSprinting: boolean;
  isCrouched: boolean;
  isLookingBack: boolean;
  hasParcel: boolean;
  cameraViewMode: 'first_person' | 'third_person';
  inventoryKeys: string[];
  collectedClues: string[];
  inventoryItems: InventoryItem[];
}
