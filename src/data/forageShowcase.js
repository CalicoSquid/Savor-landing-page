// src/data/forageShowcase.js
// Real content for the Caper marketing page's interactive pieces.
// Species names, parts, flavours and safety flags are drawn from the app's
// own PFAF-sourced data; the four-season model mirrors src/lib/seasons.js in
// the app (Spring = wild garlic, Summer = herbs, Autumn = mushrooms/harvest,
// Winter = berries & bark). Curated per season for believable, on-brand
// discovery — not the full 893, just a taste that changes as you explore.

export const SEASONS = [
  {
    key: 'spring',
    label: 'Spring',
    chip: 'Wild garlic season',
    months: 'Mar – May',
    bg: '/caper/seasons/spring.webp',
    accent: '#5A8A5A',
    species: [
      { name: 'Wild Garlic',    sci: 'Allium ursinum',      parts: ['Leaves', 'Flowers'], flavour: 'Pungent, garlicky', rating: 5, kind: 'herb',   note: false },
      { name: 'Stinging Nettle', sci: 'Urtica dioica',        parts: ['Shoots', 'Leaves'],  flavour: 'Earthy, green',    rating: 4, kind: 'herb',   note: true },
      { name: 'Dandelion',      sci: 'Taraxacum officinale', parts: ['Leaves', 'Root'],    flavour: 'Bitter',           rating: 4, kind: 'herb',   note: true },
      { name: 'Wild Sorrel',    sci: 'Rumex acetosa',        parts: ['Leaves'],            flavour: 'Sharp, lemony',    rating: 4, kind: 'herb',   note: true },
      { name: 'Chickweed',      sci: 'Stellaria media',      parts: ['Leaves', 'Shoots'],  flavour: 'Mild, fresh',      rating: 4, kind: 'herb',   note: false },
    ],
  },
  {
    key: 'summer',
    label: 'Summer',
    chip: 'Herb season',
    months: 'Jun – Aug',
    bg: '/caper/seasons/summer.webp',
    accent: '#C99A2E',
    species: [
      { name: 'Wild Fennel',   sci: 'Foeniculum vulgare',  parts: ['Leaves', 'Seed'],    flavour: 'Aniseed',       rating: 4, kind: 'herb',   note: true },
      { name: 'Wild Thyme',    sci: 'Thymus serpyllum',    parts: ['Leaves'],            flavour: 'Aromatic',      rating: 4, kind: 'herb',   note: false },
      { name: 'Elderflower',   sci: 'Sambucus nigra',      parts: ['Flowers'],           flavour: 'Sweet, floral', rating: 4, kind: 'flower', note: true },
      { name: 'Marsh Mallow',  sci: 'Althaea officinalis', parts: ['Leaves', 'Root'],    flavour: 'Mild, sweet',   rating: 4, kind: 'root',   note: true },
      { name: 'Borage',        sci: 'Borago officinalis',  parts: ['Flowers', 'Leaves'], flavour: 'Cucumber',      rating: 4, kind: 'flower', note: false },
    ],
  },
  {
    key: 'autumn',
    label: 'Autumn',
    chip: 'Harvest season',
    months: 'Sep – Nov',
    bg: '/caper/seasons/autumn.webp',
    accent: '#B5651D',
    species: [
      { name: 'Blackberry',      sci: 'Rubus fruticosus',   parts: ['Fruit'],          flavour: 'Sweet, tart',   rating: 5, kind: 'berry', note: false },
      { name: 'Sweet Chestnut',  sci: 'Castanea sativa',    parts: ['Seed'],           flavour: 'Sweet, rich',   rating: 5, kind: 'nut',   note: false },
      { name: 'Common Hazel',    sci: 'Corylus avellana',   parts: ['Seed'],           flavour: 'Sweet, rich',   rating: 5, kind: 'nut',   note: false },
      { name: 'Hawthorn',        sci: 'Crataegus monogyna', parts: ['Fruit'],          flavour: 'Sweet, acid',   rating: 4, kind: 'berry', note: false },
      { name: 'Elderberry',      sci: 'Sambucus nigra',     parts: ['Fruit'],          flavour: 'Sharp, deep',   rating: 4, kind: 'berry', note: true },
    ],
  },
  {
    key: 'winter',
    label: 'Winter',
    chip: 'Berry & bark season',
    months: 'Dec – Feb',
    bg: '/caper/seasons/winter.webp',
    accent: '#5A7D8A',
    species: [
      { name: 'Rosehip',      sci: 'Rosa canina',        parts: ['Fruit'],          flavour: 'Tart, fruity', rating: 4, kind: 'berry', note: true },
      { name: 'Sloe',         sci: 'Prunus spinosa',     parts: ['Fruit'],          flavour: 'Astringent',   rating: 4, kind: 'berry', note: true },
      { name: 'Juniper',      sci: 'Juniperus communis', parts: ['Fruit'],          flavour: 'Resinous',     rating: 4, kind: 'berry', note: true },
      { name: 'Scots Pine',   sci: 'Pinus sylvestris',   parts: ['Shoots', 'Bark'], flavour: 'Resinous, citric', rating: 4, kind: 'tree', note: false },
      { name: 'Sea Beet',     sci: 'Beta vulgaris',      parts: ['Leaves'],         flavour: 'Like spinach', rating: 4, kind: 'herb',  note: false },
    ],
  },
]

// Colours per edible "kind" — mirrors the app's category medallion palette.
export const KIND_COLOR = {
  herb:   '#3D6B4F',
  berry:  '#7D2020',
  flower: '#4A3570',
  root:   '#6B4C2A',
  nut:    '#5C3D1E',
  tree:   '#2E3D2E',
}

// A representative slice of the app's real 50-badge system, one per flavour
// of achievement, for the collectible wall. `icon` keys map to inline SVG
// paths defined in the BadgeWall component.
export const BADGES = [
  { id: 'first_foray',    name: 'First Foray',      desc: 'Log your very first wild find.',        icon: 'sprout',   color: '#7AA36B', cat: 'Milestones' },
  { id: 'seasoned',       name: 'Seasoned Forager', desc: '50 species found and logged.',          icon: 'path',     color: '#3D6B4F', cat: 'Milestones' },
  { id: 'legend',         name: 'Foraging Legend',  desc: '175 species. Legendary.',               icon: 'trophy',   color: '#2E5522', cat: 'Milestones' },
  { id: 'berry',          name: 'Fruit of the Forest', desc: 'Log your first wild fruit or berry.', icon: 'apple',   color: '#7D2020', cat: 'By Kind' },
  { id: 'greens',         name: 'Wild Greens',      desc: 'Gather your first edible leaf or herb.', icon: 'leaf',     color: '#2E5522', cat: 'By Kind' },
  { id: 'bloom',          name: 'In Bloom',         desc: 'Log your first edible flower.',          icon: 'flower',   color: '#4A3570', cat: 'By Kind' },
  { id: 'spring',         name: 'Spring Awakening', desc: 'Log a find in spring.',                  icon: 'tulip',    color: '#7AA36B', cat: 'Seasonal' },
  { id: 'summer',         name: 'Summer Abundance', desc: 'Log a find in summer.',                  icon: 'sun',      color: '#C99A2E', cat: 'Seasonal' },
  { id: 'autumn',         name: 'Autumn Harvest',   desc: 'Log a find in autumn.',                  icon: 'maple',    color: '#B5651D', cat: 'Seasonal' },
  { id: 'winter',         name: 'Winter Forager',   desc: 'Find something edible in winter.',       icon: 'snow',     color: '#5A7D8A', cat: 'Seasonal' },
  { id: 'topshelf',       name: 'Top Shelf',        desc: 'Log 5 top-rated edible species.',        icon: 'star',     color: '#C9A227', cat: 'Quality' },
  { id: 'safety',         name: 'Safety First',     desc: 'Log a species with a known lookalike.',  icon: 'shield',   color: '#B5651D', cat: 'Quality' },
  { id: 'flame',          name: 'First Flame',      desc: 'Mark your first recipe as cooked.',      icon: 'fire',     color: '#B5651D', cat: 'Campfire' },
  { id: 'campchef',       name: 'Camp Chef',        desc: 'Cook 10 wild recipes.',                  icon: 'chef',     color: '#9C4A1A', cat: 'Campfire' },
  { id: 'habitat',        name: 'Habitat Explorer', desc: 'Forage in three different habitats.',    icon: 'map',      color: '#4F7D5A', cat: 'Habitat' },
  { id: 'yearround',      name: 'Year Rounder',     desc: 'Log finds in all four seasons.',         icon: 'calendar', color: '#3D6B4F', cat: 'Seasonal' },
]