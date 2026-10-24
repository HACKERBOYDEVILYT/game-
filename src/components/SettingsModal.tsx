import React from 'react';
import { GameSettings } from '../types/game.ts';
import { TRANSLATIONS } from '../localization/translations.ts';
import { X, Sliders, Volume2, Monitor, Globe, Vibrate, Check, User } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0d131a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d12]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-100">
              {t.settingsTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Global Language Switch (Bengali vs English) */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{t.languageToggle}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => onUpdateSettings({ language: 'bn' })}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  settings.language === 'bn'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {settings.language === 'bn' && <Check className="w-3.5 h-3.5" />}
                <span>বাংলা (Default)</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  settings.language === 'en'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {settings.language === 'en' && <Check className="w-3.5 h-3.5" />}
                <span>English (Global)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {settings.language === 'bn'
                ? "সমগ্র গেমের মেনু, ইনভেন্টরি, সাবটাইটেল এবং ডায়েরি বাংলায় প্রদর্শিত হবে।"
                : "All UI elements, HUD, inventory lore, journal notes, and subtitles will adapt to English."}
            </p>
          </div>

          {/* 2. Graphics Presets */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              <Monitor className="w-4 h-4 text-slate-400" />
              <span>{t.graphicsTitle}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'med', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateSettings({ graphicsQuality: q })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    settings.graphicsQuality === q
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {q === 'low' ? t.graphicsLow : q === 'med' ? t.graphicsMed : t.graphicsHigh}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {t.graphicsNote}
            </p>
          </div>

          {/* 2.5 Camera Perspective (1st Person Hands vs 3rd Person Full Body) */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>{settings.language === 'bn' ? "ক্যামেরা ভিউ মোড" : "Camera View Mode"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ cameraViewMode: 'first_person' })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                  settings.cameraViewMode === 'first_person'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{settings.language === 'bn' ? "১ম ব্যক্তি (হ্যান্ডস)" : "1st Person (Hands)"}</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ cameraViewMode: 'third_person' })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                  settings.cameraViewMode === 'third_person'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{settings.language === 'bn' ? "৩য় ব্যক্তি (ফুল বডি)" : "3rd Person (Full Body)"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {settings.language === 'bn'
                ? "খেলার সময় যে কোনো মুহূর্তে কিবোর্ডের 'V' বা স্ক্রিনের ক্যামেরা আইকন চেপে ভিউ বদলাতে পারবেন।"
                : "Press 'V' or the screen camera button at any time during gameplay to toggle view."}
            </p>
          </div>

          {/* 3. Audio Volume Controls */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span>{t.audioTitle}</span>
            </div>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{t.masterVol}</span>
                  <span className="font-mono tabular-nums">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => onUpdateSettings({ masterVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{t.ambienceVol}</span>
                  <span className="font-mono tabular-nums">{Math.round(settings.ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.ambientVolume}
                  onChange={(e) => onUpdateSettings({ ambientVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{t.sfxVol}</span>
                  <span className="font-mono tabular-nums">{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{t.voiceVol}</span>
                  <span className="font-mono tabular-nums">{Math.round(settings.voiceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.voiceVolume}
                  onChange={(e) => onUpdateSettings({ voiceVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 4. Subtitles & Vibration Accessibility */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">{t.subtitlesToggle}</span>
              <button
                onClick={() => onUpdateSettings({ subtitles: !settings.subtitles })}
                className={`px-3 py-1 rounded text-xs font-semibold border ${
                  settings.subtitles
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {settings.subtitles ? t.vibrationOn : t.vibrationOff}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">{t.vibrationToggle}</span>
              <button
                onClick={() => onUpdateSettings({ vibration: !settings.vibration })}
                className={`px-3 py-1 rounded text-xs font-semibold border ${
                  settings.vibration
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {settings.vibration ? t.vibrationOn : t.vibrationOff}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
