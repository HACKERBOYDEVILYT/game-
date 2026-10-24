import React, { useState, useRef } from 'react';
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
  User
} from 'lucide-react';

interface GameHUDProps {
  stats: PlayerStats;
  level: LevelDefinition;
  settings: GameSettings;
  interactPrompt: { bn: string; en: string } | null;
  subtitle: { bn: string; en: string } | null;
  onToggleFlashlight: () => void;
  onToggleCameraView?: () => void;
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
  const touchLookStart = useRef<{ x: number; y: number } | null>(null);

  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  // Filter inventory
  const inventoryItems = stats.inventoryItems || [];
  const filteredItems = inventoryItems.filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'parcel') return item.category === 'parcel';
    if (activeCategory === 'key') return item.category === 'key';
    return item.category === 'note' || item.category === 'talisman';
  });

  // Fear vignette calculation (triggers when sanity < 75)
  const fearIntensity = stats.sanity < 75 ? (75 - stats.sanity) / 75 : 0;

  // Virtual Joystick touch handlers for mobile
  const handleJoystickTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    const dx = (touch.clientX - centerX) / maxRadius;
    const dy = (touch.clientY - centerY) / maxRadius;

    const clampedX = Math.max(-1, Math.min(1, dx));
    const clampedY = Math.max(-1, Math.min(1, -dy));

    onTouchMoveUpdate(clampedX, clampedY);
  };

  const handleJoystickEnd = () => {
    onTouchMoveUpdate(0, 0);
  };

  const handleTouchLookStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchLookStart.current = { x: touch.clientX, y: touch.clientY };
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
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between overflow-hidden">
      {/* 1. Fear Vignette & Sanity Drain Shroud (Triggers when standing in dark or near ghosts) */}
      {fearIntensity > 0 && (
        <div 
          className={`fear-vignette absolute inset-0 z-0 transition-opacity duration-300 ${
            stats.sanity < 40 ? 'sanity-drain' : ''
          }`} 
          style={{ opacity: Math.min(1.0, fearIntensity * 1.15) }}
        />
      )}

      {/* 2. Top Bar (Clean 3-Zone Contract) */}
      <header className="relative z-10 flex items-center justify-between gap-6 px-5 py-3 pointer-events-auto bg-gradient-to-b from-[#080a0f]/90 via-[#080a0f]/40 to-transparent">
        {/* Zone 1: Wordmark & Chapter */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold tracking-wide text-slate-100 whitespace-nowrap">
            {t.gameTitle}
          </span>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            · {t.chapter} {level.number}: {isEn ? level.titleEn : level.titleBn}
          </span>
        </div>

        {/* Zone 2: Time, Battery, Sanity */}
        <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400/90 font-medium">{t.timeLabel}:</span>
            <span className="font-mono tabular-nums text-slate-200">03:15 AM</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-medium">{t.batteryLabel}:</span>
            <span className="font-mono tabular-nums text-slate-200">{Math.round(stats.battery)}%</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className={stats.sanity < 40 ? "text-red-400 font-semibold" : "text-sky-400 font-medium"}>
              {t.sanityLabel}:
            </span>
            <span className="font-mono tabular-nums text-slate-200">{Math.round(stats.sanity)}%</span>
          </div>
        </div>

        {/* Zone 3: Quick Action Buttons (Sound, Inventory Drawer, Journal, Pause) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {/* Camera View Mode Switcher (1st Person Hands vs 3rd Person Full Body) */}
          <button
            onClick={onToggleCameraView}
            className={`px-2.5 py-1.5 flex items-center gap-1.5 rounded border text-xs font-semibold transition-colors shadow-sm ${
              stats.cameraViewMode === 'third_person'
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 hover:bg-blue-600/40'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
            }`}
            title={isEn ? "Switch View (V key)" : "ভিউ পরিবর্তন (V কি)"}
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">
              {stats.cameraViewMode === 'third_person'
                ? (isEn ? "3rd Person" : "৩য় ব্যক্তি (বডি)")
                : (isEn ? "1st Person" : "১ম ব্যক্তি (হ্যান্ডস)")}
            </span>
          </button>

          {/* Interactive Inventory Drawer Trigger */}
          <button
            onClick={() => setIsInventoryOpen(true)}
            className="px-3 py-1.5 flex items-center gap-1.5 rounded bg-slate-900/80 border border-amber-500/50 text-xs font-semibold text-amber-300 hover:bg-slate-850 hover:text-amber-200 transition-colors shadow-sm"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? "Inventory" : "ইনভেন্টরি"} ({inventoryItems.length})</span>
          </button>

          <button
            onClick={onOpenJournal}
            className="hidden md:flex px-3 py-1.5 items-center gap-1.5 rounded bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-300" />
            <span>{t.journalBtn}</span>
          </button>

          <button
            onClick={onPause}
            className="p-2 rounded bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
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
            className="mb-8 px-5 py-2.5 rounded-lg bg-[#0f171e]/95 border border-amber-500/50 shadow-2xl text-sm font-semibold text-amber-300 text-center animate-fade-in pointer-events-auto cursor-pointer"
            onClick={onInteract}
          >
            {isEn ? interactPrompt.en : interactPrompt.bn}
          </div>
        )}

        {/* Supernatural Whispers & Voice Subtitles */}
        {subtitle && (
          <div className="max-w-xl px-5 py-2.5 rounded bg-black/75 border border-slate-800 text-center backdrop-blur-sm pointer-events-auto">
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

      {/* 4. Touch Look Pad (Right-half screen for mobile touch look) */}
      <div 
        className="absolute right-0 top-16 bottom-24 w-1/2 pointer-events-auto touch-none z-10 opacity-0"
        onTouchStart={handleTouchLookStart}
        onTouchMove={handleTouchLookMove}
        onTouchEnd={handleTouchLookEnd}
      />

      {/* 5. Mobile Virtual Joystick (Left-bottom screen) */}
      <div className="sm:hidden absolute left-4 bottom-24 z-20 pointer-events-auto">
        <div 
          className="w-28 h-28 rounded-full bg-slate-900/60 border border-slate-700/60 flex items-center justify-center touch-none relative"
          onTouchStart={handleJoystickTouch}
          onTouchMove={handleJoystickTouch}
          onTouchEnd={handleJoystickEnd}
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/40 border border-amber-400/80 pointer-events-none" />
        </div>
      </div>

      {/* 6. Ergonomic Collapsible Bottom Control Dock */}
      <footer className="relative z-20 pointer-events-auto pb-4 flex flex-col items-center">
        <button
          onClick={() => setIsCinemaMode(!isCinemaMode)}
          className="mb-1 px-3 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800 rounded-t transition-colors flex items-center gap-1"
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
          <div className="w-full max-w-4xl px-4 py-3 mx-4 rounded-xl bg-[#0b1017]/95 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            {/* Parcel Status & Rule */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => {
                  setSelectedItem(inventoryItems[0] || null);
                  setIsInventoryOpen(true);
                }}
                className="w-10 h-10 rounded bg-[#16212e] border border-amber-600/40 flex items-center justify-center shrink-0 cursor-pointer hover:border-amber-400 transition-colors"
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

            {/* Quick Actions / Mobile Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onToggleCameraView}
                className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  stats.cameraViewMode === 'third_person'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 hover:bg-blue-600/40'
                    : 'bg-slate-850 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
                title="Toggle 1st / 3rd Person View (Key V)"
              >
                <User className="w-4 h-4 text-blue-400" />
                <span>{stats.cameraViewMode === 'third_person' ? (isEn ? "3rd Person" : "৩য় ব্যক্তি") : (isEn ? "1st Person" : "১ম ব্যক্তি")}</span>
              </button>

              <button
                onClick={onToggleFlashlight}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  stats.flashlightOn
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Flashlight className="w-4 h-4" />
                <span>{stats.flashlightOn ? t.torchOn : t.torchOff}</span>
              </button>

              <button
                onClick={onInteract}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-950/70 text-red-200 border border-red-800/80 hover:bg-red-900 transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>{t.deliverAction}</span>
              </button>
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
