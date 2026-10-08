import wallpaperUrl from '../assets/wallpaper.webp'

/* INFO: The wallpaper is the only large asset in the UI. It is "Anime Sky Meadow" by 防人 from
         wall.alphacoders.com (personal use only, see webui/README.md). Replacing the file in
         src/assets is enough to change the look. */
export function Wallpaper({ local = false }) {
  return (
    <div
      className={local ? 'wallpaper is-local' : 'wallpaper'}
      style={{ backgroundImage: `url("${wallpaperUrl}")` }}
      aria-hidden='true'
    >
      <div className='wallpaper-veil' />
    </div>
  )
}
