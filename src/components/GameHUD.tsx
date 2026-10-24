import React, { useState, useRef, useEffect } from 'react';
import { PlayerStats, LevelDefinition, GameSettings, InventoryItem } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { 
  Flashlight, 
  BookOpen, 
  Package, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Key, 
  FileText, 
  Shield, 
  X, 
  Sparkles, 
  Info, 
  User,
  Hand,
  Footprints,
  Eye
} from 'lucide-react';

interface GameHUDProps {
  stats: PlayerStats;
  level: LevelDefinition;
  settings: GameSettings;
  interactPrompt: { bn: string; en: string } | null;
  subtitle: { bn: string; en: string } | null;
  onToggleFlashlight: () => void;
  onToggleCameraView?: () => void;
  onToggleSprint?: () => void;
  onToggleCrouch?: () => void;
  onInteract: () => void;
  onOpenJournal: () => void;
  onPause: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onTouchMoveUpdate: (x: number, y: number) => void;
  onTouchLookUpdate: (dx: number, dy: number) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  level,
  settings,
  interactPrompt,
  subtitle,
  onToggleFlashlight,
  onToggleCameraView,
  onToggleSprint,
  onToggleCrouch,
  onInteract,
  onOpenJournal,
  onPause,
  onToggleMute,
  isMuted,
  onTouchMoveUpdate,
  onTouchLookUpdate
}) => {
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'parcel' | 'key' | 'note'>('all');
  const [showLookHint, setShowLookHint] = useState(true);

  // Dynamic Virtual Joystick State
  const [joystickOffset, setJoystickOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const joystickTouchId = useRef<number | null>(null);
  const joystickOrigin = useRef<{ x: number; y: number } | null>(null);

  // Touch Look Tracking
  const touchLookStart = useRef<{ x: number; y: number } | null>(null);

  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  // Fade look hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLookHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Filter inventory items
  const inventoryItems = stats.inventoryItems || [];
  const filteredItems = inventoryItems.filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'parcel') return item.category === 'parcel';
    if (activeCategory === 'key') return item.category === 'key';
    return item.category === 'note' || item.category === 'talisman';
  });

  // Fear vignette calculation (triggers when sanity < 75)
  const fearIntensity = stats.sanity < 75 ? (75 - stats.sanity) / 75 : 0;

  // --- ANALOG JOYSTICK HANDLERS ---
  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    joystickOrigin.current = { x: centerX, y: centerY };
    joystickTouchId.current = touch.identifier;
    setIsJoystickActive(true);
    updateJoystickPos(touch.clientX, touch.clientY, rect.width / 2);
  };

  const updateJoystickPos = (clientX: number, clientY: number, maxRadius: number) => {
    if (!joystickOrigin.current) return;
    const dx = clientX - joystickOrigin.current.x;
    const dy = clientY - joystickOrigin.current.y;
    const distance = Math.hypot(dx, dy);
    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;
    setJoystickOffset({ x: knobX, y: knobY });

    // Normalized move vector (-1 to 1)
    const normX = knobX / maxRadius;
    const normY = -knobY / maxRadius; // inverted Y for forward
    onTouchMoveUpdate(normX, normY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (joystickTouchId.current === null) return;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickTouchId.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        updateJoystickPos(touch.clientX, touch.clientY, rect.width / 2);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    joystickTouchId.current = null;
    joystickOrigin.current = null;
    setIsJoystickActive(false);
    setJoystickOffset({ x: 0, y: 0 });
    onTouchMoveUpdate(0, 0);
  };

  // --- TOUCH LOOK HANDLERS ---
  const handleTouchLookStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchLookStart.current = { x: touch.clientX, y: touch.clientY };
    setShowLookHint(false);
  };

  const handleTouchLookMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchLookStart.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchLookStart.current.x;
    const dy = touch.clientY - touchLookStart.current.y;
    touchLookStart.current = { x: touch.clientX, y: touch.clientY };
    onTouchLookUpdate(dx, dy);
  };

  const handleTouchLookEnd = () => {
    touchLookStart.current = null;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Fear Vignette & Sanity Drain Shroud */}
      {fearIntensity > 0 && (
        <div 
          className={`fear-vignette absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none ${
            stats.sanity < 40 ? 'sanity-drain' : ''
          }`} 
          style={{ opacity: Math.min(1.0, fearIntensity * 1.15) }}
        />
      )}

      {/* 2. Top Bar */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 pointer-events-auto bg-gradient-to-b from-[#080a0f]/95 via-[#080a0f]/50 to-transparent">
        {/* Left: Wordmark & Level info */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm sm:text-base font-bold tracking-wide text-slate-100 whitespace-nowrap">
            {t.gameTitle}
          </span>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            · {t.chapter} {level.number}: {isEn ? level.titleEn : level.titleBn}
          </span>
        </div>

        {/* Center: Realtime Stats (Time, Battery, Sanity) */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs text-slate-300">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-amber-400/90 font-medium">{t.timeLabel}:</span>
            <span className="font-mono tabular-nums text-slate-200">03:15 AM</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
            <span className="text-emerald-400 font-medium">{t.batteryLabel}:</span>
            <span className="font-mono tabular-nums text-slate-200">{Math.round(stats.battery)}%</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
            <span className={stats.sanity < 40 ? "text-red-400 font-semibold animate-pulse" : "text-sky-400 font-medium"}>
              {t.sanityLabel}:
            </span>
            <span className="font-mono tabular-nums text-slate-200">{Math.round(stats.sanity)}%</span>
          </div>
        </div>

        {/* Right: Essential HUD Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {/* Inventory Button */}
          <button
            onClick={() => setIsInventoryOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-amber-500/50 text-xs font-semibold text-amber-300 hover:bg-slate-850 hover:text-amber-200 transition-colors shadow-sm"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">{isEn ? "Satchel" : "থলি"}</span>
            <span className="text-[10px] bg-amber-500/20 px-1 rounded text-amber-300">{inventoryItems.length}</span>
          </button>

          <button
            onClick={onOpenJournal}
            className="hidden md:flex px-3 py-1.5 items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-300" />
            <span>{t.journalBtn}</span>
          </button>

          <button
            onClick={onPause}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            title={t.pauseTitle}
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Center Screen Context & Subtitle Layer */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {/* Interaction Prompt Box */}
        {interactPrompt && (
          <div 
            className="mb-8 px-5 py-2.5 rounded-xl bg-[#0f171e]/95 border-2 border-amber-400 shadow-2xl text-sm font-bold text-amber-300 text-center animate-bounce pointer-events-auto cursor-pointer flex items-center gap-2"
            onClick={onInteract}
          >
            <Hand className="w-4 h-4 text-amber-400" />
            <span>{isEn ? interactPrompt.en : interactPrompt.bn}</span>
          </div>
        )}

        {/* Supernatural Whispers & Voice Subtitles */}
        {subtitle && (
          <div className="max-w-xl px-5 py-2.5 rounded-xl bg-black/80 border border-slate-800 text-center backdrop-blur-md pointer-events-auto shadow-2xl">
            <p className="text-sm font-medium text-slate-100 tracking-wide">
              "{isEn ? subtitle.en : subtitle.bn}"
            </p>
            {settings.language === 'bn' && (
              <p className="text-xs text-slate-400 mt-1 italic">
                "{subtitle.en}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4. Touch Look Pad (Right-half screen for smooth swipe panning) */}
      <div 
        className="absolute right-0 top-16 bottom-36 w-7/12 pointer-events-auto touch-none z-10 opacity-0"
        onTouchStart={handleTouchLookStart}
        onTouchMove={handleTouchLookMove}
        onTouchEnd={handleTouchLookEnd}
      />

      {/* Subtle swipe look guide hint */}
      {showLookHint && (
        <div className="absolute right-8 top-28 z-20 pointer-events-none bg-slate-900/80 border border-slate-700/60 rounded-full px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-sm animate-pulse flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.lookHint}</span>
        </div>
      )}

      {/* 5. PROFESSIONAL MOBILE TOUCH CONTROLS */}
      {/* 5A. Virtual Analog Joystick (Bottom Left) */}
      <div className="sm:hidden absolute left-5 bottom-24 z-30 pointer-events-auto">
        <div 
          className="w-32 h-32 rounded-full bg-slate-950/75 border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center justify-center touch-none relative"
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          onTouchCancel={handleJoystickTouchEnd}
        >
          {/* Outer Track Radar Rings */}
          <div className="absolute inset-2 rounded-full border border-slate-800/80 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-dashed border-slate-700/40 pointer-events-none" />

          {/* Forward / Sprint Guidance Notch */}
          <div className="absolute top-1 flex flex-col items-center pointer-events-none opacity-80">
            <ChevronUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[8px] font-bold text-amber-400 tracking-wider">RUN</span>
          </div>

          {/* Cardinal Axis Markers */}
          <div className="absolute left-1.5 w-1 h-1 rounded-full bg-slate-600 pointer-events-none" />
          <div className="absolute right-1.5 w-1 h-1 rounded-full bg-slate-600 pointer-events-none" />
          <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-slate-600 pointer-events-none" />

          {/* Floating Dynamic Analog Knob */}
          <div 
            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-transform duration-75 pointer-events-none shadow-xl ${
              isJoystickActive
                ? 'bg-amber-500/30 border-amber-400 shadow-amber-500/20'
                : 'bg-slate-800/80 border-slate-600'
            }`}
            style={{
              transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`
            }}
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              isJoystickActive ? 'bg-amber-400 border-amber-300' : 'bg-slate-600 border-slate-500'
            }`}>
              <div className="w-2 h-2 rounded-full bg-slate-950/70" />
            </div>
          </div>
        </div>
      </div>

      {/* 5B. Professional Mobile Action Cluster (Bottom Right) */}
      <div className="sm:hidden absolute right-4 bottom-24 z-30 pointer-events-auto flex flex-col items-end gap-3.5">
        {/* Top Mini Cluster: Flashlight & Camera Mode */}
        <div className="flex items-center gap-2.5">
          {/* Camera View Mode (1st / 3rd Person) */}
          <button
            onClick={onToggleCameraView}
            className={`w-11 h-11 rounded-full border flex flex-col items-center justify-center transition-transform active:scale-90 shadow-lg backdrop-blur-md ${
              stats.cameraViewMode === 'third_person'
                ? 'bg-blue-950/80 border-blue-400 text-blue-300 ring-2 ring-blue-500/30'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
            title="Camera Perspective (V)"
          >
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-[9px] font-bold leading-none mt-0.5">
              {stats.cameraViewMode === 'third_person' ? '3P' : '1P'}
            </span>
          </button>

          {/* Flashlight Button */}
          <button
            onClick={onToggleFlashlight}
            className={`w-11 h-11 rounded-full border flex flex-col items-center justify-center transition-transform active:scale-90 shadow-lg backdrop-blur-md ${
              stats.flashlightOn
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title="Flashlight (F)"
          >
            <Flashlight className={`w-4 h-4 ${stats.flashlightOn ? 'text-amber-400 fill-amber-400/30' : 'text-slate-400'}`} />
            <span className="text-[8px] font-bold leading-none mt-0.5">
              {stats.flashlightOn ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Lower Main Action Buttons: RUN + SIT/STAND + HAND */}
        <div className="flex items-center gap-3">
          {/* Sit Down / Stand Up (Crouch / Stand) Button */}
          <button
            onClick={onToggleCrouch}
            className={`w-14 h-14 rounded-full border flex flex-col items-center justify-center transition-transform active:scale-90 shadow-xl backdrop-blur-md ${
              stats.isCrouched
                ? 'bg-teal-950/90 border-teal-400 text-teal-300 ring-2 ring-teal-400/50 shadow-teal-500/20'
                : 'bg-slate-900/85 border-slate-700 text-slate-200'
            }`}
            title="Sit Up / Sit Down (C)"
          >
            {stats.isCrouched ? (
              <>
                <ChevronUp className="w-5 h-5 text-teal-300" />
                <span className="text-[9px] font-bold mt-0.5 text-teal-200">{t.sitUpBtn}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 text-slate-300" />
                <span className="text-[9px] font-bold mt-0.5 text-slate-300">{t.sitDownBtn}</span>
              </>
            )}
          </button>

          {/* Dedicated Run / Sprint Button */}
          <button
            onClick={onToggleSprint}
            className={`w-14 h-14 rounded-full border flex flex-col items-center justify-center transition-transform active:scale-90 shadow-xl backdrop-blur-md ${
              stats.isSprinting
                ? 'bg-gradient-to-tr from-amber-600 to-yellow-500 border-amber-300 text-slate-950 font-bold ring-2 ring-amber-400/60 shadow-amber-500/40'
                : 'bg-slate-900/85 border-slate-700 text-amber-400'
            }`}
            title="Sprint / Run (Shift)"
          >
            <Footprints className={`w-5 h-5 ${stats.isSprinting ? 'text-slate-950' : 'text-amber-400'}`} />
            <span className={`text-[9px] font-bold mt-0.5 ${stats.isSprinting ? 'text-slate-950' : 'text-amber-300'}`}>
              {stats.isSprinting ? t.runBtnActive : t.runBtn}
            </span>
          </button>

          {/* Primary Hand Button (Interact, Grab Clues, Inspect Bike, Deliver) */}
          <button
            onClick={onInteract}
            className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-transform active:scale-90 shadow-2xl backdrop-blur-md relative ${
              interactPrompt
                ? 'bg-gradient-to-br from-amber-600/90 to-amber-800/90 border-amber-300 text-slate-950 ring-4 ring-amber-400/50 shadow-amber-500/50 animate-pulse'
                : 'bg-slate-900/90 border-slate-600 text-amber-300 hover:border-amber-400'
            }`}
            title="Hand / Interact (E)"
          >
            <Hand className={`w-7 h-7 ${interactPrompt ? 'text-white' : 'text-amber-400'}`} />
            <span className={`text-[9px] font-extrabold mt-0.5 tracking-tight ${interactPrompt ? 'text-white' : 'text-amber-300'}`}>
              {t.handBtn}
            </span>
            {interactPrompt && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border border-white animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* 6. Ergonomic Collapsible Bottom Control Dock (Desktop & Mobile Tablet) */}
      <footer className="relative z-20 pointer-events-auto pb-3 flex flex-col items-center">
        <button
          onClick={() => setIsCinemaMode(!isCinemaMode)}
          className="mb-1 px-3 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800 rounded-t-lg transition-colors flex items-center gap-1"
        >
          {isCinemaMode ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>{t.cinemaModeOpen}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>{t.cinemaModeHide}</span>
            </>
          )}
        </button>

        {!isCinemaMode && (
          <div className="w-full max-w-4xl px-4 py-2.5 mx-4 rounded-xl bg-[#0b1017]/95 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            {/* Parcel Status & Rule */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => {
                  setSelectedItem(inventoryItems[0] || null);
                  setIsInventoryOpen(true);
                }}
                className="w-10 h-10 rounded-lg bg-[#16212e] border border-amber-600/40 flex items-center justify-center shrink-0 cursor-pointer hover:border-amber-400 transition-colors"
                title={t.inspectItem}
              >
                <Package className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {isEn ? level.parcelNameEn : level.parcelNameBn}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ({isEn ? level.parcelWeightEn : level.parcelWeight})
                  </span>
                </div>
                <span className="text-[11px] text-amber-300/80 line-clamp-1 max-w-sm">
                  {isEn ? level.objectiveEn : level.objectiveBn}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800 whitespace-nowrap hidden xs:block">
              {isEn ? "3 AM Folklore" : "রাত ৩টার ডেলিভারি"}
            </div>
          </div>
        )}
      </footer>

      {/* 7. Interactive Inventory Drawer & Item Inspection Modal */}
      {isInventoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0c1219] border border-amber-600/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d12]">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-base font-bold text-slate-100">
                    {t.inventoryTitle}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t.inventorySubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsInventoryOpen(false);
                  setSelectedItem(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              {(['all', 'parcel', 'key', 'note'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all'
                    ? (isEn ? "All Items" : "সব বস্তু")
                    : cat === 'parcel'
                    ? t.categoryParcel
                    : cat === 'key'
                    ? t.categoryKey
                    : t.categoryNote}
                </button>
              ))}
            </div>

            {/* Drawer Content: Split Items Grid & Inspection Card */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Items List Grid */}
              <div className="w-full md:w-1/2 p-4 overflow-y-auto border-r border-slate-800 space-y-2.5">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    {t.inventoryEmpty}
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/60">
                          {item.category === 'parcel' ? (
                            <Package className="w-5 h-5 text-amber-400" />
                          ) : item.category === 'key' ? (
                            <Key className="w-5 h-5 text-emerald-400" />
                          ) : item.category === 'talisman' ? (
                            <Shield className="w-5 h-5 text-red-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-sky-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">
                            {isEn ? item.nameEn : item.nameBn}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {isEn ? item.descriptionEn : item.descriptionBn}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Inspection Card Detail View */}
              <div className="flex-1 p-6 overflow-y-auto bg-[#090e14] flex flex-col justify-between">
                {selectedItem ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        {selectedItem.category.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100">
                      {isEn ? selectedItem.nameEn : selectedItem.nameBn}
                    </h3>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <div className="font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isEn ? "Inspection Details:" : "বিশদ বিবরণ:"}</span>
                      </div>
                      <p>{isEn ? selectedItem.descriptionEn : selectedItem.descriptionBn}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed">
                      <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isEn ? "Supernatural Lore & Inscription:" : "রহস্যময় সংকেত ও লোকগাথা:"}</span>
                      </div>
                      <p className="italic">"{isEn ? selectedItem.loreEn : selectedItem.loreBn}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-500 py-12">
                    <Package className="w-10 h-10 text-slate-700 mb-2" />
                    <span>{isEn ? "Select any item to inspect its hidden lore or puzzle clues" : "যেকোনো আইটেমে ক্লিক করে তার লুকানো তথ্য ও সংকেত পরীক্ষা করুন"}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
                  <button
                    onClick={() => setIsInventoryOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    {t.inspectClose}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
