import React, { useState, useEffect, useRef } from 'react';
import { GameScreen, GameSettings, PlayerStats } from './types/game.ts';
import { LEVELS } from './game/LevelData.ts';
import { ThreeEngine } from './game/ThreeEngine.ts';
import { audioManager } from './audio/SpatialAudioEngine.ts';
import { TRANSLATIONS } from './localization/translations.ts';
import { MainMenuScreen } from './components/MainMenuScreen.tsx';
import { GameHUD } from './components/GameHUD.tsx';
import { LevelSelectModal } from './components/LevelSelectModal.tsx';
import { ClueJournalModal } from './components/ClueJournalModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { GodotExportModal } from './components/GodotExportModal.tsx';
import { GameOverModal } from './components/GameOverModal.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { CreditsModal } from './components/CreditsModal.tsx';

const DEFAULT_SETTINGS: GameSettings = {
  graphicsQuality: 'med',
  masterVolume: 0.8,
  ambientVolume: 0.7,
  sfxVolume: 0.8,
  voiceVolume: 0.9,
  mouseSensitivity: 1.0,
  invertY: false,
  language: 'bn',
  subtitles: true,
  vibration: true,
  cameraViewMode: 'first_person'
};

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // In-Game Live State
  const [stats, setStats] = useState<PlayerStats>({
    health: 100,
    sanity: 100,
    battery: 100,
    flashlightOn: true,
    isSprinting: false,
    isCrouched: false,
    isLookingBack: false,
    hasParcel: true,
    cameraViewMode: 'first_person',
    inventoryKeys: [],
    collectedClues: [],
    inventoryItems: []
  });

  const [interactPrompt, setInteractPrompt] = useState<{ bn: string; en: string } | null>(null);
  const [subtitle, setSubtitle] = useState<{ bn: string; en: string } | null>(null);
  const [gameOverReason, setGameOverReason] = useState<{ bn: string; en: string }>({ bn: '', en: '' });
  const subtitleTimeoutRef = useRef<number | null>(null);

  // Three Engine Ref
  const threeMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);

  // Landscape / Horizontal Mode Enforcement
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth && window.innerWidth < 850;
  });
  const [allowPortraitOverride, setAllowPortraitOverride] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 850);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.bn;
  const isEn = settings.language === 'en';

  // Load progress and settings from LocalStorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('3am_completed_levels');
      if (savedCompleted) {
        setCompletedLevels(JSON.parse(savedCompleted));
      }
      const savedSettings = localStorage.getItem('3am_settings');
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }
      const savedProgress = localStorage.getItem('3am_current_level');
      if (savedProgress) {
        const lvl = parseInt(savedProgress, 10);
        if (!isNaN(lvl) && lvl >= 0 && lvl < LEVELS.length) {
          setCurrentLevelIndex(lvl);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Update audio manager settings
  useEffect(() => {
    if (isMuted) {
      audioManager.setVolumes(0, 0, 0, 0);
    } else {
      audioManager.setVolumes(
        settings.masterVolume,
        settings.ambientVolume,
        settings.sfxVolume,
        settings.voiceVolume
      );
    }
  }, [settings, isMuted]);

  // Handle Level Start & 3D Engine Initialization
  useEffect(() => {
    if (screen === 'PLAYING') {
      audioManager.init();
      audioManager.resume();

      if (threeMountRef.current) {
        if (engineRef.current) {
          engineRef.current.dispose();
          engineRef.current = null;
        }

        const currentLvl = LEVELS[currentLevelIndex] || LEVELS[0];

        engineRef.current = new ThreeEngine(threeMountRef.current, currentLvl, {
          onStatsUpdate: (newStats) => {
            setStats(newStats);
          },
          onSubtitle: (bn, en) => {
            setSubtitle({ bn, en });
            if (subtitleTimeoutRef.current) clearTimeout(subtitleTimeoutRef.current);
            subtitleTimeoutRef.current = window.setTimeout(() => {
              setSubtitle(null);
            }, 5500);
          },
          onInteractPrompt: (promptBn, promptEn) => {
            if (promptBn && promptEn) {
              setInteractPrompt({ bn: promptBn, en: promptEn });
            } else {
              setInteractPrompt(null);
            }
          },
          onLevelComplete: () => {
            handleLevelCompleted();
          },
          onGameOver: (reasonBn, reasonEn) => {
            handleGameOver(reasonBn, reasonEn);
          }
        });

        engineRef.current.setQuality(settings.graphicsQuality);
      }
    } else {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, [screen, currentLevelIndex]);

  // --- GAMEPLAY FLOW HANDLERS ---
  const handleStartGame = (levelIdx: number) => {
    setCurrentLevelIndex(levelIdx);
    localStorage.setItem('3am_current_level', levelIdx.toString());
    setScreen('PLAYING');
  };

  const handleLevelCompleted = () => {
    const currentLvl = LEVELS[currentLevelIndex];
    if (!completedLevels.includes(currentLvl.id)) {
      const updated = [...completedLevels, currentLvl.id];
      setCompletedLevels(updated);
      localStorage.setItem('3am_completed_levels', JSON.stringify(updated));
    }
    setScreen('LEVEL_COMPLETE');
  };

  const handleNextLevel = () => {
    if (currentLevelIndex + 1 < LEVELS.length) {
      const nextIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIdx);
      localStorage.setItem('3am_current_level', nextIdx.toString());
      setScreen('PLAYING');
    } else {
      setScreen('CREDITS');
    }
  };

  const handleGameOver = (reasonBn: string, reasonEn: string) => {
    setGameOverReason({ bn: reasonBn, en: reasonEn });
    if (settings.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 300]);
    }
    setScreen('GAME_OVER');
  };

  const handleRetryCheckpoint = () => {
    setScreen('PLAYING');
  };

  const handleReturnToMenu = () => {
    setScreen('MENU');
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('3am_settings', JSON.stringify(updated));
      return updated;
    });
    if (engineRef.current && newSettings.graphicsQuality) {
      engineRef.current.setQuality(newSettings.graphicsQuality);
    }
  };

  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  return (
    <div className="relative w-full h-full min-h-screen bg-[#06080d] text-slate-100 overflow-hidden font-sans">
      {/* 3D Canvas Mounting Container */}
      <div 
        ref={threeMountRef} 
        className={`w-full h-full min-h-screen ${screen === 'PLAYING' ? 'block' : 'hidden'}`}
      />

      {/* Main Menu Screen */}
      {screen === 'MENU' && (
        <MainMenuScreen
          currentLevelIndex={currentLevelIndex}
          settings={settings}
          onStartNewGame={() => handleStartGame(0)}
          onResumeGame={() => handleStartGame(currentLevelIndex)}
          onOpenLevelSelect={() => setScreen('LEVEL_SELECT')}
          onOpenSettings={() => setScreen('SETTINGS')}
          onOpenGodotExport={() => setScreen('GODOT_EXPORT')}
          onOpenCredits={() => setScreen('CREDITS')}
        />
      )}

      {/* In-Game HUD Overlay */}
      {screen === 'PLAYING' && (
        <GameHUD
          stats={stats}
          level={currentLevel}
          settings={settings}
          interactPrompt={interactPrompt}
          subtitle={subtitle}
          onToggleFlashlight={() => engineRef.current?.toggleFlashlight()}
          onToggleCameraView={() => engineRef.current?.toggleCameraViewMode()}
          onToggleSprint={() => engineRef.current?.toggleSprint()}
          onToggleCrouch={() => engineRef.current?.toggleCrouch()}
          onInteract={() => engineRef.current?.handleInteraction()}
          onOpenJournal={() => setScreen('JOURNAL')}
          onPause={() => setScreen('PAUSED')}
          onToggleMute={() => setIsMuted(!isMuted)}
          isMuted={isMuted}
          onTouchMoveUpdate={(x, y) => {
            if (engineRef.current) {
              engineRef.current.touchMove.x = x;
              engineRef.current.touchMove.y = y;
            }
          }}
          onTouchLookUpdate={(dx, dy) => {
            engineRef.current?.handleTouchLookDelta(dx, dy);
          }}
        />
      )}

      {/* Pause Screen Overlay */}
      {screen === 'PAUSED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0c1219] border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-1">{t.pauseTitle}</h2>
            <p className="text-xs text-slate-400 mb-5">
              {t.chapter} {currentLevel.number}: {isEn ? currentLevel.titleEn : currentLevel.titleBn}
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setScreen('PLAYING')}
                className="py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {t.resumeGame}
              </button>
              <button
                onClick={() => setScreen('SETTINGS')}
                className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
              >
                {t.settingsBtn}
              </button>
              <button
                onClick={handleReturnToMenu}
                className="py-2.5 px-4 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-900/60 text-xs font-medium transition-colors"
              >
                {t.exitToMenu}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Select Modal */}
      {screen === 'LEVEL_SELECT' && (
        <LevelSelectModal
          levels={LEVELS}
          completedLevels={completedLevels}
          settings={settings}
          onSelectLevel={(idx) => handleStartGame(idx)}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Clue & Parcel Journal Modal */}
      {screen === 'JOURNAL' && (
        <ClueJournalModal
          level={currentLevel}
          settings={settings}
          collectedClues={stats.collectedClues}
          onClose={() => setScreen('PLAYING')}
        />
      )}

      {/* Settings Modal */}
      {screen === 'SETTINGS' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setScreen(engineRef.current ? 'PLAYING' : 'MENU')}
        />
      )}

      {/* Godot 4 Source Export Modal */}
      {screen === 'GODOT_EXPORT' && (
        <GodotExportModal onClose={() => setScreen('MENU')} />
      )}

      {/* Game Over Screen */}
      {screen === 'GAME_OVER' && (
        <GameOverModal
          reasonBn={gameOverReason.bn}
          reasonEn={gameOverReason.en}
          ruleBn={currentLevel.ruleBn}
          ruleEn={currentLevel.ruleEn}
          settings={settings}
          onRetry={handleRetryCheckpoint}
          onReturnToMenu={handleReturnToMenu}
        />
      )}

      {/* Victory / Level Complete Screen */}
      {screen === 'LEVEL_COMPLETE' && (
        <VictoryModal
          level={currentLevel}
          settings={settings}
          isLastLevel={currentLevelIndex === LEVELS.length - 1}
          onNextLevel={handleNextLevel}
          onReturnToMenu={handleReturnToMenu}
        />
      )}

      {/* Credits & Folklore Screen */}
      {screen === 'CREDITS' && (
        <CreditsModal settings={settings} onClose={() => setScreen('MENU')} />
      )}

      {/* Horizontal / Landscape Mode Only Enforcer */}
      {isPortrait && !allowPortraitOverride && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#06080d]/98 backdrop-blur-xl text-center select-none pointer-events-auto">
          <div className="relative mb-6">
            <div className="w-16 h-28 rounded-2xl border-4 border-amber-500/80 bg-slate-900/80 flex items-center justify-center shadow-2xl shadow-amber-500/30 animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 text-2xl animate-spin">
              🔄
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/70 border border-amber-600/40 mb-3">
            Horizontal Mode Only (শুধুমাত্র আড়াআড়ি মোড)
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-slate-100 mb-2">
            ফোনটি আড়াআড়ি (Landscape) করুন
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed mb-6">
            রাত ৩টার ডেলিভারি গেমটি শুধুমাত্র হরিজন্টাল / ল্যান্ডস্কেপ মোডে চলবে। বাস্তবসম্মত ৩ডি অভিজ্ঞতা ও টাচ কন্ট্রোলের জন্য মোবাইলটি আড়াআড়ি ঘুরিয়ে নিন।
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
            <button
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
                const screenAny = screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } };
                if (screenAny.orientation?.lock) {
                  screenAny.orientation.lock('landscape').catch(() => {});
                }
              }}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🔄 ফুলস্ক্রিন ও ল্যান্ডস্কেপ করুন</span>
            </button>
            <button
              onClick={() => setAllowPortraitOverride(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 text-[11px] font-medium transition-colors"
            >
              <span>ভার্টিক্যালে চালিয়ে যান (Continue)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
