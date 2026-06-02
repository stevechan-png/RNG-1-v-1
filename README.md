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

1. Push these 3 files to a GitHub repo.
2. **Settings → Pages → Source:** Deploy from branch `main`, folder `/ (root)`.
3. Share your `https://username.github.io/repo-name/` link.

Multiplayer uses the free [PeerJS](https://peerjs.com) cloud to connect players — no API keys required.
