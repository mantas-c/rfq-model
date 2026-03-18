<template>
  <div class="bg-gray-50 min-h-screen">
    <CatalogFilterDrawer
      v-model="drawerOpen"
      :filters="filters"
      @update:filters="filters = $event"
      @reset="resetFilters"
    />

    <!-- Page header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-end justify-between">
          <div>
            <nav class="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <a href="/" class="hover:text-gray-700 transition-colors">Pagrindinis</a>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <span class="text-gray-600 font-medium">Katalogas</span>
            </nav>
            <h1 class="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Dalių katalogas</h1>
            <p class="text-sm text-gray-500 mt-1">12,400+ dalių iš patikimų Europos pardavėjų</p>
          </div>
          <!-- Quick filters -->
          <div class="hidden sm:flex items-center gap-2">
            <span class="text-xs text-gray-400 font-medium">Populiaru:</span>
            <a v-for="tag in quickTags" :key="tag" href="#"
              class="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors">
              {{ tag }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      <!-- Top bar -->
      <CatalogTopBar
        :total-count="filteredListings.length"
        :sort="sort"
        :view="view"
        :chips="activeChips"
        :active-filter-count="activeChips.length"
        :active-category="filters.category || undefined"
        @update:sort="sort = $event"
        @update:view="view = $event"
        @open-drawer="drawerOpen = true"
        @remove-filter="removeFilter"
        @clear-all="resetFilters"
      />

      <div class="flex gap-6 lg:gap-8 mt-6">

        <!-- Sidebar (desktop) -->
        <aside class="hidden lg:block w-72 flex-shrink-0">
          <div class="sticky top-20">
            <CatalogFilterSidebar
              :filters="filters"
              @update:filters="filters = $event"
              @reset="resetFilters"
            />
          </div>
        </aside>

        <!-- Listings -->
        <main class="flex-1 min-w-0">

          <!-- Grid view -->
          <div v-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            <CatalogListingCard
              v-for="listing in paginatedListings"
              :key="listing.id"
              :listing="listing"
            />
          </div>

          <!-- List view -->
          <div v-else class="space-y-3">
            <CatalogListingRow
              v-for="listing in paginatedListings"
              :key="listing.id"
              :listing="listing"
            />
          </div>

          <!-- Empty state -->
          <CatalogEmptyState v-if="filteredListings.length === 0" @clear="resetFilters" />

          <!-- Infinite scroll sentinel -->
          <div ref="sentinel" class="py-8 flex justify-center">
            <div v-if="visibleCount < filteredListings.length" class="flex items-center gap-2 text-sm text-gray-400">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Kraunama...
            </div>
            <div v-else-if="filteredListings.length > 0" class="text-xs text-gray-300">
              Rodyti visi {{ filteredListings.length }} rezultatai
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filters, Listing } from '~/types/catalog'

useHead({ title: 'Katalogas — dalys.lt' })

const quickTags = ['BMW', 'Mercedes', 'Kėbulo dalys', 'Žibintai', 'Variklio dalys']

const PER_PAGE = 12
const drawerOpen = ref(false)
const sort = ref('newest')
const view = ref<'grid' | 'list'>('grid')
const visibleCount = ref(PER_PAGE)
const sentinel = ref<HTMLElement | null>(null)

const defaultFilters = (): Filters => ({
  vehicleType: 'car',
  make: '',
  model: '',
  generation: '',
  category: '',
  priceMin: 0,
  priceMax: 2000,
  conditions: ['A', 'B', 'C'],
  countries: [],
  q: '',
})

const filters = ref<Filters>(defaultFilters())

function resetFilters() {
  filters.value = defaultFilters()
  page.value = 1
}

function removeFilter(key: string) {
  const f = { ...filters.value }
  if (key === 'make') { f.make = ''; f.model = ''; f.generation = '' }
  else if (key === 'model') { f.model = ''; f.generation = '' }
  else if (key === 'generation') f.generation = ''
  else if (key === 'category') f.category = ''
  else if (key === 'price') { f.priceMin = 0; f.priceMax = 2000 }
  else if (key.startsWith('cond_')) f.conditions = ['A', 'B', 'C']
  else if (key.startsWith('country_')) f.countries = f.countries.filter(c => c !== key.replace('country_', ''))
  filters.value = f
  page.value = 1
}

const activeChips = computed(() => {
  const chips: { key: string; label: string }[] = []
  const f = filters.value
  if (f.make) chips.push({ key: 'make', label: f.make })
  if (f.model) chips.push({ key: 'model', label: f.model })
  if (f.generation) chips.push({ key: 'generation', label: f.generation })
  if (f.category) chips.push({ key: 'category', label: f.category })
  if (f.priceMin > 0 || f.priceMax < 2000) chips.push({ key: 'price', label: `${f.priceMin}–${f.priceMax} €` })
  if (f.conditions.length < 3) {
    const missing = ['A','B','C'].filter(c => !f.conditions.includes(c))
    missing.forEach(m => chips.push({ key: `cond_${m}`, label: `Ne Grade ${m}` }))
  }
  f.countries.forEach(c => {
    const names: Record<string,string> = { DE:'Vokietija', LT:'Lietuva', PL:'Lenkija', LV:'Latvija', EE:'Estija', FR:'Prancūzija', NL:'Olandija' }
    chips.push({ key: `country_${c}`, label: names[c] ?? c })
  })
  return chips
})

// Reset visible count when filters change
watch(filters, () => { visibleCount.value = PER_PAGE }, { deep: true })

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && visibleCount.value < filteredListings.value.length) {
      setTimeout(() => { visibleCount.value += PER_PAGE }, 400)
    }
  }, { rootMargin: '200px' })
  if (sentinel.value) observer.observe(sentinel.value)
  onUnmounted(() => observer.disconnect())
})

// --- Mock data ---
const allListings: Listing[] = [
  { id: 1,  code: '11127553456',  name: 'BMW E60 Variklio Dangtis',                   icon: '🔧', condition: 'A', status: 'Sandėlyje',  price: '85€',   priceNum: 85,   tags: ['BMW', 'E60', '5 serija (2003–2010)'],              country: 'DE', flag: '🇩🇪', city: 'Berlynas',    delivery: '2–4 d.d.', year: 2006, body: 'Sedanas',     engine: '2.5 l', power: '177 kW', fuel: 'Benzinas',  gearbox: 'Automatinė',  drive: 'Užpakaliniai varantieji', category: 'Variklio dalys' },
  { id: 2,  code: '2109010247',   name: 'Mercedes W210 Priekinis Bamperis',            icon: '🚗', condition: 'B', status: 'Sandėlyje',  price: '210€',  priceNum: 210,  tags: ['Mercedes', 'W210', 'E klasė (1995–2003)'],         country: 'LT', flag: '🇱🇹', city: 'Vilnius',     delivery: '1–2 d.d.', year: 2001, body: 'Universalas', engine: '2.2 l', power: '105 kW', fuel: 'Dyzelinas', gearbox: 'Mechaninė',   drive: 'Užpakaliniai varantieji', category: 'Kėbulo dalys' },
  { id: 3,  code: '8N0823029',    name: 'Audi A4 Kapotas',                             icon: '🚗', condition: 'A', status: 'Sandėlyje',  price: '240€',  priceNum: 240,  originalPrice: '290€', tags: ['Audi', 'A4', 'B6 (2001–2004)'],               country: 'DE', flag: '🇩🇪', city: 'Hamburgas',   delivery: '2–4 d.d.', year: 2003, body: 'Sedanas',     engine: '1.9 l', power: '96 kW',  fuel: 'Dyzelinas', gearbox: 'Mechaninė',   drive: 'Priekiniai varantieji',   category: 'Kėbulo dalys' },
  { id: 4,  code: '4F0959643',    name: 'Audi A6 C6 Žibintas Kairys',                 icon: '💡', condition: 'B', status: 'Sandėlyje',  price: '320€',  priceNum: 320,  tags: ['Audi', 'A6', 'C6 (2004–2011)'],                   country: 'PL', flag: '🇵🇱', city: 'Varšuva',     delivery: '3–5 d.d.', year: 2007, body: 'Universalas', engine: '2.0 l', power: '103 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Priekiniai varantieji',   category: 'Žibintai ir optika' },
  { id: 5,  code: '1K5945093',    name: 'VW Golf V Galinis Žibintas',                  icon: '💡', condition: 'A', status: 'Sandėlyje',  price: '95€',   priceNum: 95,   tags: ['VW', 'Golf', 'V (2003–2008)'],                     country: 'LT', flag: '🇱🇹', city: 'Kaunas',      delivery: '1–2 d.d.', year: 2005, body: 'Hečbekas',    engine: '1.6 l', power: '75 kW',  fuel: 'Benzinas',  gearbox: 'Mechaninė',   drive: 'Priekiniai varantieji',   category: 'Žibintai ir optika' },
  { id: 6,  code: '30748021',     name: 'Volvo XC60 Stabdžių Diskas',                  icon: '🛑', condition: 'B', status: 'Sandėlyje',  price: '180€',  priceNum: 180,  tags: ['Volvo', 'XC60', 'I (2008–2017)'],                  country: 'LV', flag: '🇱🇻', city: 'Ryga',        delivery: '2–3 d.d.', year: 2012, body: 'Visureivis',  engine: '2.4 l', power: '136 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Stabdžių sistema' },
  { id: 7,  code: 'LR019608',     name: 'Land Rover Freelander Pavarų Dėžė',           icon: '⚙️', condition: 'C', status: 'Sandėlyje',  price: '890€',  priceNum: 890,  tags: ['Land Rover', 'Freelander', '2 (2006–2014)'],       country: 'DE', flag: '🇩🇪', city: 'Miunchenas',  delivery: '3–5 d.d.', year: 2009, body: 'Visureivis',  engine: '2.2 l', power: '112 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Transmisija' },
  { id: 8,  code: 'A6395420119',  name: 'Mercedes C W203 Kondicionierius',             icon: '❄️', condition: 'B', status: 'Rezervuota', price: '260€',  priceNum: 260,  tags: ['Mercedes', 'C klasė', 'W203 (2000–2007)'],         country: 'FR', flag: '🇫🇷', city: 'Paryžius',    delivery: '4–6 d.d.', year: 2004, body: 'Sedanas',     engine: '1.8 l', power: '105 kW', fuel: 'Benzinas',  gearbox: 'Mechaninė',   drive: 'Užpakaliniai varantieji', category: 'Kondicionierius' },
  { id: 9,  code: '7L6853677',    name: 'VW Touareg Priekiniai Žibintai',              icon: '💡', condition: 'A', status: 'Sandėlyje',  price: '450€',  priceNum: 450,  originalPrice: '520€', tags: ['VW', 'Touareg', '7L (2002–2010)'],             country: 'NL', flag: '🇳🇱', city: 'Amsterdamas', delivery: '3–5 d.d.', year: 2007, body: 'Visureivis',  engine: '3.0 l', power: '165 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Žibintai ir optika' },
  { id: 10, code: 'N52-11127',    name: 'BMW N52 Cilindro Galva',                      icon: '🔧', condition: 'B', status: 'Sandėlyje',  price: '540€',  priceNum: 540,  tags: ['BMW', 'N52', '3 serija E90 (2005–2012)'],          country: 'DE', flag: '🇩🇪', city: 'Štutgartas',  delivery: '2–4 d.d.', year: 2008, body: 'Sedanas',     engine: '2.5 l', power: '160 kW', fuel: 'Benzinas',  gearbox: 'Mechaninė',   drive: 'Užpakaliniai varantieji', category: 'Variklio dalys' },
  { id: 11, code: 'OP-13151777',  name: 'Opel Astra H Variklio Dangtis',               icon: '🔧', condition: 'A', status: 'Sandėlyje',  price: '65€',   priceNum: 65,   tags: ['Opel', 'Astra', 'H (2004–2009)'],                  country: 'PL', flag: '🇵🇱', city: 'Krokuva',     delivery: '3–5 d.d.', year: 2006, body: 'Hečbekas',    engine: '1.6 l', power: '85 kW',  fuel: 'Benzinas',  gearbox: 'Mechaninė',   drive: 'Priekiniai varantieji',   category: 'Kėbulo dalys' },
  { id: 12, code: 'FO-1367415',   name: 'Ford Focus III Priekinis Sparnas',             icon: '🚗', condition: 'C', status: 'Sandėlyje',  price: '120€',  priceNum: 120,  tags: ['Ford', 'Focus', 'III (2011–2018)'],                country: 'EE', flag: '🇪🇪', city: 'Talinas',     delivery: '3–4 d.d.', year: 2014, body: 'Universalas', engine: '1.6 l', power: '77 kW',  fuel: 'Dyzelinas', gearbox: 'Mechaninė',   drive: 'Priekiniai varantieji',   category: 'Kėbulo dalys' },
  { id: 13, code: 'RE-7701208',   name: 'Renault Megane III Variklis 1.5 dCi',         icon: '🔧', condition: 'B', status: 'Sandėlyje',  price: '1200€', priceNum: 1200, tags: ['Renault', 'Megane', 'III (2008–2016)'],            country: 'FR', flag: '🇫🇷', city: 'Lionas',      delivery: '5–7 d.d.', year: 2011, body: 'Hečbekas',    engine: '1.5 l', power: '81 kW',  fuel: 'Dyzelinas', gearbox: 'Mechaninė',   drive: 'Priekiniai varantieji',   category: 'Variklio dalys' },
  { id: 14, code: 'TO-4851031',   name: 'Toyota RAV4 2.0 Priekinė Ašis',              icon: '⚙️', condition: 'A', status: 'Sandėlyje',  price: '380€',  priceNum: 380,  tags: ['Toyota', 'RAV4', 'XA30 (2006–2012)'],              country: 'LT', flag: '🇱🇹', city: 'Kaunas',      delivery: '1–2 d.d.', year: 2009, body: 'Visureivis',  engine: '2.0 l', power: '112 kW', fuel: 'Benzinas',  gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Transmisija' },
  { id: 15, code: 'MB-2049062',   name: 'Mercedes E W212 Salonas',                     icon: '🪑', condition: 'A', status: 'Sandėlyje',  price: '650€',  priceNum: 650,  originalPrice: '750€', tags: ['Mercedes', 'E klasė', 'W212 (2009–2016)'],     country: 'DE', flag: '🇩🇪', city: 'Frankfurtas', delivery: '2–4 d.d.', year: 2013, body: 'Universalas', engine: '2.2 l', power: '125 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Užpakaliniai varantieji', category: 'Salonas' },
  { id: 16, code: 'VV-31272720',  name: 'Volvo V90 Galinis Bamperis',                  icon: '🚗', condition: 'B', status: 'Sandėlyje',  price: '290€',  priceNum: 290,  tags: ['Volvo', 'V90', 'II (2016–2023)'],                  country: 'LV', flag: '🇱🇻', city: 'Ryga',        delivery: '2–3 d.d.', year: 2018, body: 'Universalas', engine: '2.0 l', power: '140 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Kėbulo dalys' },
  { id: 17, code: 'BM-63117182',  name: 'BMW F10 ECU Valdymo Blokas',                  icon: '🔌', condition: 'A', status: 'Parduota',   price: '320€',  priceNum: 320,  tags: ['BMW', 'F10', '5 serija (2010–2017)'],              country: 'DE', flag: '🇩🇪', city: 'Berlynas',    delivery: '2–4 d.d.', year: 2014, body: 'Sedanas',     engine: '2.0 l', power: '135 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Užpakaliniai varantieji', category: 'Elektrika' },
  { id: 18, code: 'HO-5019380',   name: 'Honda CR-V III Priekinis Bamperis',            icon: '🚗', condition: 'B', status: 'Sandėlyje',  price: '175€',  priceNum: 175,  tags: ['Honda', 'CR-V', 'III (2006–2012)'],                country: 'NL', flag: '🇳🇱', city: 'Utrechtas',   delivery: '3–5 d.d.', year: 2009, body: 'Visureivis',  engine: '2.0 l', power: '110 kW', fuel: 'Benzinas',  gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Kėbulo dalys' },
  { id: 19, code: 'PE-7417621',   name: 'Peugeot 308 II Priekiniai Stabdžiai',         icon: '🛑', condition: 'A', status: 'Sandėlyje',  price: '95€',   priceNum: 95,   tags: ['Peugeot', '308', 'II (2013–2021)'],                country: 'FR', flag: '🇫🇷', city: 'Marselis',    delivery: '4–6 d.d.', year: 2016, body: 'Hečbekas',    engine: '1.6 l', power: '88 kW',  fuel: 'Dyzelinas', gearbox: 'Mechaninė',   drive: 'Priekiniai varantieji',   category: 'Stabdžių sistema' },
  { id: 20, code: 'AU-4H0260805', name: 'Audi A8 D4 Turbina',                          icon: '🔧', condition: 'C', status: 'Sandėlyje',  price: '780€',  priceNum: 780,  tags: ['Audi', 'A8', 'D4 (2010–2018)'],                   country: 'DE', flag: '🇩🇪', city: 'Diuseldorfas',delivery: '2–4 d.d.', year: 2012, body: 'Sedanas',     engine: '3.0 l', power: '184 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Variklio dalys' },
  { id: 21, code: 'MB-A2049064',  name: 'Mercedes GLC X253 Kairys Sparnas',            icon: '🚗', condition: 'A', status: 'Sandėlyje',  price: '420€',  priceNum: 420,  originalPrice: '480€', tags: ['Mercedes', 'GLC', 'X253 (2015–2022)'],         country: 'LT', flag: '🇱🇹', city: 'Klaipėda',    delivery: '1–2 d.d.', year: 2019, body: 'Visureivis',  engine: '2.0 l', power: '135 kW', fuel: 'Benzinas',  gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Kėbulo dalys' },
  { id: 22, code: 'VW-5Q0615301', name: 'VW Passat B8 Stabdžių Diskai',                icon: '🛑', condition: 'B', status: 'Sandėlyje',  price: '140€',  priceNum: 140,  tags: ['VW', 'Passat', 'B8 (2014–2023)'],                  country: 'PL', flag: '🇵🇱', city: 'Gdanskas',    delivery: '3–5 d.d.', year: 2017, body: 'Universalas', engine: '2.0 l', power: '110 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Priekiniai varantieji',   category: 'Stabdžių sistema' },
  { id: 23, code: 'FO-2250742',   name: 'Ford Mondeo V Priekiniai Žibintai',            icon: '💡', condition: 'A', status: 'Sandėlyje',  price: '310€',  priceNum: 310,  tags: ['Ford', 'Mondeo', 'V (2014–2022)'],                 country: 'EE', flag: '🇪🇪', city: 'Talinas',     delivery: '3–4 d.d.', year: 2016, body: 'Universalas', engine: '2.0 l', power: '132 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Priekiniai varantieji',   category: 'Žibintai ir optika' },
  { id: 24, code: 'BM-61357188',  name: 'BMW X5 E70 Starteris',                        icon: '🔌', condition: 'B', status: 'Sandėlyje',  price: '230€',  priceNum: 230,  tags: ['BMW', 'X5', 'E70 (2006–2013)'],                    country: 'DE', flag: '🇩🇪', city: 'Kelnas',      delivery: '2–4 d.d.', year: 2010, body: 'Visureivis',  engine: '3.0 l', power: '173 kW', fuel: 'Dyzelinas', gearbox: 'Automatinė',  drive: 'Visų ratų pavara',        category: 'Elektrika' },
]

// Filtering
const filteredListings = computed(() => {
  let list = [...allListings]
  const f = filters.value

  if (f.make) list = list.filter(l => l.tags.some(t => t.toLowerCase().includes(f.make.toLowerCase())))
  if (f.category) list = list.filter(l => l.category === f.category)
  if (f.priceMin > 0) list = list.filter(l => l.priceNum >= f.priceMin)
  if (f.priceMax < 2000) list = list.filter(l => l.priceNum <= f.priceMax)
  if (f.conditions.length < 3) list = list.filter(l => f.conditions.includes(l.condition))
  if (f.countries.length > 0) list = list.filter(l => f.countries.includes(l.country))
  if (f.q) list = list.filter(l => l.name.toLowerCase().includes(f.q.toLowerCase()) || l.code.toLowerCase().includes(f.q.toLowerCase()))

  // Sort
  if (sort.value === 'price_asc') list.sort((a, b) => a.priceNum - b.priceNum)
  else if (sort.value === 'price_desc') list.sort((a, b) => b.priceNum - a.priceNum)

  return list
})

const paginatedListings = computed(() => filteredListings.value.slice(0, visibleCount.value))
</script>
