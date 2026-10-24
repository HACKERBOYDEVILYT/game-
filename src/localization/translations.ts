export interface TranslationDictionary {
  gameTitle: string;
  gameSubtitle: string;
  chapter: string;
  timeLabel: string;
  batteryLabel: string;
  sanityLabel: string;
  inventoryTitle: string;
  inventorySubtitle: string;
  inventoryEmpty: string;
  inspectItem: string;
  inspectClose: string;
  categoryParcel: string;
  categoryKey: string;
  categoryNote: string;
  categoryTalisman: string;
  torchOn: string;
  torchOff: string;
  deliverAction: string;
  safeLanternStation: string;
  deliverPrompt: string;
  newClueFound: string;
  cinemaModeOpen: string;
  cinemaModeHide: string;
  journalBtn: string;
  pauseTitle: string;
  resumeGame: string;
  newGame: string;
  continueGame: string;
  chaptersBtn: string;
  godotExportBtn: string;
  settingsBtn: string;
  creditsBtn: string;
  exitToMenu: string;
  headphonesTip: string;
  controlsTip: string;
  versionLabel: string;
  levelSelectTitle: string;
  levelSelectSubtitle: string;
  playBtn: string;
  completedBadge: string;
  rulePrefix: string;
  ghostPrefix: string;
  journalTitle: string;
  consignmentInfo: string;
  parcelName: string;
  parcelWeight: string;
  parcelDestination: string;
  survivalRuleTitle: string;
  notesTitle: string;
  folkloreTitle: string;
  settingsTitle: string;
  graphicsTitle: string;
  graphicsLow: string;
  graphicsMed: string;
  graphicsHigh: string;
  graphicsNote: string;
  audioTitle: string;
  masterVol: string;
  ambienceVol: string;
  sfxVol: string;
  voiceVol: string;
  languageToggle: string;
  languageBn: string;
  languageEn: string;
  subtitlesToggle: string;
  vibrationToggle: string;
  vibrationOn: string;
  vibrationOff: string;
  gameOverTitle: string;
  gameOverSubtitle: string;
  sanityFailedReason: string;
  ghostFailedReason: string;
  retryBtn: string;
  victoryTitle: string;
  victorySubtitle: string;
  finalVictoryTitle: string;
  finalVictorySubtitle: string;
  nextChapterBtn: string;
  unlockedLoreTitle: string;
  creditsTitle: string;
  creditsHeader: string;
  creditsDescription: string;
  creditsEntitiesTitle: string;
  creditsAudioTitle: string;
  creditsAudioDesc: string;
}

export const TRANSLATIONS: Record<'bn' | 'en', TranslationDictionary> = {
  bn: {
    gameTitle: "রাত ৩টার ডেলিভারি",
    gameSubtitle: "তুমি রাতের শেষ রাইডার। গ্রামবাংলায় অমাবস্যার আঁধারে রহস্যময় পার্সেল পৌঁছে দাও, কিন্তু লোককথার অলৌকিক নিয়ম না মানলে ফেরা অসম্ভব।",
    chapter: "অধ্যায়",
    timeLabel: "সময়",
    batteryLabel: "ব্যাটারি",
    sanityLabel: "মানসিক স্থৈর্য",
    inventoryTitle: "রাইডারের ইনভেন্টরি থলি",
    inventorySubtitle: "সংগৃহীত চাবি, পার্সেল ও রহস্যময় চিরকুট পরীক্ষা করুন",
    inventoryEmpty: "আপনার ইনভেন্টরি বর্তমানে খালি।",
    inspectItem: "বিস্তারিত পরীক্ষা করুন",
    inspectClose: "বন্ধ করুন",
    categoryParcel: "ডেলিভারি পার্সেল",
    categoryKey: "চাবি",
    categoryNote: "চিরকুট ও মানচিত্র",
    categoryTalisman: "তাবিজ ও সুরক্ষাকবচ",
    torchOn: "টর্চ অন [F]",
    torchOff: "টর্চ অফ [F]",
    deliverAction: "হস্তান্তর [E]",
    safeLanternStation: "নিরাপদ লণ্ঠনের আশ্রয় (Safe Lantern)",
    deliverPrompt: "[E / Tap] পার্সেল ডেলিভারি সম্পন্ন করুন",
    newClueFound: "নতুন ক্লু সংগৃহীত:",
    cinemaModeOpen: "কন্ট্রোল ডক খুলুন",
    cinemaModeHide: "সিনেমা মোড (লুকান)",
    journalBtn: "ডায়েরি ও ক্লু",
    pauseTitle: "খেলা স্থগিত (Paused)",
    resumeGame: "চালিয়ে যান (Resume)",
    newGame: "নতুন খেলা (New Game)",
    continueGame: "চালিয়ে যান",
    chaptersBtn: "অধ্যায় নির্বাচন (১০টি লেভেল)",
    godotExportBtn: "Godot 4 প্রজেক্ট ডাউনলোড (.ZIP)",
    settingsBtn: "সেটিংস",
    creditsBtn: "লোককথা ও তথ্য",
    exitToMenu: "মেনুতে ফিরুন",
    headphonesTip: "হেডফোন ব্যবহার সেরা থ্রিডি অডিও অনুভূতির জন্য বাঞ্ছনীয়",
    controlsTip: "পিসি কিবোর্ড ও মাউস / অ্যান্ড্রয়েড টাচস্ক্রিন সমর্থিত",
    versionLabel: "সংস্করণ ১.০ · WebGL 2 & Godot 4",
    levelSelectTitle: "অধ্যায় নির্বাচন (১০টি সম্পূর্ণ লেভেল)",
    levelSelectSubtitle: "গ্রামীণ বাংলার ভৌতিক লোককথাভিত্তিক ১০টি সম্পূর্ণ playable মিশন",
    playBtn: "খেলুন",
    completedBadge: "সম্পন্ন",
    rulePrefix: "বেঁচে থাকার নিয়ম:",
    ghostPrefix: "প্রেতাত্মা:",
    journalTitle: "রাইডারের ডায়েরি ও চালান",
    consignmentInfo: "ডেলিভারি পার্সেল চালান",
    parcelName: "পার্সেলের নাম:",
    parcelWeight: "ওজন:",
    parcelDestination: "গন্তব্য:",
    survivalRuleTitle: "জীবিত ফেরার কঠোর নিয়ম",
    notesTitle: "সংগৃহীত চিরকুট ও পরিবেশের সংকেত",
    folkloreTitle: "লোককথা ও ইতিহাস (Folklore Archive)",
    settingsTitle: "গেম সেটিংস",
    graphicsTitle: "গ্রাফিক্স মান (Graphics Presets)",
    graphicsLow: "লো (Low)",
    graphicsMed: "মিডিয়াম (Med)",
    graphicsHigh: "হাই (High)",
    graphicsNote: "মোবাইল বা পুরনো ডিভাইসে মসৃণ ৬০ ফ্রেম পেতে লো বা মিডিয়াম নির্বাচন করুন।",
    audioTitle: "শব্দ ও থ্রিডি অডিও ভলিউম",
    masterVol: "মাস্টার ভলিউম (Master):",
    ambienceVol: "গ্রামীণ রাতের আবহ (Ambience):",
    sfxVol: "পদক্ষেপ ও এফেক্টস (SFX):",
    voiceVol: "ভৌতিক কণ্ঠ ও ফিসফিস (Voice Whispers):",
    languageToggle: "ভাষা পরিবর্তন (Language):",
    languageBn: "বাংলা (Bengali)",
    languageEn: "English",
    subtitlesToggle: "সাবটাইটেল প্রদর্শন (Subtitles):",
    vibrationToggle: "মোবাইল ভাইব্রেশন ও ভয়ের ঝাঁকুনি:",
    vibrationOn: "চালু (On)",
    vibrationOff: "বন্ধ (Off)",
    gameOverTitle: "আপনি রক্ষা পেলেন না",
    gameOverSubtitle: "মৃত্যু ও অন্ধকার গ্রাস করেছে",
    sanityFailedReason: "অন্ধকারের ভয়ে আপনার মানসিক ভারসাম্য ভেঙে গেছে...",
    ghostFailedReason: "অশরীরী আত্মা আপনাকে গ্রাস করেছে...",
    retryBtn: "চেকপয়েন্ট থেকে পুনরায় চেষ্টা করুন",
    victoryTitle: "ডেলিভারি সফল!",
    victorySubtitle: "আপনি সফলভাবে নিয়ম মেনে নির্দিষ্ট স্থানে পার্সেল পৌঁছে দিয়েছেন।",
    finalVictoryTitle: "রাত ৩টার অভিশাপ থেকে চিরমুক্তি!",
    finalVictorySubtitle: "আপনি সফলভাবে ১০টি বিপজ্জনক মিশন শেষ করেছেন এবং গ্রামীণ বাংলার অমাবস্যার অন্ধকার থেকে মুক্ত হয়েছেন!",
    nextChapterBtn: "পরবর্তী অধ্যায়ে যান",
    unlockedLoreTitle: "উন্মোচিত লোককথা (Lore Fragment):",
    creditsTitle: "লোককথা, কাহিনি ও ঋণস্বীকার",
    creditsHeader: "রাত ৩টার ডেলিভারি (3 AM Delivery)",
    creditsDescription: "বাংলার শতাব্দী প্রাচীন গ্রামীণ লোকগাথা, নিশিডাক, শ্মশান ও বটতলার ভৌতিক আখ্যানের সমন্বয়ে নির্মিত প্রথম-ব্যক্তি ৩ডি সাইকোলজিক্যাল হরর পাজল গেম।",
    creditsEntitiesTitle: "তিন অতিপ্রাকৃতিক সত্ত্বা ও বাঁচার নিয়মাবলী:",
    creditsAudioTitle: "সাউন্ড ও ভিজ্যুয়াল আর্কিটেকচার:",
    creditsAudioDesc: "Web Audio API সিন্থেসাইজার দ্বারা বাস্তবসম্মত ঝিঁঝিঁ পোকা, বাতাস, কাদার ওপর জুতার পদক্ষেপ ও দিকনির্দেশক ৩ডি বাংলা ফিসফিস তৈরি করা হয়েছে (100% Procedural Web Audio, No external 404s)।"
  },
  en: {
    gameTitle: "3 AM Delivery",
    gameSubtitle: "You are the midnight rider. Deliver forbidden parcels across rural Bengal at 3 AM. Disobeying folklore rules means you never return.",
    chapter: "Chapter",
    timeLabel: "Time",
    batteryLabel: "Battery",
    sanityLabel: "Sanity",
    inventoryTitle: "Rider's Inventory Satchel",
    inventorySubtitle: "Examine collected keys, parcels, and supernatural notes",
    inventoryEmpty: "Your inventory is currently empty.",
    inspectItem: "Examine Item",
    inspectClose: "Close",
    categoryParcel: "Delivery Parcel",
    categoryKey: "Key",
    categoryNote: "Note & Map",
    categoryTalisman: "Talisman & Ward",
    torchOn: "Torch On [F]",
    torchOff: "Torch Off [F]",
    deliverAction: "Deliver [E]",
    safeLanternStation: "Safe Lantern Station",
    deliverPrompt: "[E / Tap] Complete Parcel Delivery",
    newClueFound: "New Clue Collected:",
    cinemaModeOpen: "Open Control Dock",
    cinemaModeHide: "Cinema Mode (Hide)",
    journalBtn: "Journal & Clues",
    pauseTitle: "Game Paused",
    resumeGame: "Resume Game",
    newGame: "New Game",
    continueGame: "Continue",
    chaptersBtn: "Select Chapter (10 Levels)",
    godotExportBtn: "Download Godot 4 Project (.ZIP)",
    settingsBtn: "Settings",
    creditsBtn: "Folklore & Credits",
    exitToMenu: "Exit to Menu",
    headphonesTip: "Headphones recommended for authentic 3D spatial horror audio",
    controlsTip: "PC Keyboard & Mouse / Android Touchscreen supported",
    versionLabel: "Version 1.0 · WebGL 2 & Godot 4",
    levelSelectTitle: "Chapter Selection (10 Complete Levels)",
    levelSelectSubtitle: "10 fully playable missions inspired by Bengali supernatural legends",
    playBtn: "Play",
    completedBadge: "Completed",
    rulePrefix: "Survival Rule:",
    ghostPrefix: "Specter:",
    journalTitle: "Rider's Log & Consignment",
    consignmentInfo: "Delivery Consignment Waybill",
    parcelName: "Parcel Name:",
    parcelWeight: "Weight:",
    parcelDestination: "Destination:",
    survivalRuleTitle: "Strict Rule of Survival",
    notesTitle: "Collected Notes & Environmental Clues",
    folkloreTitle: "Folklore Archive",
    settingsTitle: "Game Settings",
    graphicsTitle: "Graphics Quality Presets",
    graphicsLow: "Low",
    graphicsMed: "Medium",
    graphicsHigh: "High",
    graphicsNote: "Select Low or Medium for steady 60 FPS on mobile or low-end devices.",
    audioTitle: "Audio & 3D Spatial Volumes",
    masterVol: "Master Volume:",
    ambienceVol: "Night Ambience:",
    sfxVol: "Footsteps & SFX:",
    voiceVol: "Ghost Whispers:",
    languageToggle: "Language:",
    languageBn: "বাংলা (Bengali)",
    languageEn: "English",
    subtitlesToggle: "Subtitles Display:",
    vibrationToggle: "Haptic Vibration & Fear Jolt:",
    vibrationOn: "On",
    vibrationOff: "Off",
    gameOverTitle: "You Did Not Survive",
    gameOverSubtitle: "Claimed by Darkness",
    sanityFailedReason: "Your sanity shattered in the unyielding darkness...",
    ghostFailedReason: "The supernatural entity has consumed your soul...",
    retryBtn: "Retry from Checkpoint",
    victoryTitle: "Delivery Successful!",
    victorySubtitle: "You strictly followed the rules and delivered the parcel to the designated sanctuary.",
    finalVictoryTitle: "Permanent Release from the 3 AM Curse!",
    finalVictorySubtitle: "You have conquered all 10 perilous deliveries and escaped the midnight curse of rural Bengal!",
    nextChapterBtn: "Proceed to Next Chapter",
    unlockedLoreTitle: "Unlocked Folklore (Lore Fragment):",
    creditsTitle: "Folklore, Lore & Attributions",
    creditsHeader: "3 AM Delivery (রাত ৩টার ডেলিভারি)",
    creditsDescription: "A first-person 3D psychological horror puzzle game based on centuries-old Bengali rural folklore, Nishi callers, cremation grounds, and banyan tree crossroads.",
    creditsEntitiesTitle: "Three Supernatural Entities & Counterplay:",
    creditsAudioTitle: "Sound & Visual Architecture:",
    creditsAudioDesc: "Realistic crickets, gusting winds, footsteps across mud, and directional 3D whispers synthesized via Web Audio API (100% Procedural Web Audio, No external 404s)."
  }
};
