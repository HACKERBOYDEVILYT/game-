import React from 'react';
import { GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { X, Book, Sparkles } from 'lucide-react';

interface CreditsModalProps {
  settings: GameSettings;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ settings, onClose }) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0d131a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d12]">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-100">
              {t.creditsTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              {t.creditsHeader}
            </h3>
            <p className="text-slate-400">
              {t.creditsDescription}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.creditsEntitiesTitle}</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-1">
              <li>
                <strong className="text-slate-200">{isEn ? "The Caller Behind:" : "পেছনের ডাক:"}</strong>{" "}
                {isEn ? "Mimics familiar voices from behind; turning around triggers an enraged lethal rush." : "দৃষ্টি ও মনোযোগের খেলা; ডাক শুনে পেছনে ফিরলে আক্রমণ করে।"}
              </li>
              <li>
                <strong className="text-slate-200">{isEn ? "The Shadow Stalker:" : "ছায়ামূর্তি:"}</strong>{" "}
                {isEn ? "Crawls rapidly in total darkness; freezes and vaporizes under direct flashlight beam." : "অন্ধকারে দ্রুত ধেয়ে আসে; সরাসরি টর্চলাইটের আলোয় জমে গিয়ে বিলীন হয়।"}
              </li>
              <li>
                <strong className="text-slate-200">{isEn ? "Nishi's Deception:" : "নিশির অতিথি:"}</strong>{" "}
                {isEn ? "Mimics delivery recipients from deceptive rooms; verify knocks and talismans before entering." : "পরিচিত মানুষের কণ্ঠ নকল করে ভুল দরজা বা জলাশয়ে টানে।"}
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-800/80 pt-3">
            <h4 className="font-semibold text-slate-200 mb-1">{t.creditsAudioTitle}</h4>
            <p className="text-slate-400">
              {t.creditsAudioDesc}
            </p>
          </div>

          <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-slate-500 text-[11px]">
            <span>Platform: WebGL 2 (Browser) & Godot 4.x (Android)</span>
            <span>Crafted with passion for Bengali Folklore Horror</span>
          </div>
        </div>
      </div>
    </div>
  );
};
