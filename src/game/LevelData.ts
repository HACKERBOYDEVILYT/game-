import { LevelDefinition } from '../types/game.ts';

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    number: 1,
    titleBn: "বটতলার শেষ বাড়ি",
    titleEn: "The Last House at Bottola",
    locationBn: "প্রাচীন বটবৃক্ষের তিনরাস্তার মোড় ও কাঁচা মেঠোপথ",
    locationEn: "Ancient Banyan Crossroads & Mud Track",
    ruleBn: "কঠোর নিয়ম: পেছন থেকে কেউ তোমার নাম ধরে ডাকলেও ভুলেও পেছনে তাকাবে না। সোজা হেঁটে নিরাপদ লণ্ঠনের আলোয় পৌঁছাও।",
    ruleEn: "Strict Rule: Never turn back when hearing your name called from behind. Keep walking forward into the safe lantern light.",
    objectiveBn: "কালো তাবিজের পার্সেলটি বটতলার শেষ পোড়োবাড়ির কাঠের দরজায় পৌঁছে দাও।",
    objectiveEn: "Deliver the black talisman parcel to the wooden door of the last house at Bottola.",
    parcelNameBn: "কালো রেশমি কাপড়ে মোড়ানো তাবিজের বাক্স",
    parcelNameEn: "Silk-wrapped Talisman Box",
    parcelDescriptionBn: "পার্সেলটি অস্বাভাবিক ভারী এবং শীতল। এর গায়ে পুরানো বাংলা হরফে লেখা: '৩টার পূর্বে খুলবেন না'。",
    parcelDescriptionEn: "The package is unnervingly heavy and ice-cold. An inscription reads: 'Do not unseal before 3:00 AM'.",
    parcelWeight: "১.২ কেজি",
    parcelWeightEn: "1.2 kg",
    loreUnlockBn: "গ্রামের মানুষের বিশ্বাস—রাত ৩টায় বটতলায় অশরীরী আত্মা পথিকের কণ্ঠ নকল করে নাম ধরে ডাকে। পেছন ফিরলেই ঘাড় মটকে দেয়।",
    loreUnlockEn: "Local folklore warns that at 3 AM by the Banyan tree, spirits mimic loved ones calling from behind. Turning around brings instant doom.",
    ghostType: 'caller_behind',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: 0, z: -35, radius: 4.5, labelBn: "বটতলার শেষ বাড়ি", labelEn: "The Last House at Bottola" },
    lanternStations: [
      { x: 0, z: 10, safeRadius: 5 },
      { x: 0, z: -15, safeRadius: 5 },
      { x: 0, z: -35, safeRadius: 6 },
    ],
    clues: [
      {
        id: "clue_1_1",
        titleBn: "ছেঁড়া চিরকুট",
        titleEn: "Torn Parchment",
        contentBn: "'ওরা তোমার ভাইয়ের গলায় ডাকবে। ডাক শুনলেও থামবে না, এক কদমও পেছনে ফিরবে না।' - হরিমোহন",
        contentEn: "'They will call in your brother's voice. Even if you hear it, do not halt, do not turn back a single inch.' - Harimohan",
        found: false,
        iconType: "note"
      }
    ],
    environmentType: "village_crossroads"
  },
  {
    id: 2,
    number: 2,
    titleBn: "বাঁশঝাড়ের পথ",
    titleEn: "Path Through the Bamboo Grove",
    locationBn: "ঘন বাঁশের জঙ্গল ও ভেজা মাটির সাঁকো",
    locationEn: "Dense Bamboo Thicket & Wet Bamboo Bridge",
    ruleBn: "কঠোর নিয়ম: বাঁশঝাড়ে সাদা লম্বা অবয়ব দেখলে টর্চ নিভিয়ে নিচে তাকাও এবং নীল জোনাকিদের পথ অনুসরণ করো।",
    ruleEn: "Strict Rule: If you spot the tall pale specter, switch off your flashlight, lower your gaze, and follow the blue fireflies.",
    objectiveBn: "কাফনের কাপড়ে মোড়ানো পার্সেলটি বাঁশঝাড় পার করে ওঝার কুটিরে পৌঁছে দাও।",
    objectiveEn: "Deliver the shroud-wrapped parcel across the bamboo grove to the exorcist's hut.",
    parcelNameBn: "শ্বেত কাফনের কাপড়ে বাঁধা পার্সেল",
    parcelNameEn: "White Shroud Offering",
    parcelDescriptionBn: "কাপড়টির ভেতর শুকনো নিমপাতা ও কর্পূরের গন্ধ। মৃদু কম্পন অনুভূত হচ্ছে।",
    parcelDescriptionEn: "Emits faint odors of dried neem and camphor. You can sense subtle, rhythmic vibrations inside.",
    parcelWeight: "০.৮ কেজি",
    parcelWeightEn: "0.8 kg",
    loreUnlockBn: "বাঁশঝাড়ের পেত্নী মাথার ওপর ঝুঁকে থাকে। সরাসরি আলোর আলো ফেললে সে ক্ষিপ্ত হয়ে পথ আগলে দাঁড়ায়।",
    loreUnlockEn: "The specter of the bamboo thicket looms overhead. Direct bright light provokes her into barring the road.",
    ghostType: 'shadow_stalker',
    playerSpawn: { x: -25, z: 25, rotationY: Math.PI * 0.75 },
    destination: { x: 25, z: -30, radius: 4.5, labelBn: "ওঝার কুটির", labelEn: "The Exorcist's Hut" },
    lanternStations: [
      { x: -10, z: 12, safeRadius: 5 },
      { x: 8, z: -10, safeRadius: 5 },
      { x: 25, z: -30, safeRadius: 6 }
    ],
    clues: [
      {
        id: "clue_2_1",
        titleBn: "কাঠের তক্তায় সতর্কবাণী",
        titleEn: "Wooden Warning Board",
        contentBn: "'বাঁশের ডাল নুয়ে পড়লে আলো নিভিয়ে নিঃশ্বাস চেপে রাখো। আলো দেখলেই সে নেমে আসে।'",
        contentEn: "'When bamboo stems bend, extinguish light and hold breath. She descends toward brightness.'",
        found: false,
        iconType: "symbol"
      }
    ],
    environmentType: "bamboo_grove"
  },
  {
    id: 3,
    number: 3,
    titleBn: "পুরোনো বাড়ি",
    titleEn: "The Ancestral Homestead",
    locationBn: "ভেঙে পড়া পুরোনো ইটের উঠোন ও বন্ধ কাঠের খড়খড়ি",
    locationEn: "Crumbling Homestead Courtyard & Shuttered Windows",
    ruleBn: "কঠোর নিয়ম: উঠোনে তিনটি বন্ধ দরজা আছে। যে দরজায় টোকা দিলে ভেতর থেকে ঠিক ৩টি প্রত্যুত্তর পাওয়া যায়, কেবল সেই ঘরেই পার্সেল রাখবে।",
    ruleEn: "Strict Rule: Three shut doors in the courtyard. Enter only the door that answers with exactly 3 knocks; avoid echoes.",
    objectiveBn: "পিতলের প্রদীপটি সঠিক ঘরে স্থাপন করে পার্সেল হস্তান্তর নিশ্চিত করো।",
    objectiveEn: "Place the antique brass lamp inside the verified room to complete delivery.",
    parcelNameBn: "পিতলের প্রাচীন পঞ্চপ্রদীপ",
    parcelNameEn: "Antique Brass Oil Lamp",
    parcelDescriptionBn: "প্রদীপে তেল ভরা কিন্তু কোনো আগুন নেই। ঠাণ্ডা ধাতু বরফের মতো স্পর্শ দেয়।",
    parcelDescriptionEn: "Filled with ancient oil but unlit. The brass is sub-zero cold to the touch.",
    parcelWeight: "২.১ কেজি",
    parcelWeightEn: "2.1 kg",
    loreUnlockBn: "এই ভিটায় বহু বছর আগে এক ব্যবসায়ী পরিবার নিশির ডাকে বিভ্রান্ত হয়ে কূপে ঝাঁপ দিয়েছিল।",
    loreUnlockEn: "Decades ago, a merchant family here was lured into the dry well by deceptive voices mimicking relatives.",
    ghostType: 'nishi_guest',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: 18, z: -20, radius: 4.0, labelBn: "পূর্বের কক্ষ (৩টি টোকা)", labelEn: "Eastern Chamber (3 Knocks)" },
    lanternStations: [
      { x: 0, z: 15, safeRadius: 5 },
      { x: -15, z: -5, safeRadius: 4.5 },
      { x: 18, z: -20, safeRadius: 5.5 }
    ],
    clues: [
      {
        id: "clue_3_1",
        titleBn: "হলুদ ডায়েরির পাতা",
        titleEn: "Yellowed Diary Page",
        contentBn: "'যে দরজার ওপাশ থেকে কান্নার শব্দ আসে সেটিতে ভুলেও ঢুকো না। ঘরের ভেতর প্রদীপ রাখলে পূর্বের দ্বার খুলে যায়।'",
        contentEn: "'Never enter the door from where weeping echoes. Placing the lamp opens the eastern gate.'",
        found: false,
        iconType: "note"
      }
    ],
    environmentType: "old_homestead"
  },
  {
    id: 4,
    number: 4,
    titleBn: "শ্মশানের পথ",
    titleEn: "The Cremation Byway",
    locationBn: "নদী তীরের শ্মশানঘাট, চিতাগর্ত ও ভাঙা বেড়া",
    locationEn: "Riverbank Cremation Ground & Broken Palisades",
    ruleBn: "কঠোর নিয়ম: কেবল চাঁদের আলো ও জ্বলন্ত মাটির চুল্লির বৃত্তের ভেতর হাঁটো। অন্ধকারের ছায়ায় পা রাখলেই প্রাণশক্তি শুষে নেবে ছায়ামূর্তি।",
    ruleEn: "Strict Rule: Walk only inside pools of moonlight and embers. Lingering in pitch-black shadows drains sanity rapidly.",
    objectiveBn: "মাটির তৈরি ভস্মের কলসি শ্মশানের শিবমন্দিরের বেদিতে পৌঁছে দাও।",
    objectiveEn: "Deliver the terracotta funeral urn onto the altar of the riverside shrine.",
    parcelNameBn: "লাল কাপড়ে ঢাকা মাটির ভস্মকলস",
    parcelNameEn: "Sealed Terracotta Burial Urn",
    parcelDescriptionBn: "কলসটির মুখে লাল সিঁদুরের ছাপ। এর ভেতর থেকে মৃদু নদীর বালুর শব্দ শোনা যায়।",
    parcelDescriptionEn: "Sealed with vermilion ritual paste. Shaking it reveals the dry rustle of river sand and ashes.",
    parcelWeight: "৩.০ কেজি",
    parcelWeightEn: "3.0 kg",
    loreUnlockBn: "শ্মশানের ছায়ামূর্তিরা মানুষের চোখ সহ্য করতে পারে না, কিন্তু অন্ধকারে তারা নিঃশব্দে ঘিরে ধরে।",
    loreUnlockEn: "The shadow stalkers of the cremation ground abhor direct human gaze, yet close in ruthlessly in darkness.",
    ghostType: 'shadow_stalker',
    playerSpawn: { x: -28, z: 20, rotationY: Math.PI * 0.6 },
    destination: { x: 24, z: -25, radius: 5.0, labelBn: "শ্মশান শিবমন্দিরের বেদি", labelEn: "Cremation Altar of Shiva" },
    lanternStations: [
      { x: -15, z: 10, safeRadius: 5 },
      { x: 0, z: -5, safeRadius: 6 },
      { x: 15, z: -15, safeRadius: 5 },
      { x: 24, z: -25, safeRadius: 6 }
    ],
    clues: [
      {
        id: "clue_4_1",
        titleBn: "তাগা ও মন্ত্রের দাগ",
        titleEn: "Runic Amulet Chalk",
        contentBn: "'চিতার আগুন নিভে গেলে টর্চের রশ্মি সরাসরি ছায়ার মুখে স্থির রাখলে সে কিছুক্ষণের জন্য জমে যায়।'",
        contentEn: "'If funeral pyres die down, fix your beam straight at the shadow face; it freezes in place.'",
        found: false,
        iconType: "talisman"
      }
    ],
    environmentType: "cremation_ground"
  },
  {
    id: 5,
    number: 5,
    titleBn: "পরিত্যক্ত স্কুল",
    titleEn: "The Abandoned Schoolhouse",
    locationBn: "১৯৪৭ সালের ভাঙা প্রাইমারি স্কুল, জং ধরা লোহার গেট ও খেলার মাঠ",
    locationEn: "1947 Primary School Ruins & Corroded Iron Gate",
    ruleBn: "কঠোর নিয়ম: ব্ল্যাকবোর্ডে চক দিয়ে লেখা ৩ অঙ্কের গোপন কোডটি সংগ্রহ করে প্রধান ফটকের তালার সংকেত মেলাও। পেছনের ডাক এলে দৌড়াবে না।",
    ruleEn: "Strict Rule: Find the 3 chalk digits on the classroom blackboard to open the iron gate. Do not run when called.",
    objectiveBn: "পুরোনো হাজিরা খাতা ও দলিলের ফাইলটি প্রধান শিক্ষকের টেবিলে রাখো।",
    objectiveEn: "Deliver the vintage school register file to the Headmaster's desk beyond the gate.",
    parcelNameBn: "জীর্ণ চামড়ার মলাটে ১৯৫০ সালের হাজিরা খাতা",
    parcelNameEn: "1950 Leather School Register",
    parcelDescriptionBn: "পাতাগুলোয় লাল কালিতে এমন কিছু নাম কাটা যা গ্রামের ভোটার তালিকায় নেই।",
    parcelDescriptionEn: "Bound in cracked leather. Contains crossed-out names written in red ink that appear in no census.",
    parcelWeight: "১.৫ কেজি",
    parcelWeightEn: "1.5 kg",
    loreUnlockBn: "এই স্কুলের প্রাক্তন পণ্ডিত মশাই গভীর রাতেও ঘণ্টার আওয়াজ বাজান। তার ক্লাসরুমে ঢোকা নিষেধ।",
    loreUnlockEn: "The old schoolmaster still tolls the bronze bell at midnight. Entering his classroom triggers the curse.",
    ghostType: 'caller_behind',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: 0, z: -32, radius: 4.5, labelBn: "প্রধান শিক্ষকের অফিস", labelEn: "Headmaster's Office" },
    lanternStations: [
      { x: -10, z: 15, safeRadius: 5 },
      { x: 10, z: -8, safeRadius: 5 },
      { x: 0, z: -32, safeRadius: 6 }
    ],
    puzzleCodeRequired: "307",
    clues: [
      {
        id: "clue_5_1",
        titleBn: "ব্ল্যাকবোর্ডের চকলেখা",
        titleEn: "Chalkboard Numbers",
        contentBn: "কালো বোর্ডে চক দিয়ে বড় করে লেখা: [ ৩ - ০ - ৭ ]। নিচে লেখা: 'গেটের তালার সংকেত'。",
        contentEn: "Written boldly in white chalk: [ 3 - 0 - 7 ]. Caption: 'Code for the rusted padlocks'.",
        found: false,
        iconType: "note"
      }
    ],
    environmentType: "schoolhouse"
  },
  {
    id: 6,
    number: 6,
    titleBn: "নদীর ঘাট",
    titleEn: "The River Ghat",
    locationBn: "কালচে জলের খেয়াঘাট, বাঁধা নৌকা ও ভেজা কাঠের জেটি",
    locationEn: "Dark River Ghat, Moored Wooden Boats & Foggy Jetty",
    ruleBn: "কঠোর নিয়ম: কালো পানিতে চাঁদের প্রতিবিম্বে অন্য অবয়ব দেখা যাবে—পানিতে তাকাবে না। কেবল ঘাটের ঘণ্টার টুংটাং শব্দ লক্ষ্য করে এগোও।",
    ruleEn: "Strict Rule: Illusions manifest inside water reflections; look straight ahead and follow the ghat bell chime.",
    objectiveBn: "সৈন্ধব লবণের বস্তাটি মাঝির শূন্য নৌকার পাটাতনে রেখে আসো।",
    objectiveEn: "Deliver the consecrated river-salt sack onto the deck of the phantom boat.",
    parcelNameBn: "লাল সুতোয় বাঁধা সৈন্ধব লবণের থলি",
    parcelNameEn: "Bag of Consecrated River Salt",
    parcelDescriptionBn: "লবণ অশুভ আত্মাদের সীমা লঙ্ঘন করতে দেয় না। থলির ভেতর স্ফটিক পাথর জ্বলছে।",
    parcelDescriptionEn: "Tightly stitched in coarse jute. The consecrated mineral salt repels malevolent waters.",
    parcelWeight: "২.৮ কেজি",
    parcelWeightEn: "2.8 kg",
    loreUnlockBn: "নদীর ঘাটে নিশির ডাকে কত মাঝি মাঝনদীতে নৌকা ডুবিয়েছে তার কোনো হিসাব নেই।",
    loreUnlockEn: "Countless ferrymen vanished mid-river, led astray by counterfeit voices singing across the black waters.",
    ghostType: 'nishi_guest',
    playerSpawn: { x: -20, z: 25, rotationY: Math.PI * 0.8 },
    destination: { x: 0, z: -30, radius: 5.0, labelBn: "ঘাটের প্রধান নৌকা", labelEn: "Ferryman's Moored Boat" },
    lanternStations: [
      { x: -8, z: 12, safeRadius: 5 },
      { x: 5, z: -10, safeRadius: 5 },
      { x: 0, z: -30, safeRadius: 6 }
    ],
    clues: [
      {
        id: "clue_6_1",
        titleBn: "মাঝির ভিজে কাঠের ফলক",
        titleEn: "Ferryman's Carved Sign",
        contentBn: "'জলে যাকে দেখতে পাবে সে জীবিত নয়। ঘাটের লণ্ঠনের রিং বেজে উঠলে তবেই নৌকায় পা দিও।'",
        contentEn: "'Whoever you see in the water is not alive. Step onto the boat only when the lantern bell tolls.'",
        found: false,
        iconType: "symbol"
      }
    ],
    environmentType: "river_ghat"
  },
  {
    id: 7,
    number: 7,
    titleBn: "বটগাছের মোড়",
    titleEn: "The Endless Crossroads",
    locationBn: "গোলকধাঁধাঁ রাস্তা, বারবার একই বটবৃক্ষ ও দিকভ্রান্ত কুয়াশা",
    locationEn: "Infinite Looping Crossroads & Fogbound Trails",
    ruleBn: "কঠোর নিয়ম: পথটি অভিশপ্ত লুপে আটকে আছে। যে মোড়ে ভাঙা মাটির সানকি ও উল্টো বাঁশের খুঁটি দেখবে, কেবল সেই পথেই বাঁক নাও।",
    ruleEn: "Strict Rule: The crossroads loop endlessly. Break the curse by choosing the lane with the overturned clay bowl.",
    objectiveBn: "রক্তবর্ণ রেশমের সুতো দিয়ে গিঁট দেওয়া পার্সেলটি গোলকধাঁধার কেন্দ্রীয় বেদিতে পৌঁছাও।",
    objectiveEn: "Deliver the Crimson Thread Relic into the heart altar of the unbroken circle.",
    parcelNameBn: "রক্তবর্ণ রেশমের সুতোয় বাঁধা কাঠের পেটিকা",
    parcelNameEn: "Crimson Thread Relic Box",
    parcelDescriptionBn: "পেটিকার ভেতর প্রাচীন তাম্রলিপি। এটি দিকভ্রান্ত পথিকের মোহমুক্তি ঘটায়।",
    parcelDescriptionEn: "An intricately carved teak box bound in crimson thread, containing antique protective copperplate inscriptions.",
    parcelWeight: "১.৯ কেজি",
    parcelWeightEn: "1.9 kg",
    loreUnlockBn: "মায়াজালে পড়া পথিকের কাছে এক কিলোমিটার পথ অনন্তকালের সমান মনে হয়।",
    loreUnlockEn: "Those trapped in the supernatural maze loop through the exact same turns until dawn or death.",
    ghostType: 'caller_behind',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: -25, z: -20, radius: 4.5, labelBn: "মুক্তির বেদি", labelEn: "Altar of Liberation" },
    lanternStations: [
      { x: 0, z: 10, safeRadius: 5 },
      { x: 18, z: 0, safeRadius: 5 },
      { x: -25, z: -20, safeRadius: 6 }
    ],
    clues: [
      {
        id: "clue_7_1",
        titleBn: "মাটিতে খোদাই করা চক্র",
        titleEn: "Ground Inscribed Ring",
        contentBn: "'তিনবার একই বটগাছ দেখলে বুঝবে তুমি চক্রে বন্দি। বাঁয়ে উল্টো কলসি খোঁজো।' - অজ্ঞাত পথিক",
        contentEn: "'If you pass the same banyan tree thrice, you are cursed in the loop. Look left for the flipped earthen pot.'",
        found: false,
        iconType: "symbol"
      }
    ],
    environmentType: "endless_loop"
  },
  {
    id: 8,
    number: 8,
    titleBn: "কবরস্থানের পাশ",
    titleEn: "Beside the Graveyard",
    locationBn: "পুরোনো শ্যাওলা পড়া গোরস্তান, উঁচু আকাশমনি গাছ ও লোহার জং ধরা ফটক",
    locationEn: "Mossy Graveyard Pathway & Towering Acacia Trees",
    ruleBn: "কঠোর নিয়ম: দূরের মন্দিরের পেতলের ঘণ্টা বাজার সঙ্গে সঙ্গে ১৫ সেকেন্ডের মধ্যে নিকটস্থ সুরক্ষিত গেজেবো লণ্ঠনের নিচে ঢুকতে হবে।",
    ruleEn: "Strict Rule: When the distant graveyard bell rings, enter the nearest glowing shrine within 15 seconds to escape.",
    objectiveBn: "ধূপ ও কর্পূরের সুগন্ধযুক্ত রূপার বাক্সটি গোরস্তানের প্রধান মাজারের তোরণে রাখো।",
    objectiveEn: "Deliver the Frankincense & Silver Censer to the entrance of the central shrine.",
    parcelNameBn: "রূপার খোদাই করা ধূপাধার",
    parcelNameEn: "Silver Incense Censer",
    parcelDescriptionBn: "বাক্সটি থেকে গন্ধরস ও বুনো ধূপের ধোঁয়া বের হচ্ছে, যা প্রেতাত্মাদের শান্ত রাখে।",
    parcelDescriptionEn: "A silver chased container exuding resinous smoke and camphor aroma that calms restless wanderers.",
    parcelWeight: "২.৪ কেজি",
    parcelWeightEn: "2.4 kg",
    loreUnlockBn: "কবরস্থানের ছায়ামূর্তিরা মানুষের ভয়ের গন্ধ পেয়ে দল বেঁধে ধেয়ে আসে। ধূপের ঘ্রাণ তাদের দূরে সরায়।",
    loreUnlockEn: "Shadows rising from old graves follow the scent of terror. Sacrificial incense is your sole repellant.",
    ghostType: 'shadow_stalker',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: -20, z: -25, radius: 5.0, labelBn: "প্রধান মাজারের তোরণ", labelEn: "Central Shrine Gate" },
    lanternStations: [
      { x: 15, z: 8, safeRadius: 5.5 },
      { x: -2, z: -5, safeRadius: 6.0 },
      { x: -20, z: -25, safeRadius: 6.5 }
    ],
    clues: [
      {
        id: "clue_8_1",
        titleBn: "খোদাই করা এপিটাফ",
        titleEn: "Carved Stone Epitaph",
        contentBn: "'ঘণ্টার শব্দে মাটির তলার ছায়ারা জেগে ওঠে। লণ্ঠনের গণ্ডির ভেতর পা রাখলে ছায়া স্পর্শ করতে পারে না।'",
        contentEn: "'The toll of the bell awakens subterranean shadows. Inside the lantern halo, they cannot touch you.'",
        found: false,
        iconType: "note"
      }
    ],
    environmentType: "graveyard"
  },
  {
    id: 9,
    number: 9,
    titleBn: "জমিদারবাড়ি",
    titleEn: "The Zamindar Mansion",
    locationBn: "১৮ শতকের ভগ্ন রাজপ্রাসাদ, থামওয়ালা নাটমন্দির ও অন্ধকার অলিন্দ",
    locationEn: "18th Century Dilapidated Palace & Pillar Corridors",
    ruleBn: "কঠোর নিয়ম: প্রাসাদে ছায়ামূর্তি ও নিশির অতিথি দুই-ই ঘুরে বেড়াচ্ছে। গোপন সিন্দুক থেকে ৩টি পিতলের চাবি খুঁজে মূল দরবার খুলতে হবে।",
    ruleEn: "Strict Rule: Both Shadow Stalker and Nishi roam here. Find 3 brass keys in side chambers to unlock the Grand Durbar.",
    objectiveBn: "জমিদারবংশের সিলমোহরকৃত রূপার পেয়ালী প্রধান বৈঠকখানার সিন্দুকে স্থাপন করো।",
    objectiveEn: "Deliver the ancestral silver signet casket into the Zamindar's iron chest.",
    parcelNameBn: "জমিদারবংশের সিলমোহরযুক্ত রূপার পেয়ালী",
    parcelNameEn: "Ancestral Silver Signet Casket",
    parcelDescriptionBn: "এই কাস্কেটে রাজবংশের রক্তের শপথ সংরক্ষিত। এর স্পর্শে পোড়োবাড়ির প্রদীপগুলো আপনাআপনি জ্বলে ওঠে।",
    parcelDescriptionEn: "A heavy silver casket sealed with feudal dynasty crests. Holding it causes nearby unlit wicks to crackle.",
    parcelWeight: "৪.২ কেজি",
    parcelWeightEn: "4.2 kg",
    loreUnlockBn: "১৮৯৭ সালের ভূমিকম্পের পর এই রাজপ্রাসাদ পরিত্যক্ত হয়। জমিদার পরিবারের আর্তনাদ এখনও দেয়ালে বাজে।",
    loreUnlockEn: "Abandoned following the earthquake of 1897. The lament of the royal lineage still vibrates through the masonry.",
    ghostType: 'shadow_stalker',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: 0, z: -35, radius: 5.0, labelBn: "প্রধান বৈঠকখানা দরবার", labelEn: "Grand Durbar Hall" },
    lanternStations: [
      { x: -12, z: 12, safeRadius: 5 },
      { x: 12, z: 12, safeRadius: 5 },
      { x: 0, z: -10, safeRadius: 6 },
      { x: 0, z: -35, safeRadius: 6 }
    ],
    clues: [
      {
        id: "clue_9_1",
        titleBn: "দেয়ালের খোদাই ও চাবির মানচিত্র",
        titleEn: "Mansion Blueprint & Key Clue",
        contentBn: "'উত্তর নাটমন্দিরে প্রথম চাবি, পশ্চিমের খড়খড়িতে দ্বিতীয় চাবি, এবং শয়নকক্ষে শেষ চাবি লুকানো আছে।'",
        contentEn: "'First key rests in northern theater, second by western shutter, final key inside master bedchamber.'",
        found: false,
        iconType: "key"
      }
    ],
    environmentType: "zamindar_palace"
  },
  {
    id: 10,
    number: 10,
    titleBn: "শেষ ডেলিভারি",
    titleEn: "The Final Delivery",
    locationBn: "রাত ৩টার চিরন্তন বেদি, ত্রিসীমানা ও কালো কুয়াশার কেন্দ্রবিন্দু",
    locationEn: "The Eternal 3 AM Shrine & Convergence of Fog",
    ruleBn: "চূড়ান্ত নিয়ম: আগের সব নিয়ম একত্র করো—পেছন থেকে ডাকলে ফিরবে না, ছায়ামূর্তির মুখে আলো ফেলবে, এবং নিশির ডাকে সাড়া না দিয়ে সত্য বেদিতে পার্সেল রাখবে!",
    ruleEn: "Ultimate Rule: Combine all rules: never look back at calls, freeze shadows with your beam, ignore false lures, and seal the shrine!",
    objectiveBn: "চূড়ান্ত পার্সেলটি রহস্যময় প্রাচীন বেদিতে স্থাপন করে অভিশাপ চিরতরে চুকিয়ে দাও।",
    objectiveEn: "Place the Master 3 AM Parcel upon the ancient altar to permanently break the rural curse.",
    parcelNameBn: "রাত ৩টার নিষিদ্ধ মহাপার্সেল (Master 3 AM Parcel)",
    parcelNameEn: "The Forbidden 3 AM Master Parcel",
    parcelDescriptionBn: "এটি কোনো সাধারণ পার্সেল নয়; এটি তোমার নিজের অতীতের স্মৃতি ও অভিশাপ মুক্তির একমাত্র চাবি।",
    parcelDescriptionEn: "No ordinary cargo; it contains your own past memories and the sole key to breaking the cycle of 3:00 AM.",
    parcelWeight: "৫.০ কেজি",
    parcelWeightEn: "5.0 kg",
    loreUnlockBn: "তুমি ডেলিভারি বয় নও—তুমি বহু বছর ধরে এই রাত ৩টার অমাবস্যায় আটকে থাকা এক মুক্তিপ্রত্যাশী পথযাত্রী। আজ তোমার মুক্তি মিলল!",
    loreUnlockEn: "You were never just a delivery rider; you were a lost soul navigating the timeless midnight hour of Bengal. Today, you are free.",
    ghostType: 'caller_behind',
    playerSpawn: { x: 0, z: 25, rotationY: 0 },
    destination: { x: 0, z: -38, radius: 5.5, labelBn: "অভিশাপ মুক্তির পরম বেদি", labelEn: "Altar of Final Release" },
    lanternStations: [
      { x: -15, z: 15, safeRadius: 5 },
      { x: 15, z: 15, safeRadius: 5 },
      { x: 0, z: 0, safeRadius: 7 },
      { x: -10, z: -20, safeRadius: 5 },
      { x: 10, z: -20, safeRadius: 5 },
      { x: 0, z: -38, safeRadius: 7 }
    ],
    clues: [
      {
        id: "clue_10_1",
        titleBn: "তোমার নিজের হাতের চিঠি",
        titleEn: "Letter in Your Own Handwriting",
        contentBn: "'আজ রাত ৩টার পর আর কোনো পার্সেল থাকবে না। ঘড়িতে ৩টা বাজলেই বেদি আলো হয়ে উঠবে। পিছন ফিরে তাকাবে না।' - তুমি নিজেই",
        contentEn: "'After 3 AM tonight, no more deliveries remain. When the clock strikes 3, the altar ignites. Never look back.' - Yourself",
        found: false,
        iconType: "talisman"
      }
    ],
    environmentType: "final_shrine"
  }
];
