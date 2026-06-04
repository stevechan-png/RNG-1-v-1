# Battle Ground

Pure static multiplayer — **only 3 files**:

- `index.html`
- `style.css`
- `game.js`

No install, no server, no `npm`. Open `index.html` or host on **GitHub Pages**.

## Play

1. Open the game (double-click `index.html` or your GitHub Pages URL).
2. **Create Room** → share the link or 6-digit code.
3. Friends open the same link, enter the code, **Join Game**.
4. **WASD** to move.

| Player | Color  |
|--------|--------|
| P1     | Red    |
| P2     | Blue   |
| P3     | Green  |
| P4     | Yellow |
| P5     | Purple |

## GitHub Pages

Deploy **only** these files from the repo root (not the old `Zip/` folder):

- `index.html`
- `style.css`
- `game.js`
- `.nojekyll`

### Option A — GitHub Actions (recommended)

1. Push the repo (including `.github/workflows/pages.yml`).
2. **Settings → Pages → Build and deployment → Source:** **GitHub Actions**.
3. After the workflow runs, open your Pages URL.

### Option B — Branch deploy

1. Push the 4 files above to branch `main`.
2. **Settings → Pages → Source:** Deploy from branch `main`, folder **`/ (root)`** (not `/docs`).

Share: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### If the site “does nothing” on GitHub

- **Hard refresh** (Ctrl+F5) so the browser loads the latest `game.js`.
- `index.html` and `game.js` must be from the **same** version (old HTML + new JS breaks the menu).
- Open the browser console (F12). If you see errors about `addEventListener` on `null`, replace `index.html` with the current one from this repo.
- **Create Room** needs the PeerJS script (CDN). Ad blockers or school networks sometimes block it — try **Play Solo** first; if Solo works but Create Room fails, it is usually PeerJS/network.
- Multiplayer uses the free [PeerJS](https://peerjs.com) cloud (`0.peerjs.com`). It can be slow or down; wait and retry, or play Solo.

No API keys required.
