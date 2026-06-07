(function () {
  const WORLD_W = 800;
  const WORLD_H = 500;
  const SPEED = 5;
  const PLAYER_SIZE = 28;
  const MAX_PLAYERS = 5;
  const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
  const IS_HTTPS = window.location.protocol === "https:";
  const MAX_HP = 100;
  const BOW_SPEED = 220;
  const REINFORCED_BOW_SPEED = Math.round(BOW_SPEED * 1.3);
  const DAGGER_THROW_SPEED = 260;
  const RPG_SPEED = 300;
  const BOW_LIFE_SEC = 3.5;
  const DAGGER_THROW_LIFE_SEC = 2;
  const RPG_LIFE_SEC = 90;
  const TOS_SPEED = Math.round(BOW_SPEED * 1.3);
  const TOS_LIFE_SEC = 4;
  const SCYTHE_RANGE = 55 * 1.5;
  const KATANA_RANGE = 55 * 2;
  const POTION_THROW_SPEED = 300;
  const POTION_MAX_DIST = SCYTHE_RANGE * 3;
  const POTION_AOE_RADIUS = 48;
  const HEART_HP = 10;
  const BURN_HEARTS_PER_SEC = 4;
  const BURN_DURATION_SEC = 2;
  const POISON_DMG_PER_SEC = 5;
  const POISON_DURATION_SEC = 10;
  const SHOT_BOW_SPREAD = 14;
  const MAGMA_FIRE_GROW_MS = 2500;
  const LASER_DURATION_SEC = 1;
  const LASER_TICK_SEC = 0.3;
  const LASER_DMG = 5;
  const LASER_BEAM_WIDTH = 18;
  const REDEEM_TOS_CODE = "ur3adthet3rm50fs3r1ve";
  const ROLLING_MS = 20000;
  const DEAD_ALPHA = 0.15;
  const TELEPORT_COOLDOWN_MS = 20000;
  const MAX_GAMES_IN_ROW = 20;
  const COOLDOWN_3C_MS = 5 * 60 * 1000;

  const menuEl = document.getElementById("menu");
  const gameEl = document.getElementById("game");
  const playerNameInput = document.getElementById("playerName");
  const joinCodeInput = document.getElementById("joinCode");
  const statusEl = document.getElementById("status");
  const roomLabelEl = document.getElementById("roomLabel");
  const shareBoxEl = document.getElementById("shareBox");
  const shareUrlInput = document.getElementById("shareUrl");
  const gameShareHintEl = document.getElementById("gameShareHint");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const btnSolo = document.getElementById("btnSolo");
  const btnJoin = document.getElementById("btnJoin");
  const btnCreate = document.getElementById("btnCreate");
  const btnLeave = document.getElementById("btnLeave");
  const btnStartGame = document.getElementById("btnStartGame");
  const btnWeapons = document.getElementById("btnWeapons");
  const btnSettings = document.getElementById("btnSettings");
  const btnCopyUrl = document.getElementById("btnCopyUrl");
  const btnCopyCode = document.getElementById("btnCopyCode");
  const gameStatusEl = document.getElementById("gameStatus");
  const weaponsModalEl = document.getElementById("weaponsModal");
  const backpackListEl = document.getElementById("backpackList");
  const traitListEl = document.getElementById("traitList");
  const btnCloseWeapons = document.getElementById("btnCloseWeapons");
  const btnRollWeapon = document.getElementById("btnRollWeapon");
  const btnRollTrait = document.getElementById("btnRollTrait");
  const killsLabelEl = document.getElementById("killsLabel");
  const traitLabelEl = document.getElementById("traitLabel");
  const luckLabelEl = document.getElementById("luckLabel");
  const tabWeaponsEl = document.getElementById("tabWeapons");
  const tabLuckEl = document.getElementById("tabLuck");
  const panelWeaponsEl = document.getElementById("panelWeapons");
  const panelLuckEl = document.getElementById("panelLuck");
  const luckListEl = document.getElementById("luckList");
  const killBonusListEl = document.getElementById("killBonusList");
  const luckStatusEl = document.getElementById("luckStatus");
  const settingsModalEl = document.getElementById("settingsModal");
  const redeemCodeEl = document.getElementById("redeemCode");
  const btnRedeem = document.getElementById("btnRedeem");
  const redeemStatusEl = document.getElementById("redeemStatus");
  const btnCloseSettings = document.getElementById("btnCloseSettings");
  const playerMenuEl = document.getElementById("playerMenu");
  const playerMenuTitleEl = document.getElementById("playerMenuTitle");
  const kickReasonInput = document.getElementById("kickReason");
  const btnKick = document.getElementById("btnKick");
  const btnBan = document.getElementById("btnBan");
  const btnClosePlayerMenu = document.getElementById("btnClosePlayerMenu");
  const selfMenuEl = document.getElementById("selfMenu");
  const selfMenuTitleEl = document.getElementById("selfMenuTitle");
  const selfMenuCodeEl = document.getElementById("selfMenuCode");
  const testerSwitchRowEl = document.getElementById("testerSwitchRow");
  const testerTraitSwitchEl = document.getElementById("testerTraitSwitch");
  const btnCloseSelfMenu = document.getElementById("btnCloseSelfMenu");
  const kickedOverlayEl = document.getElementById("kickedOverlay");
  const kickedMessageEl = document.getElementById("kickedMessage");
  const btnKickedOk = document.getElementById("btnKickedOk");
  const slainFeedEl = document.getElementById("slainFeed");
  const winOverlayEl = document.getElementById("winOverlay");
  const fightPhaseOverlayEl = document.getElementById("fightPhaseOverlay");
  const winMessageEl = document.getElementById("winMessage");
  const voteStatusEl = document.getElementById("voteStatus");
  const voteHelpTextEl = document.getElementById("voteHelpText");
  const btnVoteNext = document.getElementById("btnVoteNext");
  const rollOverlayEl = document.getElementById("rollOverlay");
  const rollCardInnerEl = document.getElementById("rollCardInner");
  const rollCardLabelEl = document.getElementById("rollCardLabel");
  const rollFrontNameEl = document.getElementById("rollFrontName");
  const rollFrontMetaEl = document.getElementById("rollFrontMeta");
  const rollRevealTextEl = document.getElementById("rollRevealText");
  const btnRollDone = document.getElementById("btnRollDone");
  const rollMagmaFxEl = document.getElementById("rollMagmaFx");
  const rollMagmaFireEl = document.getElementById("rollMagmaFire");
  const settingAnimationsEl = document.getElementById("settingAnimations");
  const settingRareAnimMultEl = document.getElementById("settingRareAnimMult");
  const accountLoggedOutEl = document.getElementById("accountLoggedOut");
  const accountLoggedInEl = document.getElementById("accountLoggedIn");
  const accUserEl = document.getElementById("accUser");
  const accPassEl = document.getElementById("accPass");
  const btnAccLogin = document.getElementById("btnAccLogin");
  const btnAccCreate = document.getElementById("btnAccCreate");
  const btnAccLogout = document.getElementById("btnAccLogout");
  const btnAccTest = document.getElementById("btnAccTest");
  const btnAccExitTest = document.getElementById("btnAccExitTest");
  const testModeBannerEl = document.getElementById("testModeBanner");
  const accWhoEl = document.getElementById("accWho");

  let keys = {};
  let animId = null;
  let mode = null;
  let roomCode = null;
  let peer = null;
  let hostConn = null;
  let guestConns = [];
  let peerToConn = new Map();
  let localPlayer = null;
  let players = new Map();
  let myPeerId = null;
  let menuTargetPlayer = null;
  let wasKicked = false;
  let projectiles = [];
  let activeLasers = [];
  let lastLoopTime = 0;
  let projSyncAccum = 0;
  let attackCooldownUntil = 0;
  let clickDownAt = 0;
  let lastAim = { x: WORLD_W / 2, y: WORLD_H / 2 };
  let rollAnimTimer = null;
  let rollAnimInvuln = false;
  let magmaFireTransitionHandler = null;

  let adminHoldTimer = null;
  let adminHoldPos = null;
  let adminHoldCanvasPos = null;
  let suppressNextAttack = false;
  let dashCooldownUntil = 0;
  let teleportCooldownUntil = 0;
  let matchPhase = "lobby";
  let phaseEndsAt = 0;
  let roomLocked = false;
  let winnerId = null;
  let nextGameVotes = new Set();
  let hasVotedNext = false;
  let roomGameNumber = 0;
  let sessionCooldownUntil = 0;
  let lastMatchUiTick = 0;

  // local account persistence (per device)
  const LS_ACCOUNTS = "bg_accounts_v1";
  const LS_CURRENT = "bg_current_user_v1";
  const LS_ROOM_BANS = "bg_room_bans_v1"; // host-side only
  const LS_TESTER_CODE = "bg_tester_code_v1";
  const LS_TESTER_TRAIT = "bg_tester_trait_v1";
  const LS_SETTINGS = "bg_settings_v1";

  const WEAPON_SPECIAL_ROLL_ANIM = {
    magma_scythe: "magma",
  };
  const LS_3C_COOLDOWN = "bg_3c_cooldown_until";
  const TESTER_CODE = "tester";
  let currentUser = null;
  let profile = null; // { inventory: string[], equipped: string|null, kills:number, trait:string|null }
  let testMode = false;
  let testModeNextRollWeapon = null;
  let profileSnapshot = null;
  let testerTraitUnlock = false;
  let testerCodeRevealed = false;
  let inventoryTab = "weapons";

  const LUCK_TIERS = [
    { mult: 2, cost: 10, label: "2× Luck", meta: "Permanent — better odds on weapons & traits; 1-in-2 items drop off the table (knife, dash)" },
    { mult: 3, cost: 20, label: "3× Luck", meta: "Permanent — odds ÷3 (1-in-50 → 1-in-17) for weapons & traits" },
    { mult: 4, cost: 45, label: "4× Luck", meta: "Permanent — odds ÷4 (1-in-50 → 1-in-12) for weapons & traits" },
  ];

  const KILL_BONUS_TIERS = [
    { bonus: 1, cost: 10, label: "+1 Kill", meta: "Permanent — earn 2 kills per elimination (best tier only)" },
    { bonus: 2, cost: 25, label: "+2 Kills", meta: "Permanent — earn 3 kills per elimination" },
    { bonus: 3, cost: 50, label: "+3 Kills", meta: "Permanent — earn 4 kills per elimination" },
  ];

  function getPlayerName() {
    return (playerNameInput.value || "Player").trim().slice(0, 20) || "Player";
  }

  function getSettings() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_SETTINGS) || "{}") || {};
      const mult = typeof raw.rareRollAnimMult === "number" ? raw.rareRollAnimMult : 50;
      return {
        animationsEnabled: raw.animationsEnabled !== false,
        rareRollAnimMult: clamp(Math.round(mult), 10, 10000),
      };
    } catch {
      return { animationsEnabled: true, rareRollAnimMult: 50 };
    }
  }

  function saveSettings(partial) {
    const next = { ...getSettings(), ...partial };
    localStorage.setItem(LS_SETTINGS, JSON.stringify(next));
  }

  function syncSettingsUI() {
    const s = getSettings();
    if (settingAnimationsEl) settingAnimationsEl.checked = s.animationsEnabled;
    if (settingRareAnimMultEl) settingRareAnimMultEl.value = String(s.rareRollAnimMult);
  }

  function getWeaponRollRarity(weaponId) {
    const tier = WEAPON_ROLL_TIERS.find((t) => t[0] === weaponId);
    return tier ? tier[1] : null;
  }

  function getRareRollAnimThreshold() {
    return getLuckMultiplier() * getSettings().rareRollAnimMult;
  }

  function shouldPlaySpecialRollAnim(weaponId) {
    if (!getSettings().animationsEnabled) return false;
    if (!WEAPON_SPECIAL_ROLL_ANIM[weaponId]) return false;
    const oneInN = getWeaponRollRarity(weaponId);
    if (!oneInN) return false;
    return oneInN >= getRareRollAnimThreshold();
  }

  function setRollInvuln(active) {
    rollAnimInvuln = !!active;
    if (localPlayer) localPlayer.rollInvuln = !!active;
    if (mode === "guest") sendToHost({ type: "rollInvuln", active: !!active });
  }

  function openSettingsModal() {
    if (isMultiplayerMatch() && !isLocalPlayerAlive()) {
      setGameStatus("You died — spectating only.", "error");
      return;
    }
    syncSettingsUI();
    if (redeemStatusEl) {
      redeemStatusEl.textContent = "";
      redeemStatusEl.className = "status";
    }
    if (redeemCodeEl) redeemCodeEl.value = "";
    settingsModalEl.classList.remove("hidden");
    settingsModalEl.setAttribute("aria-hidden", "false");
    if (settingAnimationsEl) settingAnimationsEl.focus();
  }

  function closeSettingsModal() {
    settingsModalEl.classList.add("hidden");
    settingsModalEl.setAttribute("aria-hidden", "true");
  }

  function setRedeemStatus(msg, type) {
    if (!redeemStatusEl) return;
    redeemStatusEl.textContent = msg || "";
    redeemStatusEl.className = "status" + (type ? " " + type : "");
  }

  function redeemCode() {
    const code = (redeemCodeEl?.value || "").trim();
    if (code !== REDEEM_TOS_CODE) {
      setRedeemStatus("Invalid code.", "error");
      return;
    }
    if (!profile) profile = getDefaultProfile();
    ensureWeaponInInventory("tos_rpg");
    persistProfile();
    setEquipped("tos_rpg");
    setRedeemStatus("Unlocked: Terms of Service Launcher", "success");
    setGameStatus("Unlocked: Terms of Service Launcher", "success");
    renderWeaponsModal();
  }

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function setGameStatus(msg, type) {
    if (!gameStatusEl) return;
    gameStatusEl.textContent = msg || "";
    gameStatusEl.style.color =
      type === "success" ? "#2ecc71" : type === "error" ? "#e74c3c" : "#f39c12";
  }

  function setGameStatus(msg, type) {
    if (!gameStatusEl) return;
    gameStatusEl.textContent = msg || "";
    gameStatusEl.style.color =
      type === "success" ? "#2ecc71" : type === "error" ? "#e74c3c" : "#f39c12";
  }

  function refreshMultiplayerButtons(busy) {
    const blockMp = testMode || is3cOnCooldown();
    if (btnJoin) btnJoin.disabled = busy || blockMp;
    if (btnCreate) btnCreate.disabled = busy || blockMp;
  }

  function load3cCooldown() {
    try {
      const until = parseInt(localStorage.getItem(LS_3C_COOLDOWN) || "0", 10);
      sessionCooldownUntil = until > Date.now() ? until : 0;
      if (!sessionCooldownUntil) localStorage.removeItem(LS_3C_COOLDOWN);
    } catch {
      sessionCooldownUntil = 0;
    }
    refreshMultiplayerButtons(false);
  }

  function is3cOnCooldown() {
    return sessionCooldownUntil > Date.now();
  }

  function get3cCooldownRemainingMs() {
    return Math.max(0, sessionCooldownUntil - Date.now());
  }

  function format3cCooldown(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function get3cCooldownMessage() {
    return `You use too much 3C, rest for ${format3cCooldown(get3cCooldownRemainingMs())}.`;
  }

  function apply3cCooldown(until) {
    sessionCooldownUntil = until;
    try {
      localStorage.setItem(LS_3C_COOLDOWN, String(until));
    } catch (_) {}
    refreshMultiplayerButtons(false);
  }

  function clear3cCooldownIfExpired() {
    if (sessionCooldownUntil && sessionCooldownUntil <= Date.now()) {
      sessionCooldownUntil = 0;
      try {
        localStorage.removeItem(LS_3C_COOLDOWN);
      } catch (_) {}
      refreshMultiplayerButtons(false);
    }
  }

  function setBusy(busy) {
    btnSolo.disabled = busy;
    refreshMultiplayerButtons(busy);
    btnWeapons.disabled = busy;
  }

  function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function now() {
    return performance.now();
  }

  function isTypingInField() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    return el.isContentEditable === true;
  }

  function isGameScreenActive() {
    return gameEl.classList.contains("active");
  }

  function clearMovementKeys() {
    keys["w"] = false;
    keys["a"] = false;
    keys["s"] = false;
    keys["d"] = false;
    keys["arrowup"] = false;
    keys["arrowdown"] = false;
    keys["arrowleft"] = false;
    keys["arrowright"] = false;
  }

  function weaponDefs() {
    return {
      knife: {
        id: "knife",
        name: "Knife",
        meta: "Close range • 10 dmg • 0.5s cd • 1/2",
      },
      bow: {
        id: "bow",
        name: "Bow",
        meta: "Arrow • 8 dmg • 1.0s cd • ~1/3",
      },
      dagger: {
        id: "dagger",
        name: "Dagger",
        meta: "Short: melee • Long: throw • 7 dmg • ~1/9",
      },
      rpg: {
        id: "rpg",
        name: "RPG",
        meta: "Rocket • 25 dmg • infinite range • 2.0s cd • 1/35",
      },
      scythe: {
        id: "scythe",
        name: "Basic Scythe",
        meta: "Melee • 10 dmg • 1.5× knife range • 0.3s cd • 1/55",
      },
      laser_launcher: {
        id: "laser_launcher",
        name: "Laser Launcher",
        meta: "Cursor beam 1s • 5 dmg / 0.3s • 1/90",
      },
      reinforced_bow: {
        id: "reinforced_bow",
        name: "Reinforced Bow",
        meta: "Arrow 1.3× speed • 20 dmg • 1.0s cd • 1/140",
      },
      katana: {
        id: "katana",
        name: "Katana",
        meta: "Melee • 10 dmg • 2× knife range • 0.3s cd • 1/160",
      },
      poison_potion: {
        id: "poison_potion",
        name: "Poison Potion",
        meta: "Throw 3× scythe range • poison AOE 5 dmg/s for 10s • 12s cd • 1/195",
      },
      healing_potion: {
        id: "healing_potion",
        name: "Healing Potion",
        meta: "Throw 3× scythe range • AOE heals 30 HP on landing • 10s cd • 1/200",
      },
      shot_bow: {
        id: "shot_bow",
        name: "Shot-Bow",
        meta: "3 arrows side-by-side • 14 dmg each • 3.0s cd • 1/240",
      },
      magma_scythe: {
        id: "magma_scythe",
        name: "Magma Scythe",
        meta: "Melee • 10 dmg • burn 4♥/s for 2s • 0.8s cd • 1/300",
      },
      tos_rpg: {
        id: "tos_rpg",
        name: "Terms of Service Launcher",
        meta: "Circle projectile • 35 dmg • 2.0s cd (redeem only)",
      },
    };
  }

  function getLuckMultiplier() {
    if (!profile) return 1;
    const mult = profile.luckMultiplier || 1;
    return Math.max(1, Math.min(4, mult));
  }

  /** Luck >= N means 1-in-N would become 1-in-1 or better — item leaves the loot table. */
  function isLuckExcludedFromTable(oneInN) {
    return getLuckMultiplier() >= oneInN;
  }

  /** 1-in-N odds with luck: 2× turns 1/50 into 1/25. Returns 0 if excluded (≥1/1). */
  function luckChance(oneInN) {
    if (isLuckExcludedFromTable(oneInN)) return 0;
    return getLuckMultiplier() / oneInN;
  }

  const WEAPON_ROLL_TIERS = [
    ["knife", 2],
    ["rpg", 35],
    ["scythe", 55],
    ["laser_launcher", 90],
    ["reinforced_bow", 140],
    ["katana", 160],
    ["poison_potion", 195],
    ["healing_potion", 200],
    ["shot_bow", 240],
    ["magma_scythe", 300],
  ];

  const TRAIT_ROLL_TIERS = [
    ["teleport_jump", 50],
    ["dash", 2],
    ["speedy", 6],
    ["transparency", 22],
  ];

  const TRAIT_REST_WEIGHTS = [
    ["dash", 315],
    ["speedy", 70],
    ["transparency", 18],
  ];

  function rollFromTiers(tiers, restWeights) {
    const r = Math.random();
    let cut = 0;
    for (const [id, oneInN] of tiers) {
      const chance = luckChance(oneInN);
      if (chance <= 0) continue;
      cut += chance;
      if (r < cut) return id;
    }
    const pool = restWeights.filter(([id]) => {
      const tier = tiers.find((t) => t[0] === id);
      return tier && !isLuckExcludedFromTable(tier[1]);
    });
    if (pool.length === 0) return restWeights[0][0];
    const totalW = pool.reduce((s, [, w]) => s + w, 0);
    let pick = Math.random() * totalW;
    for (const [id, w] of pool) {
      pick -= w;
      if (pick <= 0) return id;
    }
    return pool[pool.length - 1][0];
  }

  function rollWeaponId() {
    const r = Math.random();
    let cut = 0;
    for (const [id, oneInN] of WEAPON_ROLL_TIERS) {
      const chance = luckChance(oneInN);
      if (chance <= 0) continue;
      cut += chance;
      if (r < cut) return id;
    }
    const rest = 1 - cut;
    const inRest = rest > 0 ? (r - cut) / rest : 0;
    return inRest < 0.75 ? "bow" : "dagger";
  }

  function rollWeaponIdForRoll() {
    if (testMode && testModeNextRollWeapon) {
      const picked = testModeNextRollWeapon;
      testModeNextRollWeapon = null;
      renderWeaponsModal();
      return picked;
    }
    return rollWeaponId();
  }

  function setTestModeRollWeaponPick(weaponId) {
    if (!testMode) return;
    const defs = weaponDefs();
    if (!defs[weaponId]) return;
    testModeNextRollWeapon = weaponId;
    renderWeaponsModal();
    setGameStatus("Roll weapon selected.", "success");
    setStatus(`Roll weapon selected: ${defs[weaponId].name}`, "success");
  }

  function rollTraitId() {
    return rollFromTiers(TRAIT_ROLL_TIERS, TRAIT_REST_WEIGHTS);
  }

  function loadAccounts() {
    try {
      return JSON.parse(localStorage.getItem(LS_ACCOUNTS) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveAccounts(obj) {
    localStorage.setItem(LS_ACCOUNTS, JSON.stringify(obj));
  }

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function normalizeUser(u) {
    return (u || "").trim().slice(0, 20);
  }

  function isV4v5v6User() {
    const account = normalizeUser(currentUser).toLowerCase();
    const player = getPlayerName().toLowerCase();
    return account === "v4v5v6" || player === "v4v5v6";
  }

  function hasInstantTraitUnlock() {
    return testMode || isV4v5v6User() || testerTraitUnlock;
  }

  function loadTesterPrefs() {
    try {
      testerCodeRevealed = localStorage.getItem(LS_TESTER_CODE) === "1";
      testerTraitUnlock = localStorage.getItem(LS_TESTER_TRAIT) === "1";
    } catch {
      testerCodeRevealed = false;
      testerTraitUnlock = false;
    }
  }

  function saveTesterTraitUnlock(on) {
    testerTraitUnlock = !!on;
    try {
      if (testerTraitUnlock) localStorage.setItem(LS_TESTER_TRAIT, "1");
      else localStorage.removeItem(LS_TESTER_TRAIT);
    } catch (_) {}
    renderWeaponsModal();
  }

  function revealTesterSwitch() {
    if (!testerSwitchRowEl) return;
    testerCodeRevealed = true;
    try {
      localStorage.setItem(LS_TESTER_CODE, "1");
    } catch (_) {}
    testerSwitchRowEl.classList.remove("hidden");
    if (testerTraitSwitchEl) testerTraitSwitchEl.checked = testerTraitUnlock;
  }

  function checkSelfMenuCode() {
    const code = (selfMenuCodeEl?.value || "").trim().toLowerCase();
    if (code === TESTER_CODE) revealTesterSwitch();
  }

  function openSelfMenu() {
    if (!selfMenuEl || !localPlayer) return;
    closePlayerMenu();
    if (selfMenuTitleEl) {
      selfMenuTitleEl.textContent = `P${localPlayer.slot + 1}: ${localPlayer.name}`;
    }
    if (selfMenuCodeEl) selfMenuCodeEl.value = "";
    if (testerSwitchRowEl) {
      testerSwitchRowEl.classList.toggle("hidden", !testerCodeRevealed);
    }
    if (testerTraitSwitchEl) testerTraitSwitchEl.checked = testerTraitUnlock;
    selfMenuEl.classList.remove("hidden");
    selfMenuEl.setAttribute("aria-hidden", "false");
    if (selfMenuCodeEl) selfMenuCodeEl.focus();
  }

  function closeSelfMenu() {
    if (!selfMenuEl) return;
    selfMenuEl.classList.add("hidden");
    selfMenuEl.setAttribute("aria-hidden", "true");
    if (selfMenuCodeEl) selfMenuCodeEl.value = "";
  }

  function cloneProfile(prof) {
    return migrateProfile(JSON.parse(JSON.stringify(prof || getDefaultProfile())));
  }

  function buildTestProfile() {
    return migrateProfile({
      inventory: Object.keys(weaponDefs()),
      equipped: null,
      kills: 999,
      trait: null,
      traitInventory: Object.keys(traitDefs()),
      equippedTrait: null,
      luckMultiplier: 4,
      killBonus: 3,
      traitRollUnlocked: true,
    });
  }

  function persistProfile() {
    if (testMode || !currentUser || !profile) return;
    saveProfileFor(currentUser, profile);
  }

  function enterTestMode() {
    if (!currentUser) {
      setStatus("Log in first, then click Test Account.", "error");
      return;
    }
    if (testMode) return;
    profileSnapshot = cloneProfile(profile);
    testMode = true;
    profile = buildTestProfile();
    renderAccountUI();
    renderWeaponsModal();
    refreshMultiplayerButtons(false);
    setStatus("Test mode on — all weapons & traits unlocked. Solo only; nothing saves.", "success");
  }

  function exitTestMode() {
    if (!testMode) return;
    testMode = false;
    testModeNextRollWeapon = null;
    profile = profileSnapshot
      ? cloneProfile(profileSnapshot)
      : currentUser
        ? loadProfileFor(currentUser)
        : getDefaultProfile();
    profileSnapshot = null;
    renderAccountUI();
    renderWeaponsModal();
    refreshMultiplayerButtons(false);
    setStatus("Test mode off — your real account progress is restored.", "success");
  }

  function markTraitRollUnlockedIfEligible() {
    if (!profile || testMode) return;
    if (profile.traitRollUnlocked) return;
    if (getKillCount() >= 5 || hasInstantTraitUnlock()) {
      profile.traitRollUnlocked = true;
      persistProfile();
    }
  }

  function spendKills(amount) {
    if (!profile) profile = getDefaultProfile();
    markTraitRollUnlockedIfEligible();
    const current = getKillCount();
    if (current < amount) return false;
    const newKills = current - amount;
    profile.kills = newKills;
    if (localPlayer) {
      localPlayer.kills = newKills;
      if (mode === "host") {
        broadcast({ type: "kills", id: localPlayer.id, kills: newKills });
      } else if (mode === "guest") {
        sendToHost({ type: "kills", kills: newKills });
      }
    }
    persistProfile();
    return true;
  }

  function buyLuckUpgrade(targetMult) {
    if (!profile) profile = getDefaultProfile();
    if (testMode) {
      setLuckStatus("Luck purchases don't save in test mode.", "error");
      return;
    }
    const tier = LUCK_TIERS.find((t) => t.mult === targetMult);
    if (!tier) return;
    const current = getLuckMultiplier();
    if (current >= targetMult) {
      setLuckStatus(`You already have ${current}× luck.`, "error");
      return;
    }
    const nextTier = LUCK_TIERS.find((t) => t.mult > current);
    if (!nextTier || nextTier.mult !== targetMult) {
      setLuckStatus("Buy luck in order: 2×, then 3×, then 4×.", "error");
      return;
    }
    if (!spendKills(tier.cost)) {
      setLuckStatus(`Need ${tier.cost} kills (you have ${getKillCount()}).`, "error");
      return;
    }
    profile.luckMultiplier = targetMult;
    persistProfile();
    renderWeaponsModal();
    setLuckStatus(`Permanent ${targetMult}× luck unlocked!`, "success");
    setGameStatus(`Permanent luck boost: ${targetMult}×`, "success");
  }

  function getKillBonus() {
    if (!profile) return 0;
    const bonus = profile.killBonus || 0;
    return Math.max(0, Math.min(3, bonus));
  }

  function getKillBonusForPlayer(player) {
    if (!player) return 0;
    if (localPlayer && player.id === localPlayer.id && profile) return getKillBonus();
    return typeof player.killBonus === "number" ? Math.max(0, Math.min(3, player.killBonus)) : 0;
  }

  function killsPerElimination(player) {
    return 1 + getKillBonusForPlayer(player);
  }

  function syncKillBonusToMatch() {
    const bonus = getKillBonus();
    if (localPlayer) localPlayer.killBonus = bonus;
    if (mode === "guest") sendToHost({ type: "killBonus", killBonus: bonus });
  }

  function buyKillBonusUpgrade(targetBonus) {
    if (!profile) profile = getDefaultProfile();
    if (testMode) {
      setLuckStatus("Kill bonus purchases don't save in test mode.", "error");
      return;
    }
    const tier = KILL_BONUS_TIERS.find((t) => t.bonus === targetBonus);
    if (!tier) return;
    const current = getKillBonus();
    if (current >= targetBonus) {
      setLuckStatus(`You already have +${current} kill bonus.`, "error");
      return;
    }
    const nextTier = KILL_BONUS_TIERS.find((t) => t.bonus > current);
    if (!nextTier || nextTier.bonus !== targetBonus) {
      setLuckStatus("Buy kill bonus in order: +1, then +2, then +3.", "error");
      return;
    }
    if (!spendKills(tier.cost)) {
      setLuckStatus(`Need ${tier.cost} kills (you have ${getKillCount()}).`, "error");
      return;
    }
    profile.killBonus = targetBonus;
    persistProfile();
    syncKillBonusToMatch();
    renderWeaponsModal();
    setLuckStatus(`Permanent +${targetBonus} kill bonus unlocked!`, "success");
    setGameStatus(`Kill bonus: +${targetBonus} per elimination`, "success");
  }

  function setLuckStatus(msg, type) {
    if (!luckStatusEl) return;
    luckStatusEl.textContent = msg || "";
    luckStatusEl.className = "status" + (type ? " " + type : "");
  }

  function setInventoryTab(tab) {
    inventoryTab = tab === "upgrades" ? "upgrades" : "weapons";
    if (tabWeaponsEl) tabWeaponsEl.classList.toggle("active", inventoryTab === "weapons");
    if (tabLuckEl) tabLuckEl.classList.toggle("active", inventoryTab === "upgrades");
    if (panelWeaponsEl) panelWeaponsEl.classList.toggle("hidden", inventoryTab !== "weapons");
    if (panelLuckEl) panelLuckEl.classList.toggle("hidden", inventoryTab !== "upgrades");
    if (inventoryTab === "upgrades") {
      clearMovementKeys();
      renderUpgradesPanel();
    }
  }

  function isInventoryModalOpen() {
    return weaponsModalEl && !weaponsModalEl.classList.contains("hidden");
  }

  function getKillCount() {
    const fromPlayer = localPlayer && typeof localPlayer.kills === "number" ? localPlayer.kills : 0;
    const fromProfile = profile && typeof profile.kills === "number" ? profile.kills : 0;
    return Math.max(fromPlayer, fromProfile);
  }

  function canRollTrait() {
    if (hasInstantTraitUnlock()) return true;
    if (profile?.traitRollUnlocked) return true;
    return getKillCount() >= 5;
  }

  function getDefaultProfile() {
    return {
      inventory: [],
      equipped: null,
      kills: 0,
      trait: null,
      traitInventory: [],
      equippedTrait: null,
      luckMultiplier: 1,
      killBonus: 0,
      traitRollUnlocked: false,
    };
  }

  function migrateProfile(prof) {
    if (!prof) return getDefaultProfile();
    if (!Array.isArray(prof.traitInventory)) prof.traitInventory = [];
    if (prof.trait && !prof.traitInventory.includes(prof.trait)) {
      prof.traitInventory.push(prof.trait);
    }
    if (!prof.equippedTrait && prof.trait) prof.equippedTrait = prof.trait;
    if (typeof prof.luckMultiplier !== "number") prof.luckMultiplier = 1;
    if (typeof prof.killBonus !== "number") prof.killBonus = 0;
    if (typeof prof.traitRollUnlocked !== "boolean") {
      prof.traitRollUnlocked = getKillCountFromProfile(prof) >= 5;
    }
    return prof;
  }

  function getKillCountFromProfile(prof) {
    return prof && typeof prof.kills === "number" ? prof.kills : 0;
  }

  function loadProfileFor(user) {
    const accounts = loadAccounts();
    const acc = accounts[user];
    if (acc && acc.profile) return migrateProfile(acc.profile);
    return getDefaultProfile();
  }

  function saveProfileFor(user, prof) {
    const accounts = loadAccounts();
    if (!accounts[user]) return;
    accounts[user].profile = prof;
    saveAccounts(accounts);
  }

  function setCurrentUser(user) {
    if (testMode) {
      testMode = false;
      profileSnapshot = null;
    }
    currentUser = user || null;
    if (currentUser) localStorage.setItem(LS_CURRENT, currentUser);
    else localStorage.removeItem(LS_CURRENT);
    profile = migrateProfile(currentUser ? loadProfileFor(currentUser) : getDefaultProfile());
    renderAccountUI();
    renderWeaponsModal();
    refreshMultiplayerButtons(false);
  }

  function renderAccountUI() {
    if (!accountLoggedOutEl) return;
    if (currentUser) {
      accountLoggedOutEl.classList.add("hidden");
      accountLoggedInEl.classList.remove("hidden");
      accWhoEl.textContent = currentUser + (testMode ? " (test)" : "");
      if (testModeBannerEl) testModeBannerEl.classList.toggle("hidden", !testMode);
      if (btnAccTest) btnAccTest.classList.toggle("hidden", testMode);
      if (btnAccExitTest) btnAccExitTest.classList.toggle("hidden", !testMode);
    } else {
      accountLoggedOutEl.classList.remove("hidden");
      accountLoggedInEl.classList.add("hidden");
      accWhoEl.textContent = "";
      if (testModeBannerEl) testModeBannerEl.classList.add("hidden");
      if (btnAccTest) btnAccTest.classList.remove("hidden");
      if (btnAccExitTest) btnAccExitTest.classList.add("hidden");
    }
  }

  function ensureWeaponInInventory(id) {
    if (!profile) profile = getDefaultProfile();
    if (!profile.inventory.includes(id)) profile.inventory.push(id);
  }

  function setEquipped(id) {
    if (!canUseWeapons()) {
      setGameStatus("Equip only during rolling or fighting.", "error");
      return;
    }
    if (!profile) profile = getDefaultProfile();
    profile.equipped = id;
    persistProfile();
    if (localPlayer) {
      localPlayer.weapon = id;
      if (mode === "host") {
        broadcast({ type: "equip", id: localPlayer.id, weapon: id });
      } else if (mode === "guest") {
        sendToHost({ type: "equip", weapon: id });
      }
    }
    renderBackpack();
  }

  function loadRoomBans() {
    try {
      return JSON.parse(localStorage.getItem(LS_ROOM_BANS) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveRoomBans(obj) {
    localStorage.setItem(LS_ROOM_BANS, JSON.stringify(obj));
  }

  function isAccountBanned(room, username) {
    if (!room || !username) return false;
    const bans = loadRoomBans();
    const list = bans[room];
    return Array.isArray(list) ? list.includes(username) : false;
  }

  function banAccount(room, username) {
    if (!room || !username) return;
    const bans = loadRoomBans();
    const list = Array.isArray(bans[room]) ? bans[room] : [];
    if (!list.includes(username)) list.push(username);
    bans[room] = list;
    saveRoomBans(bans);
  }

  function traitDefs() {
    return {
      dash: { id: "dash", name: "Dash", meta: "Press Q to dash a short distance • 1/2" },
      speedy: { id: "speedy", name: "Speedy", meta: "1.2× movement speed • 1/6" },
      transparency: { id: "transparency", name: "Transparency", meta: "20% less visible • 1/22" },
      teleport_jump: {
        id: "teleport_jump",
        name: "Teleport Jump",
        meta: "Right-click to teleport • 20s cd • 1/50",
      },
    };
  }

  function ensureTraitInInventory(id) {
    if (!profile) profile = getDefaultProfile();
    if (!profile.traitInventory.includes(id)) profile.traitInventory.push(id);
  }

  function getEquippedTrait() {
    return localPlayer?.trait || profile?.equippedTrait || profile?.trait || null;
  }

  function setEquippedTrait(id) {
    if (!canUseWeapons()) {
      setGameStatus("Equip traits only during rolling or fighting.", "error");
      return;
    }
    if (!profile) profile = getDefaultProfile();
    profile.equippedTrait = id;
    profile.trait = id;
    persistProfile();
    if (localPlayer) {
      localPlayer.trait = id;
      if (mode === "host") {
        broadcast({ type: "trait", id: localPlayer.id, trait: id });
      } else if (mode === "guest") {
        sendToHost({ type: "trait", trait: id });
      }
    }
    renderWeaponsModal();
  }

  function movementMultiplierForTrait(trait) {
    return trait === "speedy" ? 1.2 : 1;
  }

  function alphaForTrait(trait) {
    return trait === "transparency" ? 0.8 : 1;
  }

  function isMultiplayerMatch() {
    return mode === "host" || mode === "guest";
  }

  function isLocalPlayerAlive() {
    return localPlayer && (typeof localPlayer.hp !== "number" || localPlayer.hp > 0);
  }

  function isPlayerAlive(p) {
    return p && (typeof p.hp !== "number" || p.hp > 0);
  }

  function resetMatchState() {
    matchPhase = "lobby";
    phaseEndsAt = 0;
    roomLocked = false;
    winnerId = null;
    roomGameNumber = 0;
    nextGameVotes = new Set();
    hasVotedNext = false;
    if (slainFeedEl) {
      slainFeedEl.innerHTML = "";
      slainFeedEl.classList.add("hidden");
    }
    hideWinOverlay();
    updateMatchUI();
  }

  function getMatchStatePayload() {
    return {
      phase: matchPhase,
      phaseEndsAt,
      roomLocked,
      winnerId,
      votes: Array.from(nextGameVotes),
      roomGameNumber,
      sessionCooldownUntil,
    };
  }

  let fightPopupTimer = null;

  function showFightPhasePopup() {
    if (!fightPhaseOverlayEl) return;
    fightPhaseOverlayEl.classList.remove("hidden");
    fightPhaseOverlayEl.setAttribute("aria-hidden", "false");
    if (fightPopupTimer) clearTimeout(fightPopupTimer);
    fightPopupTimer = setTimeout(() => {
      fightPopupTimer = null;
      fightPhaseOverlayEl.classList.add("hidden");
      fightPhaseOverlayEl.setAttribute("aria-hidden", "true");
    }, 1000);
  }

  function onEnterFightPhase() {
    showFightPhasePopup();
    if (rollOverlayEl && !rollOverlayEl.classList.contains("hidden")) {
      hideRollOverlay();
    }
    setRollInvuln(false);
    clearMovementKeys();
  }

  function applyMatchState(ms) {
    if (!ms) return;
    const prevPhase = matchPhase;
    matchPhase = ms.phase || "lobby";
    phaseEndsAt = ms.phaseEndsAt || 0;
    roomLocked = !!ms.roomLocked;
    winnerId = ms.winnerId || null;
    if (typeof ms.roomGameNumber === "number") roomGameNumber = ms.roomGameNumber;
    if (typeof ms.sessionCooldownUntil === "number" && ms.sessionCooldownUntil > Date.now()) {
      apply3cCooldown(ms.sessionCooldownUntil);
    }
    nextGameVotes = new Set(ms.votes || []);
    hasVotedNext = localPlayer ? nextGameVotes.has(localPlayer.id) : false;
    if (prevPhase !== "fighting" && matchPhase === "fighting") {
      onEnterFightPhase();
    }
    updateMatchUI();
    syncLoadoutToHostIfAllowed();
  }

  function syncLoadoutToHostIfAllowed() {
    if (!localPlayer || !profile) return;
    if (matchPhase !== "rolling" && matchPhase !== "fighting") return;
    if (!isLocalPlayerAlive()) return;
    if (profile.equipped && localPlayer.weapon !== profile.equipped) {
      setEquipped(profile.equipped);
    }
    const tr = getEquippedTrait();
    if (tr && localPlayer.trait !== tr) setEquippedTrait(tr);
  }

  function broadcastMatchState() {
    if (mode !== "host") return;
    broadcast({ type: "matchState", ...getMatchStatePayload() });
    updateMatchUI();
  }

  function addSlainLine(text) {
    if (!slainFeedEl) return;
    slainFeedEl.classList.remove("hidden");
    const line = document.createElement("div");
    line.className = "slain-line";
    line.textContent = text;
    slainFeedEl.appendChild(line);
    while (slainFeedEl.children.length > 6) {
      slainFeedEl.removeChild(slainFeedEl.firstChild);
    }
  }

  function showWinOverlay() {
    const winner = winnerId ? players.get(winnerId) : null;
    const name = winner ? winner.name : "Unknown";
    winMessageEl.innerHTML = `<strong>${escapeHtml(name)}</strong> wins!`;
    winOverlayEl.classList.remove("hidden");
    winOverlayEl.setAttribute("aria-hidden", "false");
    updateVoteStatusUI();
  }

  function hideWinOverlay() {
    winOverlayEl.classList.add("hidden");
    winOverlayEl.setAttribute("aria-hidden", "true");
    if (voteStatusEl) voteStatusEl.textContent = "";
  }

  function updateVoteStatusUI() {
    clear3cCooldownIfExpired();
    if (!voteStatusEl) return;
    if (is3cOnCooldown()) {
      voteStatusEl.textContent = get3cCooldownMessage();
      if (voteHelpTextEl) voteHelpTextEl.textContent = "Take a 5 minute break before playing again.";
      if (btnVoteNext) btnVoteNext.disabled = true;
      return;
    }
    if (matchPhase !== "ended") return;
    const total = allPlayers().length;
    const votes = nextGameVotes.size;
    const gameLabel =
      roomGameNumber > 0 ? `Game ${roomGameNumber}/${MAX_GAMES_IN_ROW} · ` : "";
    voteStatusEl.textContent = `${gameLabel}Votes: ${votes} / ${total} (all must vote yes)`;
    if (voteHelpTextEl) {
      if (roomGameNumber >= MAX_GAMES_IN_ROW) {
        voteHelpTextEl.textContent =
          "This was the last game in this streak. Voting yes starts a 5 minute rest.";
      } else {
        voteHelpTextEl.textContent = "Vote to play the next game (everyone must vote yes).";
      }
    }
    if (btnVoteNext) btnVoteNext.disabled = hasVotedNext;
  }

  function updateMatchUI() {
    if (btnStartGame) {
      const showStart = isP1() && matchPhase === "lobby" && isMultiplayerMatch();
      btnStartGame.classList.toggle("hidden", !showStart);
    }

    if (matchPhase === "ended") {
      showWinOverlay();
    } else {
      hideWinOverlay();
    }

    if (matchPhase === "lobby" && isMultiplayerMatch()) {
      setGameStatus("Waiting for host to start…", "");
    } else if (matchPhase === "rolling") {
      const left = Math.max(0, Math.ceil((phaseEndsAt - now()) / 1000));
      const gn = roomGameNumber > 0 ? `Game ${roomGameNumber}/${MAX_GAMES_IN_ROW} · ` : "";
      setGameStatus(`${gn}Rolling phase: ${left}s (roll only, no attacks)`, "");
    } else if (matchPhase === "fighting") {
      setGameStatus("Fight!", "success");
    } else if (!isLocalPlayerAlive() && isMultiplayerMatch()) {
      setGameStatus("You died — spectating", "error");
    }

    updateVoteStatusUI();
  }

  function canRoll() {
    if (!isMultiplayerMatch()) return true;
    if (!isLocalPlayerAlive()) return false;
    return matchPhase === "rolling" || matchPhase === "fighting";
  }

  function canUseWeapons() {
    if (!isMultiplayerMatch()) return true;
    if (!isLocalPlayerAlive()) return false;
    return matchPhase === "rolling" || matchPhase === "fighting";
  }

  function canAttackNow() {
    if (!localPlayer) return false;
    if (!isMultiplayerMatch()) return mode === "solo" || mode === "host" || mode === "guest";
    if (!isLocalPlayerAlive()) return false;
    return matchPhase === "fighting";
  }

  function countAlivePlayers() {
    return allPlayers().filter((p) => isPlayerAlive(p)).length;
  }

  function hostStartGame() {
    if (mode !== "host" || !isP1()) return;
    if (is3cOnCooldown()) {
      setGameStatus(get3cCooldownMessage(), "error");
      return;
    }
    roomGameNumber = 1;
    matchPhase = "rolling";
    roomLocked = true;
    phaseEndsAt = now() + ROLLING_MS;
    winnerId = null;
    nextGameVotes = new Set();
    hasVotedNext = false;
    projectiles = [];
    activeLasers = [];
    for (const p of allPlayers()) {
      p.hp = MAX_HP;
      clearPlayerEffects(p);
      broadcast({ type: "hp", id: p.id, hp: p.hp });
    }
    broadcastMatchState();
    setGameStatus("Game started — 20s rolling phase", "success");
  }

  function hostTickMatchPhase() {
    if (mode !== "host") return;
    if (matchPhase === "rolling" && now() >= phaseEndsAt) {
      matchPhase = "fighting";
      phaseEndsAt = 0;
      onEnterFightPhase();
      broadcastMatchState();
    }
  }

  function hostCheckWinner() {
    if (mode !== "host" || matchPhase !== "fighting") return;
    if (countAlivePlayers() <= 1) {
      const alive = allPlayers().find((p) => isPlayerAlive(p));
      winnerId = alive ? alive.id : null;
      matchPhase = "ended";
      phaseEndsAt = 0;
      nextGameVotes = new Set();
      hasVotedNext = false;
      broadcastMatchState();
    }
  }

  function hostTrigger3cCooldown() {
    const until = Date.now() + COOLDOWN_3C_MS;
    apply3cCooldown(until);
    matchPhase = "ended";
    nextGameVotes = new Set();
    hasVotedNext = false;
    broadcast({ type: "sessionCooldown", until });
    broadcastMatchState();
    updateMatchUI();
    setGameStatus("You use too much 3C, rest for 5 minutes.", "error");
  }

  function hostResetForNextGame() {
    if (mode !== "host") return;
    if (is3cOnCooldown()) return;
    const nextGame = roomGameNumber + 1;
    if (nextGame > MAX_GAMES_IN_ROW) {
      hostTrigger3cCooldown();
      return;
    }
    roomGameNumber = nextGame;
    matchPhase = "rolling";
    phaseEndsAt = now() + ROLLING_MS;
    winnerId = null;
    nextGameVotes = new Set();
    hasVotedNext = false;
    projectiles = [];
    activeLasers = [];
    for (const p of allPlayers()) {
      p.hp = MAX_HP;
      clearPlayerEffects(p);
      p.x = 120 + p.slot * 40;
      p.y = WORLD_H / 2;
    }
    broadcast({ type: "matchReset", players: allPlayers(), match: getMatchStatePayload() });
    broadcastMatchState();
    if (slainFeedEl) {
      slainFeedEl.innerHTML = "";
      slainFeedEl.classList.add("hidden");
    }
    hideWinOverlay();
  }

  function hostSlain(victimId, attackerId) {
    const victim = players.get(victimId);
    const killer = players.get(attackerId);
    if (!victim || !killer) return;
    const text = `${victim.name} Was slain by ${killer.name}`;
    broadcast({ type: "slain", text });
    addSlainLine(text);
    hostCheckWinner();
  }

  const PEER_HOSTS = [
    { host: "0.peerjs.com", port: 443, secure: true },
    { host: "0.peerjs.com", port: 443, secure: true },
    { host: "0.peerjs.com", port: 443, secure: true },
  ];

  function peerOptions(overrides) {
    const base = {
      key: "peerjs",
      host: "0.peerjs.com",
      port: IS_HTTPS ? 443 : 80,
      path: "/",
      secure: IS_HTTPS,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
      debug: 0,
    };
    return { ...base, ...(overrides || {}) };
  }

  function on(el, type, fn) {
    if (el) el.addEventListener(type, fn);
  }

  async function openPeerInstance(peerId, hostIndex) {
    const hostCfg = PEER_HOSTS[hostIndex] || PEER_HOSTS[0];
    const opts = peerOptions({
      host: hostCfg.host,
      port: hostCfg.port,
      secure: hostCfg.secure,
    });
    const p = peerId ? new Peer(peerId, opts) : new Peer(opts);
    await waitForPeerOpen(p, 28000);
    return p;
  }

  async function connectPeer(peerId) {
    if (typeof Peer === "undefined") {
      throw new Error(
        "Multiplayer library did not load. Refresh the page or check if a blocker stopped PeerJS."
      );
    }
    let lastErr = null;
    for (let i = 0; i < PEER_HOSTS.length; i++) {
      let p = null;
      try {
        p = await openPeerInstance(peerId, i);
        return p;
      } catch (e) {
        lastErr = e;
        if (p) {
          try {
            p.destroy();
          } catch (_) {}
        }
        await new Promise((r) => setTimeout(r, 600));
      }
    }
    throw (
      lastErr ||
      new Error("Could not reach the PeerJS server. Try again in a minute or use Solo mode.")
    );
  }

  function initMultiplayerAvailability() {
    if (typeof Peer !== "undefined") return;
    setStatus(
      "PeerJS failed to load — Solo still works. Disable ad blockers or refresh; multiplayer needs the PeerJS script.",
      "error"
    );
    if (btnCreate) btnCreate.disabled = true;
    if (btnJoin) btnJoin.disabled = true;
  }

  function roomPeerId(code) {
    return "bg-" + code;
  }

  function shareLinkForCode(code) {
    const url = new URL(window.location.href);
    url.searchParams.set("join", code);
    return url.toString();
  }

  function showShareBox(code) {
    shareUrlInput.value = shareLinkForCode(code);
    shareBoxEl.classList.remove("hidden");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied!", "success");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Select the text and copy manually.", "error");
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function isP1() {
    return localPlayer && localPlayer.slot === 0 && mode === "host";
  }

  function buildKickMessage(hostName, reason) {
    const r = (reason || "").trim();
    if (r) {
      return `You have been kicked from the game by ${hostName} Due to ${r}`;
    }
    return `You have been kicked from the game by ${hostName}`;
  }

  function showKickedOverlay(hostName, reason) {
    const safeName = escapeHtml(hostName || "P1");
    const r = (reason || "").trim();
    if (r) {
      kickedMessageEl.innerHTML =
        `You have been kicked from the game by <span class="host-name">${safeName}</span> Due to ${escapeHtml(r)}`;
    } else {
      kickedMessageEl.innerHTML =
        `You have been kicked from the game by <span class="host-name">${safeName}</span>`;
    }
    kickedOverlayEl.classList.remove("hidden");
    kickedOverlayEl.setAttribute("aria-hidden", "false");
  }

  function hideKickedOverlay() {
    kickedOverlayEl.classList.add("hidden");
    kickedOverlayEl.setAttribute("aria-hidden", "true");
    kickedMessageEl.textContent = "";
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cancelAdminHold() {
    if (adminHoldTimer) {
      clearTimeout(adminHoldTimer);
      adminHoldTimer = null;
    }
    adminHoldPos = null;
    adminHoldCanvasPos = null;
  }

  function openPlayerMenu(player) {
    if (!playerMenuEl || !isP1() || player.slot === 0) return;
    closeSelfMenu();
    menuTargetPlayer = player;
    if (playerMenuTitleEl) {
      playerMenuTitleEl.textContent = `P${player.slot + 1}: ${player.name}`;
    }
    if (kickReasonInput) kickReasonInput.value = "";
    playerMenuEl.classList.remove("hidden");
    playerMenuEl.setAttribute("aria-hidden", "false");
    if (kickReasonInput) kickReasonInput.focus();
  }

  function closePlayerMenu() {
    menuTargetPlayer = null;
    playerMenuEl.classList.add("hidden");
    playerMenuEl.setAttribute("aria-hidden", "true");
    kickReasonInput.value = "";
  }

  function isBlockingModalOpen() {
    if (kickedOverlayEl && !kickedOverlayEl.classList.contains("hidden")) return true;
    if (winOverlayEl && !winOverlayEl.classList.contains("hidden")) return true;
    if (playerMenuEl && !playerMenuEl.classList.contains("hidden")) return true;
    if (selfMenuEl && !selfMenuEl.classList.contains("hidden")) return true;
    if (weaponsModalEl && !weaponsModalEl.classList.contains("hidden")) return true;
    if (settingsModalEl && !settingsModalEl.classList.contains("hidden")) return true;
    if (rollOverlayEl && !rollOverlayEl.classList.contains("hidden")) return true;
    return false;
  }

  function kickPlayer(playerId, reason) {
    const conn = peerToConn.get(playerId);
    if (!conn || !localPlayer) return;

    const hostName = localPlayer.name;
    const kickReason = (reason || "").trim().slice(0, 80);

    try {
      conn.send({
        type: "kicked",
        hostName,
        reason: kickReason,
      });
    } catch (_) {}

    players.delete(playerId);
    broadcast({ type: "playerLeft", id: playerId });
    guestConns = guestConns.filter((c) => c !== conn);
    peerToConn.delete(playerId);

    try {
      conn.close();
    } catch (_) {}

    closePlayerMenu();
  }

  function getCanvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  const INTERACT_RADIUS = 72;

  function getPlayerForInteraction(id) {
    if (!id) return null;
    return players.get(id) || (localPlayer?.id === id ? localPlayer : null);
  }

  function hitTestPlayerForInteraction(px, py, p) {
    if (!p) return false;
    const half = PLAYER_SIZE / 2 + 12;
    if (px >= p.x - half && px <= p.x + half && py >= p.y - half && py <= p.y + half) {
      return true;
    }
    const labelY = p.y - half - 10;
    if (px >= p.x - 70 && px <= p.x + 70 && py >= labelY - 24 && py <= labelY + 10) {
      return true;
    }
    return Math.hypot(px - p.x, py - p.y) <= INTERACT_RADIUS;
  }

  function findNearestPlayerForInteraction(px, py) {
    let best = null;
    let bestD = INTERACT_RADIUS;
    for (const p of allPlayers()) {
      const d = Math.hypot(p.x - px, p.y - py);
      if (d <= bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }

  function hitTestPlayer(px, py, p) {
    const half = PLAYER_SIZE / 2;
    if (
      px >= p.x - half &&
      px <= p.x + half &&
      py >= p.y - half &&
      py <= p.y + half
    ) {
      return true;
    }
    const labelY = p.y - half - 10;
    if (
      px >= p.x - 55 &&
      px <= p.x + 55 &&
      py >= labelY - 18 &&
      py <= labelY + 6
    ) {
      return true;
    }
    return false;
  }

  function isClickOnLocalPlayer(px, py) {
    const me = getPlayerForInteraction(localPlayer?.id);
    return !!(me && hitTestPlayerForInteraction(px, py, me));
  }

  function findOtherPlayerAt(px, py) {
    const sorted = allPlayers().sort((a, b) => b.slot - a.slot);
    for (const p of sorted) {
      if (p.id === localPlayer?.id) continue;
      if (hitTestPlayerForInteraction(px, py, p)) return p;
    }
    return null;
  }

  function tryOpenPlayerInteractionAt(px, py) {
    closeWeaponsModal();
    closeSettingsModal();

    if (isClickOnLocalPlayer(px, py)) {
      openSelfMenu();
      return true;
    }

    const other = findOtherPlayerAt(px, py);
    if (other && isP1()) {
      openPlayerMenu(other);
      return true;
    }

    const nearest = findNearestPlayerForInteraction(px, py);
    if (!nearest) {
      setGameStatus("Click closer to a player to interact.", "error");
      return false;
    }
    if (nearest.id === localPlayer?.id) {
      openSelfMenu();
      return true;
    }
    if (isP1()) {
      openPlayerMenu(nearest);
      return true;
    }
    setGameStatus("Only P1 can manage other players.", "error");
    return false;
  }

  function interactAtAim() {
    if (!isGameScreenActive() || !localPlayer || isBlockingModalOpen()) return;
    tryOpenPlayerInteractionAt(lastAim.x, lastAim.y);
  }

  function setupPlayerInteraction() {
    if (!canvas) return;

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!isGameScreenActive() || !localPlayer || isBlockingModalOpen()) return;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      if (tryOpenPlayerInteractionAt(x, y)) return;
      if (getEquippedTrait() === "teleport_jump" && tryTeleportJump(x, y)) return;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isGameScreenActive()) return;
      lastAim = getCanvasCoords(e.clientX, e.clientY);
      if (
        adminHoldPos &&
        Math.hypot(e.clientX - adminHoldPos.x, e.clientY - adminHoldPos.y) > 18
      ) {
        cancelAdminHold();
      }
    });

    canvas.addEventListener("pointerdown", (e) => {
      if (isBlockingModalOpen()) return;
      if (!isGameScreenActive() || !localPlayer) return;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      lastAim = { x, y };
      clickDownAt = now();
      suppressNextAttack = false;

      if (e.button === 2) return;

      if (e.button === 0) {
        cancelAdminHold();
        adminHoldPos = { x: e.clientX, y: e.clientY };
        adminHoldCanvasPos = { x, y };
        adminHoldTimer = setTimeout(() => {
          adminHoldTimer = null;
          const c = adminHoldCanvasPos;
          adminHoldPos = null;
          adminHoldCanvasPos = null;
          if (!c) return;
          suppressNextAttack = true;
          tryOpenPlayerInteractionAt(c.x, c.y);
        }, 450);
      }
    });

    canvas.addEventListener("pointerup", (e) => {
      if (isBlockingModalOpen()) return;
      cancelAdminHold();
      if (suppressNextAttack) {
        suppressNextAttack = false;
        return;
      }
      if (!canAttack()) return;
      const weapon = getEquippedWeapon();
      if (!weapon) {
        setGameStatus("No weapon equipped. Roll one first.", "error");
        return;
      }
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      lastAim = { x, y };
      if (localPlayer) {
        const dx = x - localPlayer.x;
        const dy = y - localPlayer.y;
        const len = Math.hypot(dx, dy) || 1;
        localPlayer.dirX = dx / len;
        localPlayer.dirY = dy / len;
        if (mode === "host") {
          broadcast({ type: "face", id: localPlayer.id, dirX: localPlayer.dirX, dirY: localPlayer.dirY });
        } else if (mode === "guest") {
          sendToHost({ type: "face", dirX: localPlayer.dirX, dirY: localPlayer.dirY });
        }
      }
      const heldMs = now() - (clickDownAt || now());
      const isThrow =
        (weapon === "dagger" && heldMs >= 350) ||
        weapon === "poison_potion" ||
        weapon === "healing_potion";
      const cd = weaponCooldownMs(weapon, isThrow);
      if (now() < attackCooldownUntil) return;
      attackCooldownUntil = now() + cd;
      performAttack({ weapon, aimX: x, aimY: y, throw: isThrow });
    });

    canvas.addEventListener("pointercancel", cancelAdminHold);
  }

  function updateP1Cursor() {
    if (isP1() && mode !== "solo") {
      canvas.classList.add("p1-cursor");
    } else {
      canvas.classList.remove("p1-cursor");
    }
  }

  function destroyPeer() {
    closePlayerMenu();
    hideKickedOverlay();
    wasKicked = false;
    projectiles = [];
    activeLasers = [];
    lastLoopTime = 0;
    projSyncAccum = 0;
    peerToConn.clear();
    for (const c of guestConns) {
      try {
        c.close();
      } catch (_) {}
    }
    guestConns = [];
    if (hostConn) {
      try {
        hostConn.close();
      } catch (_) {}
      hostConn = null;
    }
    if (peer) {
      try {
        peer.destroy();
      } catch (_) {}
      peer = null;
    }
    myPeerId = null;
    resetMatchState();
  }

  function allPlayers() {
    return Array.from(players.values());
  }

  function nextSlot() {
    const used = new Set(allPlayers().map((p) => p.slot));
    for (let i = 0; i < MAX_PLAYERS; i++) {
      if (!used.has(i)) return i;
    }
    return -1;
  }

  function broadcast(msg, exceptConn) {
    for (const conn of guestConns) {
      if (conn !== exceptConn && conn.open) {
        conn.send(msg);
      }
    }
  }

  function sendToHost(msg) {
    if (hostConn && hostConn.open) hostConn.send(msg);
  }

  function applyState(list, selfId, match) {
    players.clear();
    for (const p of list) {
      players.set(p.id, { dirX: 1, dirY: 0, weapon: null, hp: MAX_HP, trait: null, kills: 0, killBonus: 0, user: null, ...p });
      if (p.id === selfId) localPlayer = players.get(p.id);
    }
    applyMatchState(match);
    updateP1Cursor();
  }

  function handleMessage(msg, fromConn) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case "state":
        applyState(msg.players, msg.youId, msg.match);
        break;
      case "matchState":
        applyMatchState(msg);
        break;
      case "matchReset":
        players.clear();
        for (const p of msg.players || []) {
          players.set(p.id, { dirX: 1, dirY: 0, weapon: null, hp: MAX_HP, trait: null, kills: 0, killBonus: 0, user: null, ...p });
          if (localPlayer && p.id === localPlayer.id) localPlayer = players.get(p.id);
        }
        applyMatchState(msg.match);
        projectiles = [];
        activeLasers = [];
        if (slainFeedEl) {
          slainFeedEl.innerHTML = "";
          slainFeedEl.classList.add("hidden");
        }
        hideWinOverlay();
        syncLoadoutToHostIfAllowed();
        break;
      case "sessionCooldown":
        if (typeof msg.until === "number") apply3cCooldown(msg.until);
        updateVoteStatusUI();
        break;
      case "laserStart":
        activeLasers.push({ ...msg.beam });
        break;
      case "laserAim":
        for (const L of activeLasers) {
          if (L.owner === msg.owner) {
            L.aimX = msg.aimX;
            L.aimY = msg.aimY;
          }
        }
        break;
      case "laserEnd":
        activeLasers = activeLasers.filter((L) => L.id !== msg.id);
        break;
      case "laserSync":
        activeLasers = (msg.list || []).map((b) => ({ ...b }));
        break;
      case "slain":
        addSlainLine(msg.text);
        break;
      case "playerJoined":
        players.set(msg.player.id, { ...msg.player });
        break;
      case "playerLeft":
        players.delete(msg.id);
        break;
      case "hp":
        if (players.has(msg.id)) players.get(msg.id).hp = msg.hp;
        break;
      case "playerEffect":
        if (players.has(msg.id)) {
          const p = players.get(msg.id);
          p.poison = msg.poison || null;
          p.burn = msg.burn || null;
        }
        break;
      case "equip":
        if (players.has(msg.id)) players.get(msg.id).weapon = msg.weapon;
        break;
      case "trait":
        if (players.has(msg.id)) players.get(msg.id).trait = msg.trait;
        break;
      case "kills":
        if (players.has(msg.id)) players.get(msg.id).kills = msg.kills;
        if (localPlayer && msg.id === localPlayer.id && profile) {
          profile.kills = msg.kills;
          markTraitRollUnlockedIfEligible();
          persistProfile();
          renderWeaponsModal();
        }
        break;
      case "face":
        if (players.has(msg.id)) {
          const p = players.get(msg.id);
          p.dirX = msg.dirX;
          p.dirY = msg.dirY;
        }
        break;
      case "move": {
        const p = players.get(msg.id);
        if (p) {
          p.x = msg.x;
          p.y = msg.y;
        }
        if (mode === "host" && fromConn) {
          broadcast(msg, fromConn);
        }
        break;
      }
      case "projSpawn":
        projectiles.push({ ...msg.p });
        break;
      case "projTick":
        // Host sends snapshot positions for smooth rendering on guests
        projectiles = msg.list.map((p) => ({
          ...p,
          ang: typeof p.ang === "number" ? p.ang : Math.atan2(p.vy, p.vx),
        }));
        break;
      case "projRemove":
        projectiles = projectiles.filter((p) => p.pid !== msg.pid);
        break;
      case "kicked":
        break;
    }
  }

  function onHostConnection(conn) {
    guestConns.push(conn);
    peerToConn.set(conn.peer, conn);

    conn.on("data", (data) => {
      if (data.type === "join") {
        if (roomLocked) {
          conn.send({ type: "error", message: "Game already started. You cannot join." });
          conn.close();
          return;
        }
        const guestUser = (data.user || "").trim();
        if (guestUser && isAccountBanned(roomCode, guestUser)) {
          conn.send({ type: "error", message: "You are banned from this room." });
          conn.close();
          return;
        }
        const slot = nextSlot();
        if (slot < 0) {
          conn.send({ type: "error", message: "Room is full." });
          conn.close();
          return;
        }
        const player = {
          id: conn.peer,
          name: (data.name || "Player").slice(0, 20),
          slot,
          x: 120 + slot * 40,
          y: WORLD_H / 2,
          color: PLAYER_COLORS[slot],
          hp: MAX_HP,
          weapon: null,
          trait: (data.trait || null),
          kills: typeof data.kills === "number" ? data.kills : 0,
          killBonus: typeof data.killBonus === "number" ? Math.max(0, Math.min(3, data.killBonus)) : 0,
          user: guestUser || null,
        };
        players.set(player.id, player);
        conn.send({
          type: "state",
          youId: player.id,
          players: allPlayers(),
          match: getMatchStatePayload(),
        });
        broadcast({ type: "playerJoined", player }, conn);
      } else if (data.type === "equip") {
        if (matchPhase !== "rolling" && matchPhase !== "fighting") return;
        const p = players.get(conn.peer);
        if (!p || !isPlayerAlive(p)) return;
        p.weapon = data.weapon || null;
        broadcast({ type: "equip", id: p.id, weapon: p.weapon }, conn);
      } else if (data.type === "attack") {
        if (matchPhase !== "fighting") return;
        const p = players.get(conn.peer);
        if (!p || !isPlayerAlive(p)) return;
        handleAttack(conn.peer, data);
      } else if (data.type === "teleport") {
        if (matchPhase !== "rolling" && matchPhase !== "fighting") return;
        const p = players.get(conn.peer);
        if (!p || !isPlayerAlive(p) || p.trait !== "teleport_jump") return;
        const t = now();
        if (typeof p.teleportCdUntil === "number" && t < p.teleportCdUntil) return;
        p.teleportCdUntil = t + TELEPORT_COOLDOWN_MS;
        const half = PLAYER_SIZE / 2;
        p.x = clamp(data.x, half, WORLD_W - half);
        p.y = clamp(data.y, half, WORLD_H - half);
        broadcast({ type: "move", id: p.id, x: p.x, y: p.y }, conn);
      } else if (data.type === "laserAim") {
        if (matchPhase !== "fighting") return;
        const p = players.get(conn.peer);
        if (!p || !isPlayerAlive(p)) return;
        for (const L of activeLasers) {
          if (L.owner === conn.peer) {
            L.aimX = clamp(data.aimX, 0, WORLD_W);
            L.aimY = clamp(data.aimY, 0, WORLD_H);
          }
        }
        broadcast(
          { type: "laserAim", owner: conn.peer, aimX: data.aimX, aimY: data.aimY },
          conn
        );
      } else if (data.type === "voteNext") {
        if (matchPhase !== "ended") return;
        nextGameVotes.add(conn.peer);
        broadcastMatchState();
        if (nextGameVotes.size >= allPlayers().length) {
          hostResetForNextGame();
        }
      } else if (data.type === "face") {
        const p = players.get(conn.peer);
        if (p) {
          p.dirX = data.dirX;
          p.dirY = data.dirY;
          broadcast({ type: "face", id: p.id, dirX: p.dirX, dirY: p.dirY }, conn);
        }
      } else if (data.type === "trait") {
        if (matchPhase !== "rolling" && matchPhase !== "fighting") return;
        const p = players.get(conn.peer);
        if (!p || !isPlayerAlive(p)) return;
        p.trait = data.trait || null;
        broadcast({ type: "trait", id: p.id, trait: p.trait }, conn);
      } else if (data.type === "rollInvuln") {
        const p = players.get(conn.peer);
        if (p) p.rollInvuln = !!data.active;
      } else if (data.type === "killBonus") {
        const p = players.get(conn.peer);
        if (p) {
          p.killBonus = typeof data.killBonus === "number" ? Math.max(0, Math.min(3, data.killBonus)) : 0;
        }
      } else if (data.type === "kills") {
        const p = players.get(conn.peer);
        if (p) {
          p.kills = typeof data.kills === "number" ? data.kills : p.kills;
          broadcast({ type: "kills", id: p.id, kills: p.kills }, conn);
        }
      } else {
        handleMessage(data, conn);
      }
    });

    conn.on("close", () => {
      guestConns = guestConns.filter((c) => c !== conn);
      peerToConn.delete(conn.peer);
      if (players.has(conn.peer)) {
        players.delete(conn.peer);
        broadcast({ type: "playerLeft", id: conn.peer });
      }
      if (menuTargetPlayer && menuTargetPlayer.id === conn.peer) {
        closePlayerMenu();
      }
    });
  }

  function showMenu() {
    destroyPeer();
    closePlayerMenu();
    closeSelfMenu();
    canvas.classList.remove("p1-cursor");
    gameEl.classList.remove("active");
    menuEl.classList.add("active");
    gameShareHintEl.classList.add("hidden");
    btnCopyCode.classList.add("hidden");
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    players.clear();
    localPlayer = null;
    mode = null;
    roomCode = null;
    resetMatchState();
    setBusy(false);
  }

  function showGame(label) {
    menuEl.classList.remove("active");
    gameEl.classList.add("active");
    roomLabelEl.textContent = label;
    canvas.width = WORLD_W;
    canvas.height = WORLD_H;
    if (animId) cancelAnimationFrame(animId);
    lastLoopTime = 0;
    projSyncAccum = 0;
    animId = requestAnimationFrame(loop);
    updateP1Cursor();
  }

  function drawLandscape() {
    const w = canvas.width;
    const h = canvas.height;
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
    sky.addColorStop(0, "#87ceeb");
    sky.addColorStop(1, "#b8e0f0");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.55);
    ctx.fillStyle = "#3d7a37";
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.fillStyle = "#2d5a27";
    for (let i = 0; i < 8; i++) {
      const x = (i * 110 + 30) % w;
      ctx.beginPath();
      ctx.ellipse(x, h * 0.58, 50, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#5a4a3a";
    ctx.fillRect(0, h - 24, w, 24);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
  }

  function drawPlayer(p, isLocal) {
    ctx.save();
    let alpha = alphaForTrait(p.trait);
    if (p.rollInvuln) alpha = 0.4;
    if (!isPlayerAlive(p)) alpha = DEAD_ALPHA;
    ctx.globalAlpha = alpha;
    const half = PLAYER_SIZE / 2;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - half, p.y - half, PLAYER_SIZE, PLAYER_SIZE);
    if (isLocal) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - half, p.y - half, PLAYER_SIZE, PLAYER_SIZE);
    }
    const prefix = `P${p.slot + 1}: `;
    const label = prefix + p.name;
    ctx.font = "bold 12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    const tw = ctx.measureText(label).width;
    const pad = 4;
    const labelY = p.y - half - 10;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(p.x - tw / 2 - pad, labelY - 14, tw + pad * 2, 18);
    if (p.slot === 0) {
      const prefixW = ctx.measureText(prefix).width;
      const startX = p.x - tw / 2;
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      ctx.fillText(prefix, startX, labelY);
      ctx.fillStyle = "#e74c3c";
      ctx.fillText(p.name, startX + prefixW, labelY);
      ctx.textAlign = "center";
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillText(label, p.x, labelY);
    }

    // HP above name
    const hp = typeof p.hp === "number" ? p.hp : MAX_HP;
    const hpLabel = `HP: ${Math.max(0, Math.floor(hp))}`;
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    const htw = ctx.measureText(hpLabel).width;
    const hpY = labelY - 18;
    ctx.fillRect(p.x - htw / 2 - pad, hpY - 12, htw + pad * 2, 16);
    ctx.fillStyle = hp > 50 ? "#2ecc71" : hp > 20 ? "#f1c40f" : "#e74c3c";
    ctx.fillText(hpLabel, p.x, hpY);

    // Weapon in hand (simple sprite)
    const w = p.weapon;
    if (w) {
      const dx = typeof p.dirX === "number" ? p.dirX : 1;
      const dy = typeof p.dirY === "number" ? p.dirY : 0;
      const ang = Math.atan2(dy, dx);
      const handDist = half + 6;
      const hx = p.x + Math.cos(ang) * handDist;
      const hy = p.y + Math.sin(ang) * handDist;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(ang);
      if (w === "knife") {
        ctx.fillStyle = "#dcdcdc";
        ctx.fillRect(0, -2, 18, 4);
        ctx.fillStyle = "#8b5a2b";
        ctx.fillRect(-6, -3, 6, 6);
      } else if (w === "dagger") {
        ctx.fillStyle = "#c8b28a";
        ctx.fillRect(0, -2, 16, 4);
        ctx.fillStyle = "#a67c52";
        ctx.fillRect(-6, -3, 6, 6);
      } else if (w === "bow" || w === "reinforced_bow") {
        ctx.strokeStyle = w === "reinforced_bow" ? "#f39c12" : "#d1b36a";
        ctx.lineWidth = w === "reinforced_bow" ? 4 : 3;
        ctx.beginPath();
        ctx.arc(4, 0, 12, -1.1, 1.1);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-6, -10);
        ctx.lineTo(-6, 10);
        ctx.stroke();
      } else if (w === "scythe") {
        ctx.strokeStyle = "#95a5a6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(6, 0, 16, 0.4, Math.PI * 1.35);
        ctx.stroke();
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(-4, -2, 10, 4);
      } else if (w === "rpg" || w === "tos_rpg") {
        ctx.fillStyle = w === "rpg" ? "#e67e22" : "#9b59b6";
        ctx.fillRect(0, -5, 22, 10);
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(-8, -3, 8, 6);
      } else if (w === "laser_launcher") {
        ctx.fillStyle = "#3498db";
        ctx.fillRect(-4, -6, 14, 12);
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(8, -2, 6, 4);
      } else if (w === "katana") {
        ctx.fillStyle = "#ecf0f1";
        ctx.fillRect(0, -2, 24, 4);
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(-8, -4, 8, 8);
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(20, -3, 4, 6);
      } else if (w === "magma_scythe") {
        ctx.strokeStyle = "#e67e22";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(6, 0, 16, 0.4, Math.PI * 1.35);
        ctx.stroke();
        ctx.fillStyle = "#922b21";
        ctx.fillRect(-4, -2, 10, 4);
      } else if (w === "shot_bow") {
        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(4, 0, 12, -1.1, 1.1);
        ctx.stroke();
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(-8, -4, 6, 8);
      } else if (w === "poison_potion") {
        ctx.fillStyle = "rgba(45, 90, 39, 0.85)";
        ctx.beginPath();
        ctx.arc(0, 2, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a3d16";
        ctx.fillRect(-3, -10, 6, 8);
      } else if (w === "healing_potion") {
        ctx.fillStyle = "rgba(231, 76, 60, 0.9)";
        ctx.beginPath();
        ctx.arc(0, 2, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#922b21";
        ctx.fillRect(-3, -10, 6, 8);
      }
      ctx.restore();
    }
    drawStatusParticles(p);
    ctx.restore();
  }

  function drawStatusParticles(p) {
    if (!p) return;
    const t = now() / 1000;
    const poisonActive = p.poison && p.poison.rem > 0;
    const burnActive = p.burn && p.burn.rem > 0;
    if (!poisonActive && !burnActive) return;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const ang = t * 2.4 + i * ((Math.PI * 2) / count);
      const wobble = Math.sin(t * 4 + i * 1.7) * 5;
      const r = 16 + wobble + (i % 3);
      const px = p.x + Math.cos(ang) * r;
      const py = p.y + Math.sin(ang) * r - 8;
      if (poisonActive) {
        ctx.fillStyle = `rgba(${30 + (i % 20)}, ${70 + (i % 30)}, ${25 + (i % 15)}, ${0.55 + (i % 3) * 0.12})`;
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }
      if (burnActive) {
        ctx.fillStyle = `rgba(255, ${120 + (i % 40)}, ${20 + (i % 30)}, ${0.6 + (i % 2) * 0.15})`;
        ctx.beginPath();
        ctx.arc(px - 4, py - 6, 2 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function sendMove(x, y) {
    if (!localPlayer) return;
    const msg = { type: "move", id: localPlayer.id, x, y };
    if (mode === "solo") return;
    if (mode === "host") broadcast(msg);
    else sendToHost(msg);
  }

  function tryTeleportJump(tx, ty) {
    if (!localPlayer || getEquippedTrait() !== "teleport_jump") return false;
    if (isMultiplayerMatch() && !isLocalPlayerAlive()) return false;
    if (
      isMultiplayerMatch() &&
      matchPhase !== "rolling" &&
      matchPhase !== "fighting"
    ) {
      setGameStatus("Teleport only during rolling or fighting.", "error");
      return false;
    }
    const t = now();
    if (t < teleportCooldownUntil) {
      const left = Math.ceil((teleportCooldownUntil - t) / 1000);
      setGameStatus(`Teleport cooldown: ${left}s`, "error");
      return false;
    }
    const half = PLAYER_SIZE / 2;
    const nx = clamp(tx, half, WORLD_W - half);
    const ny = clamp(ty, half, WORLD_H - half);
    teleportCooldownUntil = t + TELEPORT_COOLDOWN_MS;
    localPlayer.teleportCdUntil = teleportCooldownUntil;

    localPlayer.x = nx;
    localPlayer.y = ny;
    if (mode === "guest") {
      sendToHost({ type: "teleport", x: nx, y: ny });
    } else {
      sendMove(nx, ny);
    }
    setGameStatus("Teleport!", "success");
    return true;
  }

  function tickCombatSim(dt) {
    if (mode !== "host" && mode !== "solo") return;
    stepProjectiles(dt);
    stepLasers(dt);
    stepStatusEffects(dt);
    updateLocalLaserAim();
    if (mode === "host") {
      if (projectiles.length > 0) {
        projSyncAccum += dt;
        if (projSyncAccum >= 0.05) {
          projSyncAccum = 0;
          broadcastProjTick();
        }
      }
      if (activeLasers.length > 0) {
        broadcastLaserSync();
      }
    }
  }

  function drawActiveLasers() {
    for (const L of activeLasers) {
      const owner = players.get(L.owner);
      if (!owner) continue;
      ctx.strokeStyle = "rgba(52, 152, 219, 0.85)";
      ctx.lineWidth = LASER_BEAM_WIDTH;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(owner.x, owner.y);
      ctx.lineTo(L.aimX, L.aimY);
      ctx.stroke();
    }
  }

  function tickMatchSystems() {
    clear3cCooldownIfExpired();
    if (mode === "host") hostTickMatchPhase();
    const t = now();
    if (
      isMultiplayerMatch() &&
      (matchPhase === "rolling" || matchPhase === "ended" || is3cOnCooldown()) &&
      t - lastMatchUiTick > 250
    ) {
      lastMatchUiTick = t;
      updateMatchUI();
    }
  }

  function update() {
    tickMatchSystems();

    const t = now();
    let dt = 0;
    if (lastLoopTime > 0) {
      dt = Math.min(0.05, (t - lastLoopTime) / 1000);
    }
    lastLoopTime = t;
    if (dt > 0) tickCombatSim(dt);
    if (dt > 0 && mode === "guest") tickStatusVisuals(dt);

    if (!localPlayer) return;
    if (isInventoryModalOpen()) return;
    if (isMultiplayerMatch() && !isLocalPlayerAlive()) return;
    let dx = 0;
    let dy = 0;
    const mult = movementMultiplierForTrait(getEquippedTrait());
    if (keys["w"] || keys["arrowup"]) dy -= SPEED * mult;
    if (keys["s"] || keys["arrowdown"]) dy += SPEED * mult;
    if (keys["a"] || keys["arrowleft"]) dx -= SPEED * mult;
    if (keys["d"] || keys["arrowright"]) dx += SPEED * mult;
    if (!dx && !dy) return;
    const half = PLAYER_SIZE / 2;
    const nx = clamp(localPlayer.x + dx, half, WORLD_W - half);
    const ny = clamp(localPlayer.y + dy, half, WORLD_H - half);
    if (nx === localPlayer.x && ny === localPlayer.y) return;
    localPlayer.x = nx;
    localPlayer.y = ny;
    sendMove(nx, ny);
  }

  function render() {
    drawLandscape();
    drawActiveLasers();
    // projectiles
    for (const pr of projectiles) {
      if (pr.kind === "arrow") {
        const ang = typeof pr.ang === "number" ? pr.ang : Math.atan2(pr.vy, pr.vx);
        ctx.save();
        ctx.translate(pr.x, pr.y);
        ctx.rotate(ang);
        // arrow shaft
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(-14, -2, 22, 4);
        // arrow head
        ctx.fillStyle = "#eaeaea";
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(2, -6);
        ctx.lineTo(2, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (pr.kind === "dagger") {
        const ang = typeof pr.ang === "number" ? pr.ang : Math.atan2(pr.vy, pr.vx);
        ctx.save();
        ctx.translate(pr.x, pr.y);
        ctx.rotate(ang);
        ctx.fillStyle = "#c8b28a";
        ctx.fillRect(-10, -3, 18, 6);
        ctx.fillStyle = "#a67c52";
        ctx.fillRect(-14, -4, 5, 8);
        ctx.restore();
      } else if (pr.kind === "poison_potion" || pr.kind === "healing_potion") {
        ctx.fillStyle = pr.color || (pr.kind === "poison_potion" ? "#2d5a27" : "#e74c3c");
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r || 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pr.kind === "poison_potion" ? "#1a3d16" : "#922b21";
        ctx.fillRect(pr.x - 3, pr.y - 12, 6, 8);
      } else {
        ctx.fillStyle = pr.color || "#fff";
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r || 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const sorted = allPlayers().sort((a, b) => a.slot - b.slot);
    for (const p of sorted) {
      if (p.id !== localPlayer?.id) drawPlayer(p, false);
    }
    if (localPlayer) drawPlayer(localPlayer, true);
  }

  function loop() {
    update();
    render();
    animId = requestAnimationFrame(loop);
  }

  function startSolo() {
    destroyPeer();
    mode = "solo";
    localPlayer = {
      id: "solo",
      name: getPlayerName(),
      slot: 0,
      x: WORLD_W / 2,
      y: WORLD_H / 2,
      color: PLAYER_COLORS[0],
      hp: MAX_HP,
      weapon: profile?.equipped || null,
      trait: getEquippedTrait(),
      kills: profile?.kills || 0,
      killBonus: getKillBonus(),
      user: currentUser || null,
    };
    players.clear();
    players.set(localPlayer.id, localPlayer);
    showGame(testMode ? "Solo — Test Mode (unsaved)" : "Solo Test");
    setStatus("");
  }

  function waitForPeerOpen(p, timeoutMs) {
    return new Promise((resolve, reject) => {
      if (p.destroyed) {
        reject(new Error("Connection failed."));
        return;
      }
      if (p.open) {
        resolve(p.id);
        return;
      }
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Connection timed out. Try again."));
      }, timeoutMs);
      const onOpen = (id) => {
        cleanup();
        resolve(id);
      };
      const onError = (err) => {
        cleanup();
        if (err && err.type === "unavailable-id") {
          reject(new Error("Code in use — try Create again."));
        } else if (err && err.type === "network") {
          reject(new Error("Network blocked. If you're on GitHub Pages, ensure you use HTTPS and try again."));
        } else {
          reject(new Error("Could not connect."));
        }
      };
      function cleanup() {
        clearTimeout(timer);
        p.off("open", onOpen);
        p.off("error", onError);
      }
      p.on("open", onOpen);
      p.on("error", onError);
    });
  }

  function waitForConnOpen(conn, timeoutMs) {
    return new Promise((resolve, reject) => {
      if (conn.open) {
        resolve();
        return;
      }
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Could not reach the host. Check the room code."));
      }, timeoutMs);
      conn.on("open", () => {
        cleanup();
        resolve();
      });
      conn.on("error", () => {
        cleanup();
        reject(new Error("Connection failed."));
      });
      function cleanup() {
        clearTimeout(timer);
      }
    });
  }

  async function createRoom(attempt) {
    if (testMode) {
      throw new Error("Test mode is solo only. Exit test mode to create a room.");
    }
    if (is3cOnCooldown()) {
      throw new Error(get3cCooldownMessage());
    }
    if (attempt > 8) {
      throw new Error("Could not create a room. Try again.");
    }
    const code = generateCode();
    const p = await connectPeer(roomPeerId(code));

    try {
      peer = p;
      myPeerId = p.id;
      roomCode = code;
      mode = "host";

      localPlayer = {
        id: myPeerId,
        name: getPlayerName(),
        slot: 0,
        x: 120,
        y: WORLD_H / 2,
        color: PLAYER_COLORS[0],
        hp: MAX_HP,
        weapon: profile?.equipped || null,
        trait: profile?.trait || null,
        kills: profile?.kills || 0,
        killBonus: getKillBonus(),
        user: currentUser || null,
      };
      players.clear();
      players.set(localPlayer.id, localPlayer);
      resetMatchState();

      p.on("connection", onHostConnection);
      p.on("error", (err) => {
        if (err && err.type === "network") {
          setStatus(
            IS_HTTPS
              ? "Network error — WebRTC/PeerJS might be blocked on this network."
              : "Network error — try using the GitHub Pages HTTPS link.",
            "error"
          );
        }
      });

      joinCodeInput.value = code;
      showShareBox(code);
      showGame(`Room: ${code}`);
      gameShareHintEl.textContent = `Share code ${code} or copy the invite link`;
      gameShareHintEl.classList.remove("hidden");
      btnCopyCode.classList.remove("hidden");
      btnCopyCode.onclick = () => copyText(code);
      setStatus("Room ready — waiting for players…", "success");
      updateP1Cursor();
    } catch (e) {
      p.destroy();
      if (e.message && e.message.includes("in use")) {
        return createRoom(attempt + 1);
      }
      throw e;
    }
  }

  async function joinRoom(code) {
    if (testMode) {
      throw new Error("Test mode is solo only. Exit test mode to join a room.");
    }
    if (is3cOnCooldown()) {
      throw new Error(get3cCooldownMessage());
    }
    destroyPeer();
    mode = "guest";
    roomCode = code;

    const p = await connectPeer();
    peer = p;
    myPeerId = p.id;

    const conn = p.connect(roomPeerId(code), { reliable: true });
    hostConn = conn;

    conn.on("data", (data) => {
      if (data.type === "kicked") {
        wasKicked = true;
        showKickedOverlay(data.hostName || "P1", data.reason);
        return;
      }
      if (data.type === "error") {
        setStatus(data.message, "error");
        return;
      }
      handleMessage(data, null);
    });

    conn.on("close", () => {
      if (wasKicked) return;
      setStatus("Host left the room.", "error");
      setTimeout(showMenu, 1500);
    });

    await waitForConnOpen(conn, 15000);
    conn.send({
      type: "join",
      name: getPlayerName(),
      user: currentUser || null,
      trait: profile?.trait || null,
      kills: profile?.kills || 0,
      killBonus: getKillBonus(),
    });

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("No response from host.")), 10000);
      const check = setInterval(() => {
        if (localPlayer) {
          clearInterval(check);
          clearTimeout(timer);
          resolve();
        }
      }, 50);
    });

    showGame(`Room: ${code}`);
    setStatus("Joined!", "success");
    const eqTrait = getEquippedTrait();
    if (eqTrait) sendToHost({ type: "trait", trait: eqTrait });
    if (typeof profile?.kills === "number") sendToHost({ type: "kills", kills: profile.kills });
    syncLoadoutToHostIfAllowed();
  }

  function voteNextGame() {
    if (matchPhase !== "ended" || hasVotedNext || !localPlayer) return;
    if (is3cOnCooldown()) {
      setGameStatus(get3cCooldownMessage(), "error");
      return;
    }
    hasVotedNext = true;
    if (mode === "host") {
      nextGameVotes.add(localPlayer.id);
      broadcastMatchState();
      if (nextGameVotes.size >= allPlayers().length) hostResetForNextGame();
    } else if (mode === "guest") {
      sendToHost({ type: "voteNext" });
    }
    updateVoteStatusUI();
  }

  function openWeaponsModal() {
    if (isMultiplayerMatch() && !isLocalPlayerAlive()) {
      setGameStatus("You died — spectating only.", "error");
      return;
    }
    if (!profile) profile = getDefaultProfile();
    clearMovementKeys();
    markTraitRollUnlockedIfEligible();
    setInventoryTab("weapons");
    renderWeaponsModal();
    weaponsModalEl.classList.remove("hidden");
    weaponsModalEl.setAttribute("aria-hidden", "false");
  }

  function closeWeaponsModal() {
    weaponsModalEl.classList.add("hidden");
    weaponsModalEl.setAttribute("aria-hidden", "true");
    clearMovementKeys();
    setLuckStatus("");
  }

  function renderBackpack() {
    if (!backpackListEl) return;
    const defs = weaponDefs();
    const inv = profile?.inventory || [];
    if (inv.length === 0) {
      backpackListEl.innerHTML = testMode
        ? `<p class="help-text">Test mode — right-click a weapon below to pick your next roll.</p>`
        : `<p class="help-text">No weapons yet. Click <strong>Roll Weapon</strong>.</p>`;
      return;
    }
    const pickHint =
      testMode
        ? `<p class="help-text">Test mode — right-click a weapon to pick your next roll.</p>`
        : "";
    const equipped = profile?.equipped || null;
    backpackListEl.innerHTML =
      pickHint +
      inv
      .map((id) => {
        const w = defs[id];
        const isEq = equipped === id;
        const isPick = testMode && testModeNextRollWeapon === id;
        const btn = isEq
          ? `<button type="button" class="btn btn-small btn-equipped" disabled>Equipped</button>`
          : `<button type="button" class="btn btn-small btn-equip" data-equip="${id}">Equip</button>`;
        return `<div class="bp-item${isPick ? " is-test-roll-pick" : ""}" data-weapon-id="${id}">
          <div class="bp-left">
            <div class="bp-name">${w ? w.name : id}${isPick ? " · next roll" : ""}</div>
            <div class="bp-meta">${w ? w.meta : ""}</div>
          </div>
          <div class="bp-actions">${btn}</div>
        </div>`;
      })
      .join("");
  }

  function renderWeaponsModal() {
    if (!profile) profile = getDefaultProfile();
    const kills = getKillCount();
    const t = getEquippedTrait();
    const tdefs = traitDefs();
    if (killsLabelEl) killsLabelEl.textContent = String(kills);
    if (traitLabelEl) traitLabelEl.textContent = t ? (tdefs[t]?.name || t) : "None";
    if (luckLabelEl) luckLabelEl.textContent = `${getLuckMultiplier()}×`;
    if (btnRollWeapon) btnRollWeapon.disabled = !canRoll();
    if (btnRollTrait) {
      btnRollTrait.disabled = !canRoll() || !canRollTrait();
      btnRollTrait.textContent = testMode
        ? "Roll Trait (test)"
        : hasInstantTraitUnlock() || profile?.traitRollUnlocked
          ? "Roll Trait (unlocked)"
          : "Roll Trait (5 kills)";
    }
    if (btnRollWeapon && testMode) btnRollWeapon.textContent = "Roll Weapon (test)";
    else if (btnRollWeapon) btnRollWeapon.textContent = "Roll Weapon";
    renderBackpack();
    renderTraitList();
    if (inventoryTab === "upgrades") renderUpgradesPanel();
  }

  function renderUpgradesPanel() {
    if (!luckListEl) return;
    if (!profile) profile = getDefaultProfile();
    const currentLuck = getLuckMultiplier();
    luckListEl.innerHTML = LUCK_TIERS.map((tier) => {
      const owned = currentLuck >= tier.mult;
      const isNext = !owned && LUCK_TIERS.find((t) => t.mult > currentLuck)?.mult === tier.mult;
      const kills = getKillCount();
      const canBuy = isNext && kills >= tier.cost && !testMode;
      let btn = "";
      if (owned) {
        btn = `<span class="luck-owned">Owned</span>`;
      } else if (isNext) {
        btn = `<button type="button" class="btn btn-small btn-equip" data-buy-luck="${tier.mult}" ${canBuy ? "" : "disabled"}>Buy (${tier.cost} kills)</button>`;
      } else {
        btn = `<button type="button" class="btn btn-small" disabled>Locked</button>`;
      }
      return `<div class="bp-item">
        <div class="bp-left">
          <div class="bp-name">${tier.label}</div>
          <div class="bp-meta">${tier.meta} · costs ${tier.cost} kills</div>
        </div>
        <div class="bp-actions">${btn}</div>
      </div>`;
    }).join("");

    if (killBonusListEl) {
      const currentBonus = getKillBonus();
      killBonusListEl.innerHTML = KILL_BONUS_TIERS.map((tier) => {
        const owned = currentBonus >= tier.bonus;
        const isNext = !owned && KILL_BONUS_TIERS.find((t) => t.bonus > currentBonus)?.bonus === tier.bonus;
        const kills = getKillCount();
        const canBuy = isNext && kills >= tier.cost && !testMode;
        let btn = "";
        if (owned) {
          btn = `<span class="luck-owned">Owned</span>`;
        } else if (isNext) {
          btn = `<button type="button" class="btn btn-small btn-equip" data-buy-kill-bonus="${tier.bonus}" ${canBuy ? "" : "disabled"}>Buy (${tier.cost} kills)</button>`;
        } else {
          btn = `<button type="button" class="btn btn-small" disabled>Locked</button>`;
        }
        return `<div class="bp-item">
          <div class="bp-left">
            <div class="bp-name">${tier.label}</div>
            <div class="bp-meta">${tier.meta} · costs ${tier.cost} kills</div>
          </div>
          <div class="bp-actions">${btn}</div>
        </div>`;
      }).join("");
    }

    const statusParts = [];
    const luck = getLuckMultiplier();
    if (luck > 1) {
      statusParts.push(`${luck}× luck on weapon & trait rolls`);
    }
    const bonus = getKillBonus();
    if (bonus > 0) {
      statusParts.push(`+${bonus} kill bonus (${1 + bonus} per elimination)`);
    }
    if (statusParts.length > 0) {
      setLuckStatus(`Active: ${statusParts.join(" · ")}. Only your best tier applies.`, "success");
    } else if (profile.traitRollUnlocked) {
      setLuckStatus("Trait roll is permanently unlocked on this account.", "success");
    } else {
      setLuckStatus("");
    }
  }

  function renderLuckPanel() {
    renderUpgradesPanel();
  }

  function renderTraitList() {
    if (!traitListEl) return;
    if (!profile) profile = getDefaultProfile();
    const inv = profile.traitInventory || [];
    const equipped = getEquippedTrait();
    const defs = traitDefs();
    if (inv.length === 0) {
      traitListEl.innerHTML = `<p class="help-text">No traits yet. Click <strong>Roll Trait</strong>.</p>`;
      return;
    }
    traitListEl.innerHTML = inv
      .map((id) => {
        const tr = defs[id];
        const isEq = equipped === id;
        const btn = isEq
          ? `<button type="button" class="btn btn-small btn-equipped" disabled>Equipped</button>`
          : `<button type="button" class="btn btn-small btn-equip" data-equip-trait="${id}">Equip</button>`;
        return `<div class="bp-item">
          <div class="bp-left">
            <div class="bp-name">${tr ? tr.name : id}</div>
            <div class="bp-meta">${tr ? tr.meta : ""}</div>
          </div>
          <div class="bp-actions">${btn}</div>
        </div>`;
      })
      .join("");
  }

  function weaponRollTheme(id) {
    const themes = {
      knife: { a: "#5d6d7e", b: "#2c3e50", border: "#bdc3c7", glow: "rgba(189, 195, 199, 0.8)" },
      bow: { a: "#6e4b2a", b: "#3d2817", border: "#d4a574", glow: "rgba(212, 165, 116, 0.85)" },
      dagger: { a: "#5c4a32", b: "#2e2418", border: "#c9b28a", glow: "rgba(201, 178, 138, 0.85)" },
      rpg: { a: "#a04000", b: "#5c2e00", border: "#e67e22", glow: "rgba(230, 126, 34, 0.9)" },
      scythe: { a: "#566573", b: "#1c2833", border: "#95a5a6", glow: "rgba(149, 165, 166, 0.85)" },
      laser_launcher: { a: "#1a5276", b: "#0b2f44", border: "#3498db", glow: "rgba(52, 152, 219, 0.9)" },
      reinforced_bow: { a: "#7d6608", b: "#423306", border: "#f39c12", glow: "rgba(243, 156, 18, 0.9)" },
      katana: { a: "#566573", b: "#2c3e50", border: "#ecf0f1", glow: "rgba(236, 240, 241, 0.9)" },
      poison_potion: { a: "#1e4620", b: "#0d2810", border: "#2ecc71", glow: "rgba(46, 204, 113, 0.85)" },
      healing_potion: { a: "#922b21", b: "#641e16", border: "#e74c3c", glow: "rgba(231, 76, 60, 0.9)" },
      shot_bow: { a: "#922b21", b: "#641e16", border: "#e74c3c", glow: "rgba(255, 140, 0, 0.9)" },
      magma_scythe: { a: "#d35400", b: "#7e2e00", border: "#f39c12", glow: "rgba(230, 126, 34, 0.95)" },
      tos_rpg: { a: "#6c3483", b: "#2e1a36", border: "#9b59b6", glow: "rgba(155, 89, 182, 0.9)" },
    };
    return themes[id] || themes.knife;
  }

  function traitRollTheme(id) {
    const themes = {
      dash: { a: "#2471a3", b: "#154360", border: "#5dade2", glow: "rgba(93, 173, 226, 0.9)" },
      speedy: { a: "#1e8449", b: "#0e6251", border: "#2ecc71", glow: "rgba(46, 204, 113, 0.9)" },
      transparency: { a: "#5b2c6f", b: "#2e1a36", border: "#bb8fce", glow: "rgba(187, 143, 206, 0.85)" },
      teleport_jump: { a: "#117a65", b: "#0b5345", border: "#1abc9c", glow: "rgba(26, 188, 156, 0.9)" },
    };
    return themes[id] || themes.dash;
  }

  function setRollButtonsDisabled(disabled) {
    if (btnRollWeapon) btnRollWeapon.disabled = disabled ? true : !canRoll();
    if (btnRollTrait) btnRollTrait.disabled = disabled ? true : !canRoll() || !canRollTrait();
  }

  function stopRollAnimation() {
    if (rollAnimTimer) {
      clearInterval(rollAnimTimer);
      clearTimeout(rollAnimTimer);
      rollAnimTimer = null;
    }
    setRollButtonsDisabled(false);
  }

  function setRollCardShape(kind) {
    const isTrait = kind === "trait";
    if (rollCardInnerEl) rollCardInnerEl.classList.toggle("is-trait-star", isTrait);
    const scene = rollOverlayEl?.querySelector(".roll-card-scene");
    if (scene) scene.classList.toggle("is-trait-star", isTrait);
  }

  function clearMagmaFireListener() {
    if (magmaFireTransitionHandler && rollMagmaFireEl) {
      rollMagmaFireEl.removeEventListener("transitionend", magmaFireTransitionHandler);
    }
    magmaFireTransitionHandler = null;
  }

  function clearMagmaTimers() {
    clearMagmaFireListener();
  }

  function hideMagmaFxInstant() {
    clearMagmaTimers();
    if (rollMagmaFxEl) {
      rollMagmaFxEl.classList.add("hidden");
      rollMagmaFxEl.setAttribute("aria-hidden", "true");
    }
  }

  function resetMagmaFx() {
    clearMagmaTimers();
    if (rollMagmaFxEl) {
      rollMagmaFxEl.classList.remove("is-active", "is-fire-grow");
      rollMagmaFxEl.classList.add("hidden");
      rollMagmaFxEl.setAttribute("aria-hidden", "true");
    }
    if (rollMagmaFireEl) rollMagmaFireEl.style.transform = "";
    const scene = rollOverlayEl?.querySelector(".roll-card-scene");
    if (scene) scene.classList.remove("is-hidden", "roll-pop-in-magma");
  }

  function runMagmaRevealSequence(finalId, finalDef, kind, onComplete) {
    const scene = rollOverlayEl?.querySelector(".roll-card-scene");
    if (rollRevealTextEl) rollRevealTextEl.classList.remove("is-visible");
    if (btnRollDone) btnRollDone.classList.add("hidden");
    if (scene) scene.classList.add("is-hidden");

    if (!rollMagmaFxEl) {
      revealRollCard(finalId, finalDef, kind);
      onComplete(finalId);
      return;
    }

    let finished = false;
    let fireGrowStarted = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearMagmaFireListener();
      const sceneEl = rollOverlayEl?.querySelector(".roll-card-scene");
      if (sceneEl) {
        sceneEl.classList.remove("is-hidden", "roll-pop-in", "roll-pop-in-magma");
        void sceneEl.offsetWidth;
        sceneEl.classList.add("roll-pop-in-magma");
      }
      hideMagmaFxInstant();
      revealRollCard(finalId, finalDef, kind, { fastPop: true });
      onComplete(finalId);
    };

    rollMagmaFxEl.classList.remove("hidden");
    rollMagmaFxEl.setAttribute("aria-hidden", "false");
    rollMagmaFxEl.classList.remove("is-fire-grow");
    if (rollMagmaFireEl) rollMagmaFireEl.style.transform = "";
    void rollMagmaFxEl.offsetWidth;
    rollMagmaFxEl.classList.add("is-active");

    magmaFireTransitionHandler = (e) => {
      if (!fireGrowStarted || e.target !== rollMagmaFireEl || e.propertyName !== "transform") return;
      if (e.elapsedTime < MAGMA_FIRE_GROW_MS * 0.85) return;
      finish();
    };

    setTimeout(() => {
      if (finished) return;
      fireGrowStarted = true;
      if (rollMagmaFireEl) {
        rollMagmaFireEl.addEventListener("transitionend", magmaFireTransitionHandler);
      }
      rollMagmaFxEl.classList.add("is-fire-grow");
    }, 180);

    setTimeout(finish, 180 + MAGMA_FIRE_GROW_MS + 200);
  }

  function hideRollOverlay() {
    stopRollAnimation();
    resetMagmaFx();
    setRollInvuln(false);
    if (!rollOverlayEl) return;
    rollOverlayEl.classList.add("hidden");
    rollOverlayEl.setAttribute("aria-hidden", "true");
    if (rollCardInnerEl) {
      rollCardInnerEl.classList.remove("is-shuffling", "is-revealed", "is-trait-star");
    }
    const scene = rollOverlayEl.querySelector(".roll-card-scene");
    if (scene) scene.classList.remove("is-trait-star");
    if (rollRevealTextEl) rollRevealTextEl.classList.remove("is-visible");
    if (btnRollDone) btnRollDone.classList.add("hidden");
    setRollButtonsDisabled(false);
  }

  function showRollOverlay(kind) {
    if (!rollOverlayEl || !rollCardInnerEl) return;
    stopRollAnimation();
    setRollCardShape(kind);
    if (rollRevealTextEl) {
      rollRevealTextEl.textContent = "";
      rollRevealTextEl.classList.remove("is-visible");
    }
    if (rollCardLabelEl) rollCardLabelEl.textContent = "Rolling…";
    if (rollFrontNameEl) rollFrontNameEl.textContent = "—";
    if (rollFrontMetaEl) rollFrontMetaEl.textContent = "";
    if (btnRollDone) btnRollDone.classList.add("hidden");
    rollCardInnerEl.classList.remove("is-revealed");
    rollCardInnerEl.classList.add("is-shuffling");
    const scene = rollOverlayEl.querySelector(".roll-card-scene");
    if (scene) {
      scene.classList.remove("roll-pop-in");
      void scene.offsetWidth;
      scene.classList.add("roll-pop-in");
    }
    rollOverlayEl.classList.remove("hidden");
    rollOverlayEl.setAttribute("aria-hidden", "false");
    setRollInvuln(true);
    setRollButtonsDisabled(true);
  }

  function setRollShufflePreview(id, def, kind) {
    const d = def || { name: id, meta: "" };
    if (rollFrontNameEl) rollFrontNameEl.textContent = d.name;
    if (rollFrontMetaEl) rollFrontMetaEl.textContent = d.meta || "";
    applyRollCardTheme(id, kind);
  }

  function applyRollCardTheme(id, kind) {
    if (!rollCardInnerEl) return;
    const t = kind === "trait" ? traitRollTheme(id) : weaponRollTheme(id);
    rollCardInnerEl.style.setProperty("--roll-front-a", t.a);
    rollCardInnerEl.style.setProperty("--roll-front-b", t.b);
    rollCardInnerEl.style.setProperty("--roll-border", t.border);
    rollCardInnerEl.style.setProperty("--roll-glow", t.glow);
  }

  function revealRollCard(finalId, def, kind, opts) {
    const d = def || { name: finalId, meta: "" };
    applyRollCardTheme(finalId, kind);
    if (rollCardLabelEl) {
      rollCardLabelEl.textContent = kind === "trait" ? "Trait unlocked" : "You got";
    }
    if (rollFrontNameEl) rollFrontNameEl.textContent = d.name;
    if (rollFrontMetaEl) rollFrontMetaEl.textContent = d.meta || "";
    if (rollCardInnerEl) {
      rollCardInnerEl.classList.remove("is-shuffling");
      void rollCardInnerEl.offsetWidth;
      rollCardInnerEl.classList.add("is-revealed");
      if (opts?.fastPop) {
        rollCardInnerEl.classList.remove("is-revealed");
        void rollCardInnerEl.offsetWidth;
        rollCardInnerEl.classList.add("is-revealed");
      }
    }
    if (rollRevealTextEl) {
      rollRevealTextEl.textContent = `You got ${d.name}!`;
      rollRevealTextEl.classList.add("is-visible");
    }
    if (btnRollDone) btnRollDone.classList.remove("hidden");
    setGameStatus(
      kind === "trait" ? `Rolled trait: ${d.name}` : `Rolled: ${d.name}`,
      "success"
    );
  }

  function runRollAnimation(opts) {
    const { shuffleOrder, getDef, rollFinal, onComplete, kind, rollingLabel } = opts;
    const finalId = rollFinal();
    const finalDef = getDef(finalId);

    if (!getSettings().animationsEnabled || !rollOverlayEl || !rollCardInnerEl) {
      onComplete(finalId);
      return;
    }
    if (rollAnimTimer) return;

    const playMagma =
      finalId === "magma_scythe" && shouldPlaySpecialRollAnim("magma_scythe");

    const shuffleMs = 2000;
    const magmaTriggerAt = now() + shuffleMs * 0.9;
    const shuffleEnd = now() + shuffleMs;

    showRollOverlay(kind);
    setGameStatus(rollingLabel || "Rolling…", "");

    let i = 0;
    rollAnimTimer = setInterval(() => {
      const id = shuffleOrder[i % shuffleOrder.length];
      i++;
      setRollShufflePreview(id, getDef(id), kind);

      if (playMagma && now() >= magmaTriggerAt) {
        clearInterval(rollAnimTimer);
        rollAnimTimer = null;
        runMagmaRevealSequence(finalId, finalDef, kind, onComplete);
        return;
      }

      if (now() >= shuffleEnd) {
        clearInterval(rollAnimTimer);
        rollAnimTimer = null;
        revealRollCard(finalId, finalDef, kind);
        onComplete(finalId);
      }
    }, 75);
  }

  function rollWeapon() {
    if (!canRoll()) {
      setGameStatus(
        isMultiplayerMatch()
          ? "Roll only after the host starts (rolling or fighting phase)."
          : "Cannot roll right now.",
        "error"
      );
      return;
    }
    const defs = weaponDefs();
    runRollAnimation({
      kind: "weapon",
      rollingLabel: "Rolling weapon…",
      shuffleOrder: [
        "knife",
        "bow",
        "dagger",
        "rpg",
        "scythe",
        "laser_launcher",
        "reinforced_bow",
        "katana",
        "poison_potion",
        "healing_potion",
        "shot_bow",
        "magma_scythe",
      ],
      getDef: (id) => defs[id] || { name: id, meta: "" },
      rollFinal: rollWeaponIdForRoll,
      onComplete: (finalId) => {
        ensureWeaponInInventory(finalId);
        if (!profile.equipped) profile.equipped = finalId;
        persistProfile();
        setEquipped(profile.equipped);
        renderWeaponsModal();
        showShareBox(roomCode || "");
      },
    });
  }

  function rollTrait() {
    if (!canRoll()) {
      setGameStatus("Roll traits only after the host starts the game.", "error");
      return;
    }
    if (!canRollTrait()) {
      setGameStatus("Need 5 kills to roll a trait.", "error");
      return;
    }
    const defs = traitDefs();
    runRollAnimation({
      kind: "trait",
      rollingLabel: "Rolling trait…",
      shuffleOrder: ["dash", "speedy", "transparency", "teleport_jump"],
      getDef: (id) => defs[id] || { name: id, meta: "" },
      rollFinal: rollTraitId,
      onComplete: (finalId) => {
        ensureTraitInInventory(finalId);
        if (!getEquippedTrait()) setEquippedTrait(finalId);
        else persistProfile();
        renderWeaponsModal();
      },
    });
  }

  function canAttack() {
    return canAttackNow();
  }

  function getEquippedWeapon() {
    return localPlayer?.weapon || profile?.equipped || null;
  }

  function weaponCooldownMs(weaponId, isThrow) {
    if (weaponId === "knife") return 500;
    if (weaponId === "scythe") return 300;
    if (weaponId === "katana") return 300;
    if (weaponId === "magma_scythe") return 800;
    if (weaponId === "bow") return 1000;
    if (weaponId === "reinforced_bow") return 1000;
    if (weaponId === "shot_bow") return 3000;
    if (weaponId === "dagger") return isThrow ? 1200 : 700;
    if (weaponId === "poison_potion") return 12000;
    if (weaponId === "healing_potion") return 10000;
    if (weaponId === "rpg") return 2000;
    if (weaponId === "laser_launcher") return 1500;
    if (weaponId === "tos_rpg") return 2000;
    return 600;
  }

  function meleeRange(weaponId) {
    if (weaponId === "knife") return 55;
    if (weaponId === "katana") return KATANA_RANGE;
    if (weaponId === "scythe" || weaponId === "magma_scythe") return SCYTHE_RANGE;
    if (weaponId === "dagger") return 50;
    return 0;
  }

  function damageOf(weaponId) {
    if (weaponId === "knife") return 10;
    if (weaponId === "katana") return 10;
    if (weaponId === "scythe" || weaponId === "magma_scythe") return 10;
    if (weaponId === "bow") return 8;
    if (weaponId === "reinforced_bow") return 20;
    if (weaponId === "shot_bow") return 14;
    if (weaponId === "dagger") return 7;
    if (weaponId === "rpg") return 25;
    if (weaponId === "tos_rpg") return 35;
    return 0;
  }

  function performAttack(payload) {
    if (!localPlayer || !canAttackNow()) return;
    if (mode === "solo" || mode === "host") {
      handleAttack(localPlayer.id, payload);
    } else if (mode === "guest") {
      sendToHost({ type: "attack", ...payload });
    }
  }

  function broadcastProjTick() {
    broadcast({
      type: "projTick",
      list: projectiles.map((p) => ({
        pid: p.pid,
        owner: p.owner,
        x: p.x,
        y: p.y,
        vx: p.vx,
        vy: p.vy,
        r: p.r,
        life: p.life,
        dmg: p.dmg,
        color: p.color,
        kind: p.kind,
        ang: p.ang,
      })),
    });
  }

  function spawnProjectile(p) {
    projectiles.push(p);
    if (mode === "host") {
      broadcast({ type: "projSpawn", p });
      if (guestConns.length > 0) broadcastProjTick();
    }
  }

  function removeProjectile(pid) {
    projectiles = projectiles.filter((p) => p.pid !== pid);
    if (mode === "host") broadcast({ type: "projRemove", pid });
  }

  function distPointToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-6) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = clamp(t, 0, 1);
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function broadcastLaserSync() {
    if (mode !== "host") return;
    broadcast({
      type: "laserSync",
      list: activeLasers.map((L) => ({
        id: L.id,
        owner: L.owner,
        aimX: L.aimX,
        aimY: L.aimY,
        remaining: L.remaining,
      })),
    });
  }

  function removeLaser(id) {
    activeLasers = activeLasers.filter((L) => L.id !== id);
    if (mode === "host") broadcast({ type: "laserEnd", id });
  }

  function startLaserBeam(ownerId, aimX, aimY) {
    const owner = players.get(ownerId);
    if (!owner) return;
    if (activeLasers.some((L) => L.owner === ownerId)) return;
    const beam = {
      id: `laser-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      owner: ownerId,
      aimX: clamp(aimX, 0, WORLD_W),
      aimY: clamp(aimY, 0, WORLD_H),
      remaining: LASER_DURATION_SEC,
      tickAcc: 0,
      dmg: LASER_DMG,
      tickInterval: LASER_TICK_SEC,
    };
    activeLasers.push(beam);
    if (mode === "host") broadcast({ type: "laserStart", beam });
  }

  function updateLocalLaserAim() {
    if (!localPlayer || !isLocalPlayerAlive()) return;
    let hasMine = false;
    for (const L of activeLasers) {
      if (L.owner !== localPlayer.id) continue;
      hasMine = true;
      L.aimX = lastAim.x;
      L.aimY = lastAim.y;
    }
    if (!hasMine) return;
    if (mode === "host") broadcast({ type: "laserAim", owner: localPlayer.id, aimX: lastAim.x, aimY: lastAim.y });
    else if (mode === "guest") sendToHost({ type: "laserAim", aimX: lastAim.x, aimY: lastAim.y });
  }

  function damagePlayersInBeam(ownerId, x1, y1, x2, y2, dmg) {
    const hitExtra = PLAYER_SIZE / 2 + LASER_BEAM_WIDTH / 2;
    for (const p of allPlayers()) {
      if (p.id === ownerId) continue;
      if (!isPlayerAlive(p)) continue;
      if (distPointToSegment(p.x, p.y, x1, y1, x2, y2) <= hitExtra) {
        applyDamage(p.id, dmg, ownerId);
      }
    }
  }

  function stepLasers(dt) {
    if (mode !== "host" && mode !== "solo") return;
    const toRemove = [];
    for (const L of activeLasers) {
      const owner = players.get(L.owner);
      if (!owner || !isPlayerAlive(owner)) {
        toRemove.push(L.id);
        continue;
      }
      L.remaining -= dt;
      L.tickAcc = (L.tickAcc || 0) + dt;
      while (L.tickAcc >= L.tickInterval) {
        L.tickAcc -= L.tickInterval;
        damagePlayersInBeam(L.owner, owner.x, owner.y, L.aimX, L.aimY, L.dmg);
      }
      if (L.remaining <= 0) toRemove.push(L.id);
    }
    for (const id of toRemove) removeLaser(id);
  }

  function spawnDirectedProjectile(attackerId, weapon, ax, ay, ux, uy, dmg, spawnOffsetX, spawnOffsetY) {
    const ox = spawnOffsetX || 0;
    const oy = spawnOffsetY || 0;
    const isPotion = weapon === "poison_potion" || weapon === "healing_potion";
    const speed = isPotion
      ? POTION_THROW_SPEED
      : weapon === "bow"
        ? BOW_SPEED
        : weapon === "reinforced_bow"
          ? REINFORCED_BOW_SPEED
          : weapon === "shot_bow"
            ? BOW_SPEED
            : weapon === "rpg"
              ? RPG_SPEED
              : weapon === "tos_rpg"
                ? TOS_SPEED
                : DAGGER_THROW_SPEED;
    const ang = Math.atan2(uy, ux);
    const half = PLAYER_SIZE / 2;
    const spawnDist = half + 22;
    const pid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const infinite = weapon === "rpg";
    const kind = isPotion
      ? weapon
      : weapon === "tos_rpg"
        ? "tos_circle"
        : weapon === "rpg"
          ? "rpg_rocket"
          : weapon === "bow" || weapon === "reinforced_bow" || weapon === "shot_bow"
            ? "arrow"
            : "dagger";
    spawnProjectile({
      pid,
      owner: attackerId,
      x: ax + ox + ux * spawnDist,
      y: ay + oy + uy * spawnDist,
      vx: ux * speed,
      vy: uy * speed,
      r: isPotion ? 9 : weapon === "tos_rpg" ? 14 : weapon === "rpg" ? 10 : weapon === "bow" || weapon === "reinforced_bow" || weapon === "shot_bow" ? 8 : 7,
      life: isPotion ? 4 : weapon === "tos_rpg" ? TOS_LIFE_SEC : weapon === "rpg" ? RPG_LIFE_SEC : weapon === "bow" || weapon === "reinforced_bow" || weapon === "shot_bow" ? BOW_LIFE_SEC : DAGGER_THROW_LIFE_SEC,
      dmg,
      color: isPotion
        ? weapon === "poison_potion"
          ? "#2d5a27"
          : "#e74c3c"
        : weapon === "tos_rpg"
          ? "#9b59b6"
          : weapon === "rpg"
            ? "#e67e22"
            : weapon === "shot_bow"
              ? "#ffb347"
              : weapon === "reinforced_bow"
                ? "#ffe4a8"
                : weapon === "bow"
                  ? "#fff8e7"
                  : "#d1b36a",
      kind,
      ang,
      infinite,
      maxDist: isPotion ? POTION_MAX_DIST : null,
      distTraveled: 0,
    });
  }

  function spawnShotBowVolley(attackerId, ax, ay, ux, uy) {
    const perpX = -uy;
    const perpY = ux;
    for (let i = -1; i <= 1; i++) {
      spawnDirectedProjectile(
        attackerId,
        "shot_bow",
        ax,
        ay,
        ux,
        uy,
        14,
        perpX * SHOT_BOW_SPREAD * i,
        perpY * SHOT_BOW_SPREAD * i
      );
    }
  }

  function clearPlayerEffects(p) {
    if (!p) return;
    p.poison = null;
    p.burn = null;
  }

  function broadcastPlayerEffect(id) {
    if (mode !== "host") return;
    const p = players.get(id);
    if (!p) return;
    broadcast({
      type: "playerEffect",
      id,
      poison: p.poison ? { rem: p.poison.rem, dps: p.poison.dps } : null,
      burn: p.burn ? { rem: p.burn.rem, dps: p.burn.dps } : null,
    });
  }

  function applyPoisonToPlayer(playerId, sourceId) {
    if (mode !== "host" && mode !== "solo") return;
    const p = players.get(playerId);
    if (!p || !isPlayerAlive(p)) return;
    p.poison = {
      rem: POISON_DURATION_SEC,
      tickAcc: 0,
      dps: POISON_DMG_PER_SEC,
      sourceId: sourceId || null,
    };
    if (mode === "host") broadcastPlayerEffect(playerId);
  }

  function applyBurnToPlayer(playerId, sourceId) {
    if (mode !== "host" && mode !== "solo") return;
    const p = players.get(playerId);
    if (!p || !isPlayerAlive(p)) return;
    p.burn = {
      rem: BURN_DURATION_SEC,
      tickAcc: 0,
      dps: BURN_HEARTS_PER_SEC * HEART_HP,
      sourceId: sourceId || null,
    };
    if (mode === "host") broadcastPlayerEffect(playerId);
  }

  function stepStatusEffects(dt) {
    if (mode !== "host" && mode !== "solo") return;
    for (const p of allPlayers()) {
      if (!isPlayerAlive(p)) continue;
      if (p.poison?.rem > 0) {
        p.poison.rem -= dt;
        p.poison.tickAcc = (p.poison.tickAcc || 0) + dt;
        while (p.poison.tickAcc >= 1) {
          p.poison.tickAcc -= 1;
          applyDamage(p.id, p.poison.dps, p.poison.sourceId || null);
        }
        if (p.poison.rem <= 0) p.poison = null;
      }
      if (p.burn?.rem > 0) {
        p.burn.rem -= dt;
        p.burn.tickAcc = (p.burn.tickAcc || 0) + dt;
        while (p.burn.tickAcc >= 1) {
          p.burn.tickAcc -= 1;
          applyDamage(p.id, p.burn.dps, p.burn.sourceId || null);
        }
        if (p.burn.rem <= 0) p.burn = null;
      }
    }
  }

  function tickStatusVisuals(dt) {
    for (const p of allPlayers()) {
      if (p.poison?.rem > 0) {
        p.poison.rem -= dt;
        if (p.poison.rem <= 0) p.poison = null;
      }
      if (p.burn?.rem > 0) {
        p.burn.rem -= dt;
        if (p.burn.rem <= 0) p.burn = null;
      }
    }
  }

  function applyHeal(playerId, amount) {
    if (mode !== "host" && mode !== "solo") return;
    const t = players.get(playerId);
    if (!t || !isPlayerAlive(t)) return;
    t.hp = Math.min(MAX_HP, (typeof t.hp === "number" ? t.hp : MAX_HP) + amount);
    const msg = { type: "hp", id: playerId, hp: t.hp };
    if (mode === "host") broadcast(msg);
    handleMessage(msg);
  }

  function resolvePotionLanding(pr) {
    const radius = POTION_AOE_RADIUS + PLAYER_SIZE / 2;
    for (const p of allPlayers()) {
      if (!isPlayerAlive(p)) continue;
      if (Math.hypot(p.x - pr.x, p.y - pr.y) > radius) continue;
      if (pr.kind === "poison_potion") applyPoisonToPlayer(p.id, pr.owner);
      else if (pr.kind === "healing_potion") applyHeal(p.id, 30);
    }
  }

  function isPotionKind(kind) {
    return kind === "poison_potion" || kind === "healing_potion";
  }

  function projectileHitsPlayer(pr, p) {
    const half = PLAYER_SIZE / 2;
    const hitR = pr.kind === "arrow" ? 10 : pr.kind === "rpg_rocket" ? pr.r || 10 : pr.r || 8;
    const dx = clamp(pr.x, p.x - half, p.x + half) - pr.x;
    const dy = clamp(pr.y, p.y - half, p.y + half) - pr.y;
    return dx * dx + dy * dy <= hitR * hitR;
  }

  function stepProjectiles(dt) {
    if (mode !== "host" && mode !== "solo") return;
    if (projectiles.length === 0) return;
    const toRemove = [];
    for (const pr of projectiles) {
      const stepDist = Math.hypot(pr.vx * dt, pr.vy * dt);
      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      pr.ang = Math.atan2(pr.vy, pr.vx);
      if (typeof pr.distTraveled === "number") pr.distTraveled += stepDist;
      pr.life -= dt;

      const potion = isPotionKind(pr.kind);
      let exploded = false;

      if (potion && typeof pr.maxDist === "number" && pr.distTraveled >= pr.maxDist) {
        resolvePotionLanding(pr);
        toRemove.push(pr.pid);
        exploded = true;
      }

      if (!exploded && pr.life <= 0) {
        if (potion) resolvePotionLanding(pr);
        toRemove.push(pr.pid);
        continue;
      }

      if (!exploded && !pr.infinite) {
        if (pr.x < -30 || pr.x > WORLD_W + 30 || pr.y < -30 || pr.y > WORLD_H + 30) {
          if (potion) resolvePotionLanding(pr);
          toRemove.push(pr.pid);
          continue;
        }
      }

      if (exploded) continue;

      for (const p of allPlayers()) {
        if (!potion && p.id === pr.owner) continue;
        if (!isPlayerAlive(p)) continue;
        if (!projectileHitsPlayer(pr, p)) continue;
        if (potion) {
          resolvePotionLanding(pr);
          toRemove.push(pr.pid);
          break;
        }
        applyDamage(p.id, pr.dmg, pr.owner);
        toRemove.push(pr.pid);
        break;
      }
    }
    for (const pid of toRemove) removeProjectile(pid);
  }

  function applyDamage(targetId, dmg, attackerId) {
    const t = players.get(targetId);
    if (!t) return;
    if (t.rollInvuln) return;
    const prevHp = typeof t.hp === "number" ? t.hp : MAX_HP;
    t.hp = Math.max(0, prevHp - dmg);
    if (t.hp === 0) {
      clearPlayerEffects(t);
      if (mode === "host") broadcastPlayerEffect(targetId);
    }
    const msg = { type: "hp", id: targetId, hp: t.hp, attackerId };
    if (mode === "host") broadcast(msg);
    handleMessage(msg);
    if (prevHp > 0 && t.hp === 0 && attackerId) {
      if (mode === "host" || mode === "solo") hostSlain(targetId, attackerId);
      const a = players.get(attackerId);
      if (a) {
        const gained = killsPerElimination(a);
        a.kills = (typeof a.kills === "number" ? a.kills : 0) + gained;
        const km = { type: "kills", id: attackerId, kills: a.kills };
        if (mode === "host") broadcast(km);
        handleMessage(km);
        if (localPlayer && attackerId === localPlayer.id) {
          profile.kills = a.kills;
          markTraitRollUnlockedIfEligible();
          persistProfile();
          renderWeaponsModal();
        }
      }
    }
  }

  function handleAttack(attackerId, data) {
    if (mode !== "host" && mode !== "solo") return;
    if (isMultiplayerMatch() && matchPhase !== "fighting") return;
    const attacker = players.get(attackerId);
    if (!attacker || !isPlayerAlive(attacker)) return;
    const weapon = data.weapon;
    if (!weapon) return;

    const ax = attacker.x;
    const ay = attacker.y;
    const aimX = clamp(data.aimX, 0, WORLD_W);
    const aimY = clamp(data.aimY, 0, WORLD_H);
    const fdx = aimX - ax;
    const fdy = aimY - ay;
    const fl = Math.hypot(fdx, fdy) || 1;
    attacker.dirX = fdx / fl;
    attacker.dirY = fdy / fl;
    if (mode === "host") {
      broadcast({ type: "face", id: attacker.id, dirX: attacker.dirX, dirY: attacker.dirY });
    }
    const dmg = damageOf(weapon);

    if (weapon === "laser_launcher") {
      startLaserBeam(attackerId, aimX, aimY);
      return;
    }

    if (weapon === "shot_bow") {
      spawnShotBowVolley(attackerId, ax, ay, fdx / fl, fdy / fl);
      return;
    }

    const isProjectile =
      weapon === "bow" ||
      weapon === "reinforced_bow" ||
      weapon === "rpg" ||
      weapon === "tos_rpg" ||
      weapon === "poison_potion" ||
      weapon === "healing_potion" ||
      (weapon === "dagger" && data.throw === true);
    if (isProjectile) {
      spawnDirectedProjectile(attackerId, weapon, ax, ay, fdx / fl, fdy / fl, dmg);
      return;
    }

    const range = meleeRange(weapon);
    let best = null;
    let bestD = Infinity;
    for (const p of allPlayers()) {
      if (p.id === attackerId) continue;
      if (p.hp <= 0) continue;
      const d = Math.hypot(p.x - ax, p.y - ay);
      if (d <= range && d < bestD) {
        best = p;
        bestD = d;
      }
    }
    if (best) {
      applyDamage(best.id, dmg, attackerId);
      if (weapon === "magma_scythe") applyBurnToPlayer(best.id, attackerId);
    }
  }

  if (!canvas || !btnSolo || !btnCreate || !btnJoin || !statusEl) {
    if (statusEl) {
      setStatus("Game UI failed to load. Make sure index.html and game.js are both up to date on GitHub.", "error");
    }
    return;
  }

  setupPlayerInteraction();

  on(btnSolo, "click", () => {
    setStatus("");
    startSolo();
  });

  on(btnCreate, "click", async () => {
    setStatus("Creating room…");
    setBusy(true);
    try {
      await createRoom(1);
    } catch (err) {
      setStatus(err.message || "Failed to create room.", "error");
      destroyPeer();
      mode = null;
    }
    setBusy(false);
  });

  on(btnJoin, "click", async () => {
    const code = joinCodeInput.value.trim().replace(/\D/g, "").slice(0, 6);
    if (code.length < 6) {
      setStatus("Enter the full 6-digit code.", "error");
      return;
    }
    setStatus("Joining…");
    setBusy(true);
    try {
      await joinRoom(code);
    } catch (err) {
      setStatus(err.message || "Could not join.", "error");
      destroyPeer();
      mode = null;
    }
    setBusy(false);
  });

  btnLeave.addEventListener("click", showMenu);
  if (btnStartGame) btnStartGame.addEventListener("click", hostStartGame);
  if (btnVoteNext) btnVoteNext.addEventListener("click", voteNextGame);
  btnCopyUrl.addEventListener("click", () => copyText(shareUrlInput.value));
  on(tabWeaponsEl, "click", () => setInventoryTab("weapons"));
  on(tabLuckEl, "click", () => setInventoryTab("upgrades"));
  on(luckListEl, "click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const mult = parseInt(t.getAttribute("data-buy-luck") || "", 10);
    if (mult) buyLuckUpgrade(mult);
  });
  on(killBonusListEl, "click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const bonus = parseInt(t.getAttribute("data-buy-kill-bonus") || "", 10);
    if (bonus) buyKillBonusUpgrade(bonus);
  });
  btnWeapons.addEventListener("click", openWeaponsModal);
  btnSettings.addEventListener("click", openSettingsModal);
  btnCloseWeapons.addEventListener("click", closeWeaponsModal);
  weaponsModalEl.addEventListener("click", (e) => {
    if (e.target === weaponsModalEl) closeWeaponsModal();
  });
  on(btnRollWeapon, "click", () => {
    if (!profile) profile = getDefaultProfile();
    rollWeapon();
    renderWeaponsModal();
  });
  on(btnRollTrait, "click", () => {
    if (!profile) profile = getDefaultProfile();
    rollTrait();
  });
  on(btnRollDone, "click", hideRollOverlay);
  btnRedeem.addEventListener("click", redeemCode);
  btnCloseSettings.addEventListener("click", closeSettingsModal);
  settingsModalEl.addEventListener("click", (e) => {
    if (e.target === settingsModalEl) closeSettingsModal();
  });
  btnRedeem.addEventListener("click", redeemCode);
  btnCloseSettings.addEventListener("click", closeSettingsModal);
  settingsModalEl.addEventListener("click", (e) => {
    if (e.target === settingsModalEl) closeSettingsModal();
  });
  on(backpackListEl, "click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const id = t.getAttribute("data-equip");
    if (id) setEquipped(id);
  });

  if (backpackListEl) {
    backpackListEl.addEventListener("contextmenu", (e) => {
      if (!testMode) return;
      const row = e.target instanceof Element ? e.target.closest("[data-weapon-id]") : null;
      if (!row) return;
      e.preventDefault();
      const id = row.getAttribute("data-weapon-id");
      if (id) setTestModeRollWeaponPick(id);
    });
  }

  on(traitListEl, "click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const id = t.getAttribute("data-equip-trait");
    if (id) setEquippedTrait(id);
  });

  on(playerNameInput, "input", () => {
    if (weaponsModalEl && !weaponsModalEl.classList.contains("hidden")) {
      renderWeaponsModal();
    }
  });

  on(btnKick, "click", () => {
    if (!menuTargetPlayer) return;
    kickPlayer(menuTargetPlayer.id, kickReasonInput?.value || "");
  });

  on(btnBan, "click", () => {
    if (!menuTargetPlayer) return;
    const user = menuTargetPlayer.user;
    if (!user) {
      setGameStatus("That player has no account username to ban.", "error");
      return;
    }
    banAccount(roomCode, user);
    kickPlayer(menuTargetPlayer.id, "Banned");
    setGameStatus(`Banned ${user} from this room`, "success");
  });

  on(btnClosePlayerMenu, "click", closePlayerMenu);

  on(playerMenuEl, "click", (e) => {
    if (e.target === playerMenuEl) closePlayerMenu();
  });

  if (selfMenuEl) {
    selfMenuEl.addEventListener("click", (e) => {
      if (e.target === selfMenuEl) closeSelfMenu();
    });
  }

  on(selfMenuCodeEl, "input", checkSelfMenuCode);
  on(selfMenuCodeEl, "keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkSelfMenuCode();
    }
  });
  on(testerTraitSwitchEl, "change", () => {
    saveTesterTraitUnlock(testerTraitSwitchEl.checked);
    setGameStatus(
      testerTraitSwitchEl.checked ? "Instant trait roll enabled." : "Instant trait roll disabled.",
      testerTraitSwitchEl.checked ? "success" : ""
    );
  });
  if (settingAnimationsEl) {
    settingAnimationsEl.addEventListener("change", () => {
      saveSettings({ animationsEnabled: settingAnimationsEl.checked });
    });
  }
  if (settingRareAnimMultEl) {
    settingRareAnimMultEl.addEventListener("change", () => {
      const val = parseInt(settingRareAnimMultEl.value, 10);
      saveSettings({ rareRollAnimMult: clamp(isNaN(val) ? 50 : val, 10, 10000) });
      settingRareAnimMultEl.value = String(getSettings().rareRollAnimMult);
    });
  }
  on(btnCloseSelfMenu, "click", closeSelfMenu);

  on(btnKickedOk, "click", () => {
    hideKickedOverlay();
    showMenu();
  });

  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const moveKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    if (isInventoryModalOpen() && moveKeys.includes(key)) {
      e.preventDefault();
      return;
    }
    keys[key] = true;
    if (key === "i" && !isTypingInField()) {
      interactAtAim();
    }
    if (key === "q") {
      const trait = localPlayer?.trait || profile?.trait;
      if (trait === "dash" && localPlayer) {
        const t = now();
        if (t >= dashCooldownUntil) {
          dashCooldownUntil = t + 1400;
          const dx = typeof localPlayer.dirX === "number" ? localPlayer.dirX : 1;
          const dy = typeof localPlayer.dirY === "number" ? localPlayer.dirY : 0;
          const dist = 85;
          const half = PLAYER_SIZE / 2;
          const nx = clamp(localPlayer.x + dx * dist, half, WORLD_W - half);
          const ny = clamp(localPlayer.y + dy * dist, half, WORLD_H - half);
          localPlayer.x = nx;
          localPlayer.y = ny;
          sendMove(nx, ny);
        }
      }
    }
    if (moveKeys.includes(key)) {
      e.preventDefault();
    }
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  const params = new URLSearchParams(window.location.search);
  const joinParam = params.get("join");
  if (joinParam) {
    joinCodeInput.value = joinParam.replace(/\D/g, "").slice(0, 6);
  }

  // Account boot
  load3cCooldown();
  loadTesterPrefs();
  syncSettingsUI();
  try {
    const remembered = localStorage.getItem(LS_CURRENT);
    if (remembered) setCurrentUser(remembered);
    else setCurrentUser(null);
  } catch {
    setCurrentUser(null);
  }

  on(btnAccCreate, "click", async () => {
    if (!accUserEl || !accPassEl) return;
    const u = normalizeUser(accUserEl.value);
    const p = accPassEl.value || "";
    if (!u || p.length < 3) {
      setStatus("Enter username and a password (3+ chars).", "error");
      return;
    }
    const accounts = loadAccounts();
    if (accounts[u]) {
      setStatus("Username already exists on this device.", "error");
      return;
    }
    const hash = await sha256(p);
    accounts[u] = { passHash: hash, profile: getDefaultProfile() };
    saveAccounts(accounts);
    setCurrentUser(u);
    setStatus("Account created (saved on this device).", "success");
  });

  on(btnAccLogin, "click", async () => {
    if (!accUserEl || !accPassEl) return;
    const u = normalizeUser(accUserEl.value);
    const p = accPassEl.value || "";
    const accounts = loadAccounts();
    if (!accounts[u]) {
      setStatus("No such account on this device.", "error");
      return;
    }
    const hash = await sha256(p);
    if (hash !== accounts[u].passHash) {
      setStatus("Wrong password.", "error");
      return;
    }
    setCurrentUser(u);
    setStatus("Logged in.", "success");
  });

  on(btnAccLogout, "click", () => {
    exitTestMode();
    setCurrentUser(null);
    setStatus("Logged out.", "success");
  });

  on(btnAccTest, "click", () => enterTestMode());
  on(btnAccExitTest, "click", () => exitTestMode());

  initMultiplayerAvailability();
  if (playerNameInput) playerNameInput.focus();
})();
