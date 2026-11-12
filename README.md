# TK Walcott 3D · R05

## Upload to GitHub

1. Download and **extract** the ZIP. Do not upload the ZIP itself.
2. Open the extracted `Walcott_GitHub_R05` folder.
3. Open https://github.com/leopluradontk/walcott-3d-model and choose **Add file → Upload files**.
4. Drag **all the files and the assets folder inside `Walcott_GitHub_R05`** into the upload area. Do not drag the outer `Walcott_GitHub_R05` folder itself. `index.html` must be at the repository root.
5. Replace the existing README if prompted. Enter `Upload Walcott R05 web app`, then click **Commit changes**.
6. Open **Settings → Pages**. Under Build and deployment, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
7. Wait for GitHub Pages to finish building. The intended address is:
   https://leopluradontk.github.io/walcott-3d-model/

If dragging folders fails, upload the loose root files first, then drag the `assets` folder in a second upload. Keep its name exactly `assets`. Files are split so each is below 10 MB; the original 62 MB standalone HTML is not needed in this repository.

## iPad and offline use

Open the published address in Safari. Open Controls and tap **Save for offline**. Wait for the complete-model message. Then use Share → Add to Home Screen. Open the Home Screen app online once and save there too. Test it in Airplane Mode, including phase detail and a component hologram. See `INSTALL.html` for full instructions.

The complete offline download is about 61 MB (the ZIP is about 47 MB). Offline storage depends on device space and browser storage retention. GitHub Pages serves the app over HTTPS. Double-clicking `index.html` locally will not load external model assets; use the published page or a local web server.

## Package contents

- `index.html` — model page and original R05 controls.
- `app.js` — bundled 3D engine and model interaction code, with geometry loaded on demand.
- `asset-loader.js` — model loading and offline-save controls.
- `assets/` — overview, geometry groups, original TK logo, and app icons.
- `manifest.webmanifest`, `sw.js`, `offline-files.json` — installation and offline support.
- `INSTALL.html` — iPad setup instructions.

Based on Walcott_3Phase_Interactive_R05.html. Source geometry, component data and original rendering controls are preserved. The original embedded link to a different hosted app is replaced by local installation instructions.
