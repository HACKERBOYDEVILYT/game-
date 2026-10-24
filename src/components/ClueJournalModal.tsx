import React from 'react';
import { LevelDefinition, GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { X, BookOpen, Package, ShieldAlert, FileText, Compass } from 'lucide-react';

interface ClueJournalModalProps {
  level: LevelDefinition;
  settings: GameSettings;
  collectedClues: string[];
  onClose: () => void;
}

export const ClueJournalModal: React.FC<ClueJournalModalProps> = ({
  level,
  settings,
  collectedClues,
  onClose
}) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d131a] border border-amber-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850 bg-[#080d12]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {t.journalTitle}
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {t.chapter} {level.number} · {isEn ? level.titleEn : level.titleBn}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. Parcel Document */}
          <div className="p-4 rounded-xl bg-[#141b24] border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
              <Package className="w-4 h-4" />
              <span>{t.consignmentInfo}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-slate-400">{t.parcelName}</span>
                <p className="font-medium text-slate-200 mt-0.5">{isEn ? level.parcelNameEn : level.parcelNameBn}</p>
              </div>
              <div>
                <span className="text-slate-400">{t.parcelWeight}</span>
                <p className="font-medium text-slate-200 mt-0.5">{isEn ? level.parcelWeightEn : level.parcelWeight}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">{t.parcelDestination}</span>
                <p className="font-medium text-amber-300/90 mt-0.5">{isEn ? level.destination.labelEn : level.destination.labelBn}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 italic border-t border-slate-700/50 pt-2.5 leading-relaxed">
              "{isEn ? level.parcelDescriptionEn : level.parcelDescriptionBn}"
            </p>
          </div>

          {/* 2. Supernatural Survival Rule */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>{t.survivalRuleTitle}</span>
            </div>
            <p className="text-xs text-red-200/90 leading-relaxed font-medium">
              {isEn ? level.ruleEn : level.ruleBn}
            </p>
          </div>

          {/* 3. Collected Clues & Environmental Notes */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.notesTitle}</span>
            </h3>

            <div className="space-y-2.5">
              {level.clues.map((clue) => {
                const isFound = clue.found || collectedClues.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    className={`p-3.5 rounded-lg border text-xs transition-colors ${
                      isFound
                        ? 'bg-slate-900 border-amber-600/40 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 italic'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-300">
                        {isFound ? (isEn ? clue.titleEn : clue.titleBn) : (isEn ? "Undiscovered Note..." : "অপ্রকাশিত চিরকুট...")}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {isFound ? (isEn ? "Collected" : "সংগৃহীত") : (isEn ? "Search in world" : "খুঁজে বের করুন")}
                      </span>
                    </div>
                    <p className="leading-relaxed">
                      {isFound ? (isEn ? clue.contentEn : clue.contentBn) : (isEn ? "Search near fences, walls or desks..." : "পথের পাশে বাঁশের বেড়া বা দেওয়ালে সন্ধান করুন...")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Lore Fragment */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.folkloreTitle}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn ? level.loreUnlockEn : level.loreUnlockBn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
