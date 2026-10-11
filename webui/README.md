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
| `public/lang/` | Crowdin translations, with background credits added in English and Chinese |

## Compatibility notes

- All URLs are relative (`base: './'`). KernelSU and WebUI X serve the module from a virtual origin.
- The UI uses `window.ksu` (`exec`, `fullScreen`). Without it, `src/lib/devMock.js` answers the commands.
- Storage keys are unchanged: `/ReZygisk/theme` and `/ReZygisk/webui_config`. The language is read from `/ReZygisk/language`, falling back to the old `/TreatWheel/language`.
- Translation keys keep their layout (`pages.*`, `globals.*`). Missing keys fall back to `en_US`. Two key spellings are intentional (`notAvaliable`, `orginalDevelopers`); see the comments in the code.
- Output targets WebView with ES2017 syntax. `queueMicrotask` is polyfilled for older WebViews.
- Links leave the WebUI only as `https://github.com/...`, through an Android intent (`am start`). Any other host is refused.
- The monitor controls use the same verbs as the C ptracer: `start`, `stop` (pause) and `exit`.

## Assets

- Animated background: [Vanta Waves](https://github.com/tengbao/vanta), Vanta 0.5.24,
  Copyright 2020 Teng Bao, rendered with [Three.js](https://github.com/mrdoob/three.js)
  0.134.0, Copyright 2010–2021 three.js authors. Both use the **MIT License**, which
  permits embedding, modification and public redistribution with the copyright and
  permission notices retained. Complete upstream notices are in
  `public/THIRD_PARTY_NOTICES.txt`, copied to `webroot/` and shown under Settings →
  Background licenses and attribution. Preserve that file when packaging a release.
  The animation and dependencies are bundled locally, with no runtime CDN requests.
  Light, dark and AMOLED have matching blue palettes; a static CSS gradient is used
  when WebGL is unavailable or the system requests reduced motion. The renderer is
  released while the document is hidden or its background is covered by a sub-page.
  The previous personal-use-only illustration has been removed.
- `src/components/materialIcons.js`: Material Symbols paths (Apache-2.0), taken from the
  icons the WebUI already shipped.
- `src/assets/fonts/poppins.ttf`: unchanged from the previous WebUI.
