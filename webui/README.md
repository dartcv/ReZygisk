# ReZygisk WebUI (React)

React + Vite implementation of the module WebUI. The source lives here. The build writes into
`../webroot/`, and that folder is what the module packages.

## Commands

```sh
cd webui
npm ci            # install (Node.js 20.19+ or 22.12+)
npm run dev       # desktop preview; without KernelSU a built-in mock answers the shell commands
npm run build     # writes ../webroot
```

From the repository root, `make webui` installs and builds, and `make all` packages the module.
`webroot/` is committed, so the module build itself needs no Node.js. After changing anything in
`webui/src`, run `make webui` and commit the regenerated `webroot/` with it.

## Layout

| Path | Purpose |
| ---- | ------- |
| `src/App.jsx` | Shell: the four tab pages (Home, Modules, Actions, Settings) and the sub-pages (language, theme) |
| `src/context/` | Preferences (theme, language, toggles, translator), status (state.json polling and monitor control), navigation, toasts |
| `src/lib/` | Logic with no UI: shell quoting, command table, state derivation, storage keys, i18n, KernelSU bridge, dev mock |
| `src/components/`, `src/pages/` | UI building blocks and page content |
| `src/styles/` | Design tokens for light, dark and AMOLED themes, then the layout and components |
| `public/lang/` | Crowdin translation files, copied unchanged |

## Compatibility notes

- All URLs are relative (`base: './'`). KernelSU and WebUI X serve the module from a virtual origin.
- The UI uses `window.ksu` (`exec`, `fullScreen`). Without it, `src/lib/devMock.js` answers the commands.
- Storage keys are unchanged: `/ReZygisk/theme` and `/ReZygisk/webui_config`. The language is read from `/ReZygisk/language`, falling back to the old `/TreatWheel/language`.
- Translation keys keep their layout (`pages.*`, `globals.*`). Missing keys fall back to `en_US`. Two key spellings are intentional (`notAvaliable`, `orginalDevelopers`); see the comments in the code.
- Output targets WebView with ES2017 syntax. `queueMicrotask` is polyfilled for older WebViews.
- Links leave the WebUI only as `https://github.com/...`, through an Android intent (`am start`). Any other host is refused.
- The monitor controls use the same verbs as the C ptracer: `start`, `stop` (pause) and `exit`.

## Assets

- `src/assets/wallpaper.webp`: "Anime Sky Meadow" by 防人, from
  https://wall.alphacoders.com/big.php?i=858291 (1920×1200). The site lists it as
  **free for private, personal use; contact the artist for any other use**. Before publishing
  a release, either get permission or replace the file with an image you are allowed to
  distribute. Keep the same file name, `wallpaper.webp`.
- `src/components/materialIcons.js`: Material Symbols paths (Apache-2.0), taken from the
  icons the WebUI already shipped.
- `src/assets/fonts/poppins.ttf`: unchanged from the previous WebUI.
