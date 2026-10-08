import { materialIcons, MATERIAL_VIEWBOX } from './materialIcons.js'

/* INFO: Icons that the Material set above does not cover. Stroke icons use a 24-unit grid with
         a 2-unit stroke; fill icons are solid shapes. */
const CUSTOM_ICONS = {
  play: { kind: 'fill', paths: ['M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z'] },
  pause: { kind: 'fill', paths: ['M7 5h3.2v14H7zM13.8 5H17v14h-3.2z'] },
  stop: { kind: 'fill', paths: ['M7 6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 13.5z'] },
  refresh: { kind: 'stroke', paths: ['M19.5 12a7.5 7.5 0 1 1-2.2-5.3', 'M19.5 4.5v4.6h-4.6'] },
  chevron: { kind: 'stroke', paths: ['M9.5 6.5 15 12l-5.5 5.5'] },
  external: { kind: 'stroke', paths: ['M14 4.5h5.5V10', 'M19.5 4.5 11 13', 'M17.5 14v4.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1H10'] },
  palette: { kind: 'stroke', paths: ['M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-.9 1.9-1.8 0-.5-.2-.9-.2-1.4 0-.9.7-1.5 1.6-1.5h1.9a3.6 3.6 0 0 0 3.6-3.6C21.8 7 17.6 3.5 12 3.5Z', 'M7.5 11.5h.01', 'M9.5 7.5h.01', 'M14.5 7.5h.01'] },
  language: { kind: 'stroke', paths: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z', 'M3.5 12h17', 'M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5Z'] },
  fullscreen: { kind: 'stroke', paths: ['M4 9V4.5h4.5', 'M15.5 4.5H20V9', 'M20 15v4.5h-4.5', 'M8.5 19.5H4V15'] },
  font: { kind: 'stroke', paths: ['M4.5 18.5 9 6.5l4.5 12', 'M6.2 14.5h5.6', 'M15.5 11.5h4.5', 'M17.75 11.5v7'] },
  info: { kind: 'stroke', paths: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z', 'M12 11v5.5', 'M12 7.9h.01'] },
}

/* INFO: "variant" only matters for Material icons (outlined or filled). Unknown names render
         nothing, so a typo shows as a gap instead of breaking the page. */
export function Icon({ name, variant = 'outlined', className = '' }) {
  const material = materialIcons[name]

  if (material) {
    const paths = material[variant] || material.outlined

    return (
      <svg className={`icon ${className}`} viewBox={MATERIAL_VIEWBOX} fill='currentColor' aria-hidden='true' focusable='false'>
        {paths.map((d) => <path key={d} d={d} />)}
      </svg>
    )
  }

  const custom = CUSTOM_ICONS[name]
  if (!custom) return null

  const stroke = custom.kind === 'stroke'

  return (
    <svg
      className={`icon ${className}`}
      viewBox='0 0 24 24'
      fill={stroke ? 'none' : 'currentColor'}
      stroke={stroke ? 'currentColor' : 'none'}
      strokeWidth={stroke ? 2 : undefined}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'
    >
      {custom.paths.map((d) => <path key={d} d={d} />)}
    </svg>
  )
}
