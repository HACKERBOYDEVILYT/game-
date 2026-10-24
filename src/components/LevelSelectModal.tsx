import React from 'react';
import { LevelDefinition, GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { X, Play, ShieldAlert, MapPin, Package } from 'lucide-react';

interface LevelSelectModalProps {
  levels: LevelDefinition[];
  completedLevels: number[];
  settings: GameSettings;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  levels,
  completedLevels,
  settings,
  onSelectLevel,
  onClose
}) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0b1017] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {t.levelSelectTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.levelSelectSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Levels Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((lvl, idx) => {
            const isCompleted = completedLevels.includes(lvl.id);
            return (
              <div
                key={lvl.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-500">
                      {t.chapter} {lvl.number < 10 ? `0${lvl.number}` : lvl.number}
                    </span>
                    {isCompleted && (
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {t.completedBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {isEn ? lvl.titleEn : lvl.titleBn}
                  </h3>
                  <div className="text-xs text-slate-400 italic mb-2">
                    {isEn ? lvl.titleBn : lvl.titleEn}
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{isEn ? lvl.locationEn : lvl.locationBn}</span>
                  </div>

                  <div className="p-2.5 rounded bg-red-950/20 border border-red-900/30 text-xs text-red-200/90 mb-3">
                    <div className="font-semibold text-red-400 mb-0.5 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      <span>{t.rulePrefix}</span>
                    </div>
                    <span>{isEn ? lvl.ruleEn : lvl.ruleBn}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="line-clamp-1">{isEn ? lvl.parcelNameEn : lvl.parcelNameBn}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {t.ghostPrefix} {lvl.ghostType === 'caller_behind' ? (isEn ? 'The Caller Behind' : 'পেছনের ডাক') : lvl.ghostType === 'shadow_stalker' ? (isEn ? 'The Shadow Stalker' : 'ছায়ামূর্তি') : (isEn ? "Nishi's Deception" : 'নিশির অতিথি')}
                  </span>
                  <button
                    onClick={() => onSelectLevel(idx)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{t.playBtn}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
