import React from 'react';
import { GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { RotateCcw, Home, Skull, ShieldAlert } from 'lucide-react';

interface GameOverModalProps {
  reasonBn: string;
  reasonEn: string;
  ruleBn: string;
  ruleEn: string;
  settings: GameSettings;
  onRetry: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reasonBn,
  reasonEn,
  ruleBn,
  ruleEn,
  settings,
  onRetry,
  onReturnToMenu
}) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0a0708] border border-red-900/60 rounded-2xl p-6 text-center shadow-2xl flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-600/50 flex items-center justify-center mb-4 text-red-500">
          <Skull className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-semibold mb-1">
          {t.gameOverSubtitle}
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          {t.gameOverTitle}
        </h2>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          {isEn ? reasonEn : reasonBn}
        </p>

        {/* Supernatural Rule Reminder */}
        <div className="w-full p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-left mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isEn ? "Folklore Survival Rule:" : "মনে রাখবেন:"}</span>
          </div>
          <p className="text-xs text-red-200/90 leading-relaxed">
            {isEn ? ruleEn : ruleBn}
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRetry}
            className="w-full py-3 px-5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retryBtn}</span>
          </button>
          <button
            onClick={onReturnToMenu}
            className="w-full py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.exitToMenu}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
