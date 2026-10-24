import React from 'react';
import { GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { Play, RotateCcw, ListFilter, Download, Settings, Info } from 'lucide-react';

interface MainMenuScreenProps {
  currentLevelIndex: number;
  settings: GameSettings;
  onStartNewGame: () => void;
  onResumeGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenGodotExport: () => void;
  onOpenCredits: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  currentLevelIndex,
  settings,
  onStartNewGame,
  onResumeGame,
  onOpenLevelSelect,
  onOpenSettings,
  onOpenGodotExport,
  onOpenCredits
}) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  return (
    <div className="relative w-full h-full min-h-screen bg-[#06080d] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Dark Ambient Background with Lantern Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-red-900/10 blur-3xl" />
        <div className="vignette-overlay absolute inset-0" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            {isEn ? "3 AM Delivery · Bengali Psychological 3D Horror" : "রাত ৩টার ডেলিভারি · সাইকোলজিক্যাল হরর"}
          </span>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          {t.versionLabel}
        </div>
      </header>

      {/* Main Center Title & Actions */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        {/* Title Lockup */}
        <div className="mb-2">
          <span className="text-xs uppercase tracking-widest text-red-500/90 font-mono font-medium">
            {isEn ? "FOLKLORE SURVIVAL & 3 AM RULES" : "নিশিডাক ও অলৌকিক বাঁচার নিয়ম"}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-100 mb-3 drop-shadow-md">
          {t.gameTitle}
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
          {t.gameSubtitle}
        </p>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {currentLevelIndex > 0 && (
            <button
              onClick={onResumeGame}
              className="w-full py-3.5 px-6 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.continueGame} ({t.chapter} {currentLevelIndex + 1})</span>
            </button>
          )}

          <button
            onClick={onStartNewGame}
            className="w-full py-3.5 px-6 rounded-lg bg-red-900/80 text-white font-semibold text-sm hover:bg-red-800 border border-red-700/60 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t.newGame}</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-3 px-6 rounded-lg bg-slate-900/90 text-slate-300 font-medium text-sm hover:text-white hover:bg-slate-850 border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ListFilter className="w-4 h-4 text-slate-400" />
            <span>{t.chaptersBtn}</span>
          </button>

          <button
            onClick={onOpenGodotExport}
            className="w-full py-3 px-6 rounded-lg bg-slate-900/90 text-slate-300 font-medium text-sm hover:text-white hover:bg-slate-850 border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{t.godotExportBtn}</span>
          </button>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onOpenSettings}
              className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900/70 text-slate-400 font-medium text-xs hover:text-slate-200 border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t.settingsBtn}</span>
            </button>
            <button
              onClick={onOpenCredits}
              className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900/70 text-slate-400 font-medium text-xs hover:text-slate-200 border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{t.creditsBtn}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 px-8 py-4 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <span>{t.headphonesTip}</span>
        </div>
        <div>
          <span>{t.controlsTip}</span>
        </div>
      </footer>
    </div>
  );
};
