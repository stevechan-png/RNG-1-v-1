(function () {
  const WORLD_W = 800;
  const WORLD_H = 500;
  const SPEED = 4;
  const PLAYER_SIZE = 28;
  const MAX_PLAYERS = 5;
  const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
  const IS_HTTPS = window.location.protocol === "https:";

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
  const btnCopyUrl = document.getElementById("btnCopyUrl");
  const btnCopyCode = document.getElementById("btnCopyCode");
  const playerMenuEl = document.getElementById("playerMenu");
  const playerMenuTitleEl = document.getElementById("playerMenuTitle");
  const kickReasonInput = document.getElementById("kickReason");
  const btnKick = document.getElementById("btnKick");
  const btnClosePlayerMenu = document.getElementById("btnClosePlayerMenu");
  const kickedOverlayEl = document.getElementById("kickedOverlay");
  const kickedMessageEl = document.getElementById("kickedMessage");
  const btnKickedOk = document.getElementById("btnKickedOk");

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

  function getPlayerName() {
    return (playerNameInput.value || "Player").trim().slice(0, 20) || "Player";
  }

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function setBusy(busy) {
    btnSolo.disabled = busy;
    btnJoin.disabled = busy;
    btnCreate.disabled = busy;
  }

  function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
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
      players.set(p.id, { ...p });
      if (p.id === selfId) localPlayer = players.get(p.id);
    }
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
      case "kicked":
        break;
    }
  }

  function onHostConnection(conn) {
    guestConns.push(conn);
    peerToConn.set(conn.peer, conn);

    conn.on("data", (data) => {
      if (data.type === "join") {
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
        };
        players.set(player.id, player);
        conn.send({
          type: "state",
          youId: player.id,
          players: allPlayers(),
        });
        broadcast({ type: "playerJoined", player }, conn);
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
      const nameW = ctx.measureText(p.name).width;
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
    if (keys["w"] || keys["arrowup"]) dy -= SPEED;
    if (keys["s"] || keys["arrowdown"]) dy += SPEED;
    if (keys["a"] || keys["arrowleft"]) dx -= SPEED;
    if (keys["d"] || keys["arrowright"]) dx += SPEED;
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
    conn.send({ type: "join", name: getPlayerName() });

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

  btnKick.addEventListener("click", () => {
    if (!menuTargetPlayer) return;
    kickPlayer(menuTargetPlayer.id, kickReasonInput.value);
  });

  btnClosePlayerMenu.addEventListener("click", closePlayerMenu);

  playerMenuEl.addEventListener("click", (e) => {
    if (e.target === playerMenuEl) closePlayerMenu();
  });

  btnKickedOk.addEventListener("click", () => {
    hideKickedOverlay();
    showMenu();
  });

  canvas.addEventListener("click", (e) => {
    if (!isP1()) return;
    if (!playerMenuEl.classList.contains("hidden")) {
      closePlayerMenu();
      return;
    }
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const target = findClickedPlayer(x, y);
    if (target) openPlayerMenu(target);
  });

  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
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

  playerNameInput.focus();
})();
