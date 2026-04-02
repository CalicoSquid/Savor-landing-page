const GREEN = ['#2E7D32', '#4CAF50']

export const themes = [
  { name: 'Tangerine',   primary: '#FF6D00', secondary: '#FB8500', tertiary: '#E64A00', gradient: ['#FF5722', '#FF9800'], secondaryGradient: GREEN, tertiaryGradient: ['#E64A00', '#BF360C'] },
  { name: 'Watermelon',  primary: '#E53935', secondary: '#FF3B3F', tertiary: '#AD1457', gradient: ['#C62828', '#FF3B3F'], secondaryGradient: GREEN, tertiaryGradient: ['#AD1457', '#FF4081'] },
  { name: 'Nectarine',   primary: '#E8622A', secondary: '#FF7043', tertiary: '#C2185B', gradient: ['#BF360C', '#FF7043'], secondaryGradient: GREEN, tertiaryGradient: ['#880E4F', '#C2185B'] },
  { name: 'Grapefruit',  primary: '#E91D63', secondary: '#FF4081', tertiary: '#F9A825', gradient: ['#E91D63', '#FF5252'], secondaryGradient: GREEN, tertiaryGradient: ['#F57F17', '#F9A825'] },
  { name: 'Cranberry',   primary: '#880E0E', secondary: '#B22222', tertiary: '#546E7A', gradient: ['#B22222', '#DC143C'], secondaryGradient: GREEN, tertiaryGradient: ['#78909C', '#546E7A'] },
  { name: 'Lime',        primary: '#8BC34A', secondary: '#D4E157', tertiary: '#F9A825', gradient: ['#8BC34A', '#689F38'], secondaryGradient: GREEN, tertiaryGradient: ['#F57F17', '#F9A825'] },
  { name: 'Feijoa',      primary: '#00796B', secondary: '#00897B', tertiary: '#E91E63', gradient: ['#00897B', '#00ACC1'], secondaryGradient: GREEN, tertiaryGradient: ['#AD1457', '#E91E63'] },
  { name: 'Blueberry',   primary: '#3949AB', secondary: '#303F9F', tertiary: '#880E4F', gradient: ['#303F9F', '#5C6BC0'], secondaryGradient: GREEN, tertiaryGradient: ['#880E4F', '#C2185B'] },
  { name: 'Dragonfruit', primary: '#E91E8C', secondary: '#FF1493', tertiary: '#800080', gradient: ['#AD1457', '#FF1493'], secondaryGradient: GREEN, tertiaryGradient: ['#800080', '#6A0DAD'] },
  { name: 'Blackberry',  primary: '#6A1B9A', secondary: '#8B008B', tertiary: '#546E7A', gradient: ['#8B008B', '#9932CC'], secondaryGradient: GREEN, tertiaryGradient: ['#546E7A', '#37474F'] },
  { name: 'Plum',        primary: '#6A0F49', secondary: '#9C1D6A', tertiary: '#FF8F00', gradient: ['#6A0F49', '#9C1D6A'], secondaryGradient: GREEN, tertiaryGradient: ['#FF8F00', '#F9A825'] },
  { name: 'Coconut',     primary: '#6D4C41', secondary: '#795548', tertiary: '#78909C', gradient: ['#795548', '#6D4C41'], secondaryGradient: GREEN, tertiaryGradient: ['#78909C', '#B0BEC5'] },
]

export function applyTheme(theme) {
  const r = document.documentElement
  r.style.setProperty('--primary',     theme.primary)
  r.style.setProperty('--secondary',   theme.secondary)
  r.style.setProperty('--tertiary',    theme.tertiary)
  r.style.setProperty('--grad-1',      theme.gradient[0])
  r.style.setProperty('--grad-2',      theme.gradient[1])
  r.style.setProperty('--green-1',     theme.secondaryGradient[0])
  r.style.setProperty('--green-2',     theme.secondaryGradient[1])
  r.style.setProperty('--soil-1',      theme.tertiaryGradient[0])
  r.style.setProperty('--soil-2',      theme.tertiaryGradient[1])
  r.style.setProperty('--grad-fruit',  `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`)
  r.style.setProperty('--grad-header', `linear-gradient(90deg, ${theme.gradient[0]}, ${theme.gradient[1]})`)
  r.style.setProperty('--accent',      theme.primary)
}