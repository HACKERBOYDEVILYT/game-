import React from 'react';
import { LevelDefinition, GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { CheckCircle2, ArrowRight, Home, Compass, Trophy } from 'lucide-react';

interface VictoryModalProps {
  level: LevelDefinition;
  settings: GameSettings;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onReturnToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  settings,
  isLastLevel,
  onNextLevel,
  onReturnToMenu
}) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0a120e] border border-emerald-800/60 rounded-2xl p-6 text-center shadow-2xl flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mb-4 text-emerald-400">
          {isLastLevel ? <Trophy className="w-8 h-8 text-amber-400" /> : <CheckCircle2 className="w-8 h-8" />}
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1">
          {isLastLevel ? t.finalVictoryTitle : t.victoryTitle}
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          {isLastLevel 
            ? (isEn ? "The Curse of 3 AM is Broken!" : "রাত ৩টার অভিশাপ থেকে মুক্তি!") 
            : `${isEn ? level.titleEn : level.titleBn} ${isEn ? "Completed" : "সম্পন্ন"}`}
        </h2>
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          {isLastLevel
            ? t.finalVictorySubtitle
            : (isEn 
                ? `You strictly adhered to the rules and safely delivered '${level.parcelNameEn}' to its destination.` 
                : `আপনি নিখুঁতভাবে নিয়ম মেনে '${level.parcelNameBn}' নির্দিষ্ট স্থানে হস্তান্তর করেছেন।`)}
        </p>

        {/* Unlocked Lore Card */}
        <div className="w-full p-4 rounded-xl bg-[#112017] border border-emerald-700/40 text-left mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{t.unlockedLoreTitle}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{isEn ? level.loreUnlockEn : level.loreUnlockBn}"
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {!isLastLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow"
            >
              <span>{t.nextChapterBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onReturnToMenu}
              className="w-full py-3 px-5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow"
            >
              <span>{t.creditsBtn} & {t.exitToMenu}</span>
            </button>
          )}

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
