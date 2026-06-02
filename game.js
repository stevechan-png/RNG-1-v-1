(function () {
  const WORLD_W = 800;
  const WORLD_H = 500;
  const SPEED = 4;
  const PLAYER_SIZE = 28;
  const MAX_PLAYERS = 5;
  const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
  const IS_HTTPS = window.location.protocol === "https:";
  const MAX_HP = 100;
  const BOW_SPEED = 220;
  const DAGGER_THROW_SPEED = 260;
  const BOW_LIFE_SEC = 3.5;
  const DAGGER_THROW_LIFE_SEC = 2;

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
  const btnWeapons = document.getElementById("btnWeapons");
  const btnCopyUrl = document.getElementById("btnCopyUrl");
  const btnCopyCode = document.getElementById("btnCopyCode");
  const gameStatusEl = document.getElementById("gameStatus");
  const weaponsModalEl = document.getElementById("weaponsModal");
  const backpackListEl = document.getElementById("backpackList");
  const btnCloseWeapons = document.getElementById("btnCloseWeapons");
  const btnRollWeapon = document.getElementById("btnRollWeapon");
  const btnRollTrait = document.getElementById("btnRollTrait");
  const killsLabelEl = document.getElementById("killsLabel");
  const traitLabelEl = document.getElementById("traitLabel");
  const playerMenuEl = document.getElementById("playerMenu");
  const playerMenuTitleEl = document.getElementById("playerMenuTitle");
  const kickReasonInput = document.getElementById("kickReason");
  const btnKick = document.getElementById("btnKick");
  const btnBan = document.getElementById("btnBan");
  const btnClosePlayerMenu = document.getElementById("btnClosePlayerMenu");
  const kickedOverlayEl = document.getElementById("kickedOverlay");
  const kickedMessageEl = document.getElementById("kickedMessage");
  const btnKickedOk = document.getElementById("btnKickedOk");
  const accountLoggedOutEl = document.getElementById("accountLoggedOut");
  const accountLoggedInEl = document.getElementById("accountLoggedIn");
  const accUserEl = document.getElementById("accUser");
  const accPassEl = document.getElementById("accPass");
  const btnAccLogin = document.getElementById("btnAccLogin");
  const btnAccCreate = document.getElementById("btnAccCreate");
  const btnAccLogout = document.getElementById("btnAccLogout");
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
  let lastLoopTime = 0;
  let projSyncAccum = 0;
  let attackCooldownUntil = 0;
  let clickDownAt = 0;
  let lastAim = { x: WORLD_W / 2, y: WORLD_H / 2 };
  let rollAnimTimer = null;
  let rollAnimUntil = 0;
  let adminHoldTimer = null;
  let suppressNextAttack = false;
  let dashCooldownUntil = 0;

  // local account persistence (per device)
  const LS_ACCOUNTS = "bg_accounts_v1";
  const LS_CURRENT = "bg_current_user_v1";
  const LS_ROOM_BANS = "bg_room_bans_v1";
  let currentUser = null;
  let profile = null; // { inventory: string[], equipped: string|null, kills:number, trait:string|null }

  function getPlayerName() {
    return (playerNameInput.value || "Player").trim().slice(0, 20) || "Player";
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

  function setBusy(busy) {
    btnSolo.disabled = busy;
    btnJoin.disabled = busy;
    btnCreate.disabled = busy;
    btnWeapons.disabled = busy;
  }

  function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function now() {
    return performance.now();
  }

  function weaponDefs() {
    return {
      knife: {
        id: "knife",
        name: "Knife",
        meta: "Close range • 10 dmg • 0.5s cd",
      },
      bow: {
        id: "bow",
        name: "Bow",
        meta: "Arrow • 8 dmg • 1.0s cd",
      },
      dagger: {
        id: "dagger",
        name: "Dagger",
        meta: "Short: melee • Long: throw • 7 dmg",
      },
    };
  }

  function rollWeaponId() {
    // Knife must be 1/2 exactly. Remaining half is split between Bow and Dagger.
    // (Bow and Dagger keep their relative rarity vs each other: Bow 3x more common than Dagger.)
    const r = Math.random();
    if (r < 0.5) return "knife"; // 1/2
    // remaining 1/2: Bow 3/4, Dagger 1/4  => Bow 3/8 overall, Dagger 1/8 overall
    return Math.random() < 0.75 ? "bow" : "dagger";
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

  function getDefaultProfile() {
    return { inventory: [], equipped: null, kills: 0, trait: null };
  }

  function loadProfileFor(user) {
    const accounts = loadAccounts();
    const acc = accounts[user];
    if (acc && acc.profile) return acc.profile;
    return getDefaultProfile();
  }

  function saveProfileFor(user, prof) {
    const accounts = loadAccounts();
    if (!accounts[user]) return;
    accounts[user].profile = prof;
    saveAccounts(accounts);
  }

  function setCurrentUser(user) {
    currentUser = user || null;
    if (currentUser) localStorage.setItem(LS_CURRENT, currentUser);
    else localStorage.removeItem(LS_CURRENT);
    profile = currentUser ? loadProfileFor(currentUser) : getDefaultProfile();
    renderAccountUI();
    renderWeaponsModal();
  }

  function renderAccountUI() {
    if (!accountLoggedOutEl) return;
    if (currentUser) {
      accountLoggedOutEl.classList.add("hidden");
      accountLoggedInEl.classList.remove("hidden");
      accWhoEl.textContent = currentUser;
    } else {
      accountLoggedOutEl.classList.remove("hidden");
      accountLoggedInEl.classList.add("hidden");
      accWhoEl.textContent = "";
    }
  }

  function ensureWeaponInInventory(id) {
    if (!profile) profile = getDefaultProfile();
    if (!profile.inventory.includes(id)) profile.inventory.push(id);
  }

  function setEquipped(id) {
    if (!profile) profile = getDefaultProfile();
    profile.equipped = id;
    if (currentUser) saveProfileFor(currentUser, profile);
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
      dash: { id: "dash", name: "Dash" },
      speedy: { id: "speedy", name: "Speedy" },
      transparency: { id: "transparency", name: "Transparency" },
    };
  }

  function rollTraitId() {
    // Dash 1/2, Speedy 1/9, Transparency 1/35
    // Normalized weights: 315 : 70 : 18
    const r = Math.random() * (315 + 70 + 18);
    if (r < 315) return "dash";
    if (r < 315 + 70) return "speedy";
    return "transparency";
  }

  function movementMultiplierForTrait(trait) {
    return trait === "speedy" ? 1.2 : 1;
  }

  function alphaForTrait(trait) {
    return trait === "transparency" ? 0.8 : 1;
  }

  function peerOptions(overrides) {
    const base = {
      // Make PeerJS explicit for GitHub Pages / HTTPS
      host: "0.peerjs.com",
      port: IS_HTTPS ? 443 : 80,
      path: "/",
      secure: IS_HTTPS,
      // Improve NAT traversal odds
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
      debug: 0,
    };
    return { ...base, ...(overrides || {}) };
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

  function openPlayerMenu(player) {
    if (!isP1() || player.slot === 0) return;
    menuTargetPlayer = player;
    playerMenuTitleEl.textContent = `P${player.slot + 1}: ${player.name}`;
    kickReasonInput.value = "";
    playerMenuEl.classList.remove("hidden");
    playerMenuEl.setAttribute("aria-hidden", "false");
    kickReasonInput.focus();
  }

  function closePlayerMenu() {
    menuTargetPlayer = null;
    playerMenuEl.classList.add("hidden");
    playerMenuEl.setAttribute("aria-hidden", "true");
    kickReasonInput.value = "";
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

  function findClickedPlayer(px, py) {
    const sorted = allPlayers().sort((a, b) => b.slot - a.slot);
    for (const p of sorted) {
      if (p.id === localPlayer?.id) continue;
      if (hitTestPlayer(px, py, p)) return p;
    }
    return null;
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

  function applyState(list, selfId) {
    players.clear();
    for (const p of list) {
      players.set(p.id, { dirX: 1, dirY: 0, weapon: null, hp: MAX_HP, trait: null, kills: 0, user: null, ...p });
      if (p.id === selfId) localPlayer = players.get(p.id);
    }
    updateP1Cursor();
  }

  function handleMessage(msg, fromConn) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case "state":
        applyState(msg.players, msg.youId);
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
      case "equip":
        if (players.has(msg.id)) players.get(msg.id).weapon = msg.weapon;
        break;
      case "trait":
        if (players.has(msg.id)) players.get(msg.id).trait = msg.trait;
        break;
      case "kills":
        if (players.has(msg.id)) players.get(msg.id).kills = msg.kills;
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
          user: guestUser || null,
          trait: data.trait || null,
          kills: typeof data.kills === "number" ? data.kills : 0,
        };
        players.set(player.id, player);
        conn.send({
          type: "state",
          youId: player.id,
          players: allPlayers(),
        });
        broadcast({ type: "playerJoined", player }, conn);
      } else if (data.type === "equip") {
        const p = players.get(conn.peer);
        if (p) {
          p.weapon = data.weapon || null;
          broadcast({ type: "equip", id: p.id, weapon: p.weapon }, conn);
        }
      } else if (data.type === "attack") {
        handleAttack(conn.peer, data);
      } else if (data.type === "face") {
        const p = players.get(conn.peer);
        if (p) {
          p.dirX = data.dirX;
          p.dirY = data.dirY;
          broadcast({ type: "face", id: p.id, dirX: p.dirX, dirY: p.dirY }, conn);
        }
      } else if (data.type === "trait") {
        const p = players.get(conn.peer);
        if (p) {
          p.trait = data.trait || null;
          broadcast({ type: "trait", id: p.id, trait: p.trait }, conn);
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
    ctx.globalAlpha = alphaForTrait(p.trait);
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
      } else if (w === "bow") {
        ctx.strokeStyle = "#d1b36a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(4, 0, 12, -1.1, 1.1);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-6, -10);
        ctx.lineTo(-6, 10);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function sendMove(x, y) {
    if (!localPlayer) return;
    const msg = { type: "move", id: localPlayer.id, x, y };
    if (mode === "solo") return;
    if (mode === "host") broadcast(msg);
    else sendToHost(msg);
  }

  function update() {
    if (!localPlayer) return;
    let dx = 0;
    let dy = 0;
    const mult = movementMultiplierForTrait(localPlayer.trait || profile?.trait);
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

  function drawProjectile(pr) {
    const ang = typeof pr.ang === "number" ? pr.ang : Math.atan2(pr.vy, pr.vx);
    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(ang);
    if (pr.kind === "arrow") {
      ctx.fillStyle = "#fff8e7";
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 1.5;
      ctx.fillRect(-22, -3.5, 36, 7);
      ctx.strokeRect(-22, -3.5, 36, 7);
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(5, -9);
      ctx.lineTo(5, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(-26, -2, 8, 4);
    } else if (pr.kind === "dagger") {
      ctx.fillStyle = "#c8b28a";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.fillRect(-14, -4, 26, 8);
      ctx.strokeRect(-14, -4, 26, 8);
      ctx.fillStyle = "#a67c52";
      ctx.fillRect(-20, -5, 7, 10);
    } else {
      ctx.fillStyle = pr.color || "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, pr.r || 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function render() {
    drawLandscape();
    const sorted = allPlayers().sort((a, b) => a.slot - b.slot);
    for (const p of sorted) {
      if (p.id !== localPlayer?.id) drawPlayer(p, false);
    }
    if (localPlayer) drawPlayer(localPlayer, true);
    for (const pr of projectiles) drawProjectile(pr);
  }

  function loop(ts) {
    if (!lastLoopTime) lastLoopTime = ts;
    const dt = Math.min(0.05, (ts - lastLoopTime) / 1000);
    lastLoopTime = ts;

    if (mode === "solo" || mode === "host") {
      stepProjectiles(dt);
      if (mode === "host" && guestConns.length > 0 && projectiles.length > 0) {
        projSyncAccum += dt;
        if (projSyncAccum >= 0.05) {
          projSyncAccum = 0;
          broadcastProjTick();
        }
      }
    }

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
    };
    players.clear();
    players.set(localPlayer.id, localPlayer);
    showGame("Solo Test");
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
    if (attempt > 8) {
      throw new Error("Could not create a room. Try again.");
    }
    const code = generateCode();
    const p = new Peer(roomPeerId(code), peerOptions());

    try {
      await waitForPeerOpen(p, 15000);
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
      };
      players.clear();
      players.set(localPlayer.id, localPlayer);

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
    destroyPeer();
    mode = "guest";
    roomCode = code;

    const p = new Peer(peerOptions());
    peer = p;
    await waitForPeerOpen(p, 15000);
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
      kills: typeof profile?.kills === "number" ? profile.kills : 0,
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
    // send equipped to host
    if (profile?.equipped) sendToHost({ type: "equip", weapon: profile.equipped });
    if (profile?.trait) sendToHost({ type: "trait", trait: profile.trait });
    if (typeof profile?.kills === "number") sendToHost({ type: "kills", kills: profile.kills });
  }

  function renderWeaponsModal() {
    if (killsLabelEl && traitLabelEl) {
      const kills = typeof profile?.kills === "number" ? profile.kills : 0;
      killsLabelEl.textContent = String(kills);
      const t = profile?.trait || null;
      const td = traitDefs();
      traitLabelEl.textContent = t ? (td[t]?.name || t) : "None";
      if (btnRollTrait) btnRollTrait.disabled = kills < 5;
    }
    renderBackpack();
  }

  function openWeaponsModal() {
    renderWeaponsModal();
    weaponsModalEl.classList.remove("hidden");
    weaponsModalEl.setAttribute("aria-hidden", "false");
  }

  function closeWeaponsModal() {
    weaponsModalEl.classList.add("hidden");
    weaponsModalEl.setAttribute("aria-hidden", "true");
  }

  function renderBackpack() {
    if (!backpackListEl) return;
    const defs = weaponDefs();
    const inv = profile?.inventory || [];
    if (inv.length === 0) {
      backpackListEl.innerHTML = `<p class="help-text">No weapons yet. Click <strong>Roll Weapon</strong>.</p>`;
      return;
    }
    const equipped = profile?.equipped || null;
    backpackListEl.innerHTML = inv
      .map((id) => {
        const w = defs[id];
        const isEq = equipped === id;
        const btn = isEq
          ? `<button type="button" class="btn btn-small btn-equipped" disabled>Equipped</button>`
          : `<button type="button" class="btn btn-small btn-equip" data-equip="${id}">Equip</button>`;
        return `<div class="bp-item">
          <div class="bp-left">
            <div class="bp-name">${w ? w.name : id}</div>
            <div class="bp-meta">${w ? w.meta : ""}</div>
          </div>
          <div class="bp-actions">${btn}</div>
        </div>`;
      })
      .join("");
  }

  function rollWeapon() {
    if (rollAnimTimer) {
      clearInterval(rollAnimTimer);
      rollAnimTimer = null;
    }
    const defs = weaponDefs();
    const order = ["knife", "bow", "dagger"];
    const start = now();
    rollAnimUntil = start + 950;
    setGameStatus("Rolling…", "");
    let i = 0;
    rollAnimTimer = setInterval(() => {
      const t = now();
      const id = order[i % order.length];
      i++;
      setGameStatus(`Rolling… ${defs[id].name}`, "");
      if (t >= rollAnimUntil) {
        clearInterval(rollAnimTimer);
        rollAnimTimer = null;
        const finalId = rollWeaponId();
        ensureWeaponInInventory(finalId);
        if (!profile.equipped) profile.equipped = finalId;
        if (currentUser) saveProfileFor(currentUser, profile);
        setEquipped(profile.equipped);
        setGameStatus(`Rolled: ${defs[finalId].name}`, "success");
        showShareBox(roomCode || "");
      }
    }, 90);
  }

  function rollTrait() {
    const kills = typeof profile?.kills === "number" ? profile.kills : 0;
    if (kills < 5) {
      setGameStatus("Need 5 kills to roll a trait.", "error");
      return;
    }
    const id = rollTraitId();
    profile.trait = id;
    if (currentUser) saveProfileFor(currentUser, profile);
    if (localPlayer) {
      localPlayer.trait = id;
      if (mode === "host") broadcast({ type: "trait", id: localPlayer.id, trait: id });
      else if (mode === "guest") sendToHost({ type: "trait", trait: id });
    }
    const td = traitDefs();
    setGameStatus(`Trait: ${td[id].name}`, "success");
    renderWeaponsModal();
  }

  function canAttack() {
    return localPlayer && (mode === "solo" || mode === "host" || mode === "guest");
  }

  function getEquippedWeapon() {
    return localPlayer?.weapon || profile?.equipped || null;
  }

  function weaponCooldownMs(weaponId, isThrow) {
    if (weaponId === "knife") return 500;
    if (weaponId === "bow") return 1000;
    if (weaponId === "dagger") return isThrow ? 1200 : 700;
    return 600;
  }

  function meleeRange(weaponId) {
    if (weaponId === "knife") return 55;
    if (weaponId === "dagger") return 50;
    return 0;
  }

  function damageOf(weaponId) {
    if (weaponId === "knife") return 10;
    if (weaponId === "bow") return 8;
    if (weaponId === "dagger") return 7;
    return 0;
  }

  function performAttack(payload) {
    if (!localPlayer) return;
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

  function stepProjectiles(dt) {
    if (mode !== "host" && mode !== "solo") return;
    if (projectiles.length === 0) return;
    const toRemove = [];
    for (const pr of projectiles) {
      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      pr.ang = Math.atan2(pr.vy, pr.vx);
      pr.life -= dt;
      if (pr.life <= 0) {
        toRemove.push(pr.pid);
        continue;
      }
      if (pr.x < -30 || pr.x > WORLD_W + 30 || pr.y < -30 || pr.y > WORLD_H + 30) {
        toRemove.push(pr.pid);
        continue;
      }
      for (const p of allPlayers()) {
        if (p.id === pr.owner) continue;
        if (typeof p.hp !== "number" || p.hp <= 0) continue;
        const half = PLAYER_SIZE / 2;
        const hitR = pr.kind === "arrow" ? 10 : pr.r || 8;
        const dx = clamp(pr.x, p.x - half, p.x + half) - pr.x;
        const dy = clamp(pr.y, p.y - half, p.y + half) - pr.y;
        if (dx * dx + dy * dy <= hitR * hitR) {
          applyDamage(p.id, pr.dmg, pr.owner);
          toRemove.push(pr.pid);
          break;
        }
      }
    }
    for (const pid of toRemove) removeProjectile(pid);
  }

  function applyDamage(targetId, dmg, attackerId) {
    const t = players.get(targetId);
    if (!t) return;
    t.hp = Math.max(0, (typeof t.hp === "number" ? t.hp : MAX_HP) - dmg);
    const msg = { type: "hp", id: targetId, hp: t.hp, attackerId };
    if (mode === "host") broadcast(msg);
    handleMessage(msg);

    // kill tracking (host/solo authoritative)
    if (t.hp === 0 && attackerId) {
      const a = players.get(attackerId);
      if (a) {
        a.kills = (typeof a.kills === "number" ? a.kills : 0) + 1;
        const km = { type: "kills", id: attackerId, kills: a.kills };
        if (mode === "host") broadcast(km);
        handleMessage(km);
        if (localPlayer && attackerId === localPlayer.id) {
          if (!profile) profile = getDefaultProfile();
          profile.kills = a.kills;
          if (currentUser) saveProfileFor(currentUser, profile);
          renderWeaponsModal();
        }
      }
    }
  }

  function handleAttack(attackerId, data) {
    if (mode !== "host" && mode !== "solo") return;
    const attacker = players.get(attackerId);
    if (!attacker || attacker.hp <= 0) return;
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

    if (weapon === "bow" || (weapon === "dagger" && data.throw === true)) {
      const ux = fdx / fl;
      const uy = fdy / fl;
      const speed = weapon === "bow" ? BOW_SPEED : DAGGER_THROW_SPEED;
      const ang = Math.atan2(uy, ux);
      const half = PLAYER_SIZE / 2;
      const spawnDist = half + 22;
      const pid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      spawnProjectile({
        pid,
        owner: attackerId,
        x: ax + ux * spawnDist,
        y: ay + uy * spawnDist,
        vx: ux * speed,
        vy: uy * speed,
        r: weapon === "bow" ? 8 : 7,
        life: weapon === "bow" ? BOW_LIFE_SEC : DAGGER_THROW_LIFE_SEC,
        dmg,
        color: weapon === "bow" ? "#fff8e7" : "#d1b36a",
        kind: weapon === "bow" ? "arrow" : "dagger",
        ang,
      });
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
    if (best) applyDamage(best.id, dmg, attackerId);
  }

  btnSolo.addEventListener("click", () => {
    setStatus("");
    startSolo();
  });

  btnCreate.addEventListener("click", async () => {
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

  btnJoin.addEventListener("click", async () => {
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
  btnCopyUrl.addEventListener("click", () => copyText(shareUrlInput.value));
  btnWeapons.addEventListener("click", openWeaponsModal);
  btnCloseWeapons.addEventListener("click", closeWeaponsModal);
  weaponsModalEl.addEventListener("click", (e) => {
    if (e.target === weaponsModalEl) closeWeaponsModal();
  });
  btnRollWeapon.addEventListener("click", () => {
    if (!profile) profile = getDefaultProfile();
    rollWeapon();
    renderWeaponsModal();
  });
  btnRollTrait.addEventListener("click", () => {
    if (!profile) profile = getDefaultProfile();
    rollTrait();
  });
  backpackListEl.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const id = t.getAttribute("data-equip");
    if (id) setEquipped(id);
  });

  btnKick.addEventListener("click", () => {
    if (!menuTargetPlayer) return;
    kickPlayer(menuTargetPlayer.id, kickReasonInput.value);
  });

  btnBan.addEventListener("click", () => {
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

  btnClosePlayerMenu.addEventListener("click", closePlayerMenu);

  playerMenuEl.addEventListener("click", (e) => {
    if (e.target === playerMenuEl) closePlayerMenu();
  });

  btnKickedOk.addEventListener("click", () => {
    hideKickedOverlay();
    showMenu();
  });

  // Admin menu: right click
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (!isP1()) return;
    if (!playerMenuEl.classList.contains("hidden")) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const target = findClickedPlayer(x, y);
    if (target) {
      suppressNextAttack = true;
      openPlayerMenu(target);
    }
  });

  // Combat: aim at click (mousedown/up for dagger long-throw)
  canvas.addEventListener("mousedown", (e) => {
    if (!canAttack()) return;
    if (kickedOverlayEl && !kickedOverlayEl.classList.contains("hidden")) return;
    if (!playerMenuEl.classList.contains("hidden")) return;
    if (!weaponsModalEl.classList.contains("hidden")) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    lastAim = { x, y };
    clickDownAt = now();

    // P1 long-press (left button) to open admin menu
    suppressNextAttack = false;
    if (isP1() && e.button === 0) {
      if (adminHoldTimer) clearTimeout(adminHoldTimer);
      const cx = e.clientX;
      const cy = e.clientY;
      adminHoldTimer = setTimeout(() => {
        const c = getCanvasCoords(cx, cy);
        const target = findClickedPlayer(c.x, c.y);
        if (target) {
          suppressNextAttack = true;
          openPlayerMenu(target);
        }
      }, 450);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!canAttack()) return;
    if (adminHoldTimer) {
      clearTimeout(adminHoldTimer);
      adminHoldTimer = null;
    }
    if (suppressNextAttack) {
      suppressNextAttack = false;
      return;
    }
    const weapon = getEquippedWeapon();
    if (!weapon) {
      setGameStatus("No weapon equipped. Roll one first.", "error");
      return;
    }
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    lastAim = { x, y };
    // update facing for local render + sync
    if (localPlayer) {
      const dx = x - localPlayer.x;
      const dy = y - localPlayer.y;
      const len = Math.hypot(dx, dy) || 1;
      localPlayer.dirX = dx / len;
      localPlayer.dirY = dy / len;
      if (mode === "host") broadcast({ type: "face", id: localPlayer.id, dirX: localPlayer.dirX, dirY: localPlayer.dirY });
      else if (mode === "guest") sendToHost({ type: "face", dirX: localPlayer.dirX, dirY: localPlayer.dirY });
    }
    const heldMs = now() - (clickDownAt || now());
    const isThrow = weapon === "dagger" && heldMs >= 350;
    const cd = weaponCooldownMs(weapon, isThrow);
    if (now() < attackCooldownUntil) return;
    attackCooldownUntil = now() + cd;
    performAttack({ weapon, aimX: x, aimY: y, throw: isThrow });
  });

  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === "q") {
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
    if (
      ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(
        e.key.toLowerCase()
      )
    ) {
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
  try {
    const remembered = localStorage.getItem(LS_CURRENT);
    if (remembered) setCurrentUser(remembered);
    else setCurrentUser(null);
  } catch {
    setCurrentUser(null);
  }

  btnAccCreate.addEventListener("click", async () => {
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

  btnAccLogin.addEventListener("click", async () => {
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

  btnAccLogout.addEventListener("click", () => {
    setCurrentUser(null);
    setStatus("Logged out.", "success");
  });

  playerNameInput.focus();
})();
