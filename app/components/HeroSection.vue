<template>
  <section class="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">

    <!-- Background grid -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none"></div>

    <!-- Mobile: map as faded background -->
    <div class="absolute top-0 right-0 bottom-0 lg:hidden pointer-events-none overflow-hidden w-2/3 flex items-center justify-end">
      <img src="/europe-map.svg" alt="" class="w-full opacity-[0.06]" style="filter: grayscale(1) brightness(0.2); object-fit: contain;"/>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- ── TOP: two-column ── -->
      <div class="grid lg:grid-cols-2 gap-8 items-center py-16 sm:py-20">

        <!-- Left: Text + Search + Logos -->
        <div class="space-y-6 pb-20 lg:pb-0">

          <!-- Badge -->
          <div v-reveal="{ delay: 100 }" class="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
            7,5mln+ dalių iš Patikimų pardavėjų
          </div>

          <!-- Headline -->
          <div v-reveal="{ delay: 200 }">
            <h1 class="text-4xl sm:text-5xl xl:text-6xl font-black text-gray-950 leading-[1.05] tracking-tight">
              Naudotos<br>automobilių<br>dalys internetu iš
            </h1>
            <h1 class="text-4xl sm:text-5xl xl:text-6xl font-black text-brand-green leading-[1.05] tracking-tight mt-1">
              Patikimų pardavėjų.
            </h1>
          </div>

          <p v-reveal="{ delay: 300 }" class="text-base sm:text-lg text-gray-500 leading-relaxed max-w-md">
            Raskite originalias naudotas dalis iš patikimų pardavėjų visoje Europoje. Greitas pristatymas, saugi apmokėjimo sistema.
          </p>

          <!-- Search widget -->
          <div v-reveal="{ delay: 420, dir: 'scale' }" class="relative z-10">
            <SearchWidget />
          </div>

          <!-- VIN request link -->
          <div v-reveal="{ delay: 500 }" class="relative z-0 flex items-center justify-center gap-2 mt-3">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs text-gray-400">Nerandate reikiamos dalies?</span>
            <NuxtLink
              to="/vin-request"
              class="text-xs font-semibold underline underline-offset-2 decoration-dashed transition-colors"
              style="color: #14A34A;"
            >
              Siųskite VIN — ieškosime už jus
            </NuxtLink>
          </div>

        </div>

        <!-- Right: Europe Map — desktop only -->
        <div v-reveal="{ delay: 300, dir: 'left' }" class="relative hidden lg:block">
          <div class="relative" style="width: 660px; height: 700px;">
            <img
              src="/europe-map.svg"
              alt="Europe map"
              class="absolute"
              style="width:115%;height:115%;top:-7%;left:-7%;object-fit:contain;object-position:center;opacity:0.14;filter:grayscale(1) brightness(0.25);"
            />
            <!-- Lithuania pin -->
            <div class="absolute" style="left: 58%; top: 55%;">
              <div class="absolute pointer-events-none" style="left:-160px;top:-160px;width:320px;height:320px;">
                <div class="absolute w-full h-full rounded-full border-2 border-green-400 opacity-70 animate-ping" style="animation-duration:3.5s;"></div>
              </div>
              <div class="absolute pointer-events-none" style="left:-110px;top:-110px;width:220px;height:220px;">
                <div class="absolute w-full h-full rounded-full border-2 border-green-500 opacity-60 animate-ping" style="animation-duration:2.8s;animation-delay:0.7s;"></div>
              </div>
              <div class="absolute pointer-events-none" style="left:-65px;top:-65px;width:130px;height:130px;">
                <div class="absolute w-full h-full rounded-full border-2 border-green-500 opacity-50 animate-ping" style="animation-duration:2.1s;animation-delay:1.4s;"></div>
              </div>
              <button
                @click="navigateTo('/catalog')"
                class="absolute bg-brand-green hover:bg-brand-green-dark text-white rounded-full shadow-2xl shadow-green-400 ring-4 ring-white transition-all duration-200 hover:scale-110 active:scale-95 z-20 flex items-center justify-center"
                style="width:56px;height:56px;top:-28px;left:-28px;"
              >
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
            <!-- Live activity badge -->
            <div class="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1.5 shadow-md">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span class="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Gyvas</span>
            </div>

            <!-- Animated sale notifications -->
            <TransitionGroup name="sale" tag="div" class="absolute inset-0">
              <div
                v-for="sale in activeSales"
                :key="sale.id"
                class="absolute z-10 pointer-events-none"
                :style="{ left: sale.x + '%', top: sale.y + '%' }"
              >
                <!-- Pulsing location dot -->
                <div class="absolute -translate-x-1/2 -translate-y-1/2">
                  <span class="absolute inset-0 w-3 h-3 rounded-full bg-brand-green animate-ping opacity-60"></span>
                  <span class="relative block w-3 h-3 rounded-full bg-brand-green ring-2 ring-white shadow-md"></span>
                </div>
                <!-- Card — positioned above/below dot depending on y -->
                <div
                  class="absolute w-44 bg-white rounded-xl shadow-xl border border-gray-100 p-2.5"
                  :style="cardOffset(sale)"
                >
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1">
                      <span class="text-sm">{{ sale.flag }}</span>
                      <span class="text-[10px] font-semibold text-gray-500">{{ sale.city }}</span>
                    </div>
                    <span class="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                      Parduota
                    </span>
                  </div>
                  <div class="text-xs font-bold text-gray-900 leading-tight truncate">{{ sale.part }}</div>
                  <div class="text-sm font-black text-gray-950 mt-0.5">{{ sale.price }}</div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- ── BOTTOM: How It Works — full width inside hero ── -->
      <div class="border-t border-gray-100 py-14 sm:py-16">
        <div v-reveal class="text-center mb-10 sm:mb-12">
          <p class="text-sm font-semibold text-brand-green uppercase tracking-widest mb-2">Kaip tai veikia</p>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight">Paprastai ir greitai</h2>
          <p class="mt-3 text-base sm:text-lg text-gray-500">Nuo paieškos iki pristatymo – viskas vienoje platformoje</p>
        </div>

        <div class="relative">
          <!-- Connector line desktop -->
          <div class="hidden lg:block absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent pointer-events-none"></div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div
              v-for="(step, i) in steps"
              :key="i"
              v-reveal="{ delay: i * 100 }"
              class="relative flex flex-col items-center text-center group"
            >
              <div class="relative mb-5">
                <div
                  class="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                  :class="step.bg"
                >{{ step.icon }}</div>
                <div class="absolute -top-2 -right-2 w-7 h-7 bg-gray-950 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {{ i + 1 }}
                </div>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-gray-950 mb-1.5">{{ step.title }}</h3>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-10 sm:mt-12">
          <button
            @click="navigateTo('/catalog')"
            class="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5"
          >
            Pradėti paiešką dabar
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>

    </div>

  </section>

  <SearchModal v-model="searchModalOpen" :initial-query="searchQuery" />
</template>

<script setup lang="ts">
const searchModalOpen = ref(false)
const searchQuery = ref('')

const vehicleTypes = [
  { id: 'car',        icon: '🚗',  label: 'Automobilis',  color: '#16a34a' },
  { id: 'moto',       icon: '🏍️',  label: 'Motociklas',   color: '#2563eb' },
  { id: 'commercial', icon: '🚛',  label: 'Komercinis',   color: '#7c3aed' },
  { id: 'oem',        icon: '🔩',  label: 'OEM Originalios', color: '#d97706' },
]

const steps = [
  { icon: '🔍', bg: 'bg-blue-50',   title: 'Ieškokite dalies',       desc: 'Įveskite automobilio markę, modelį ir reikiamą dalį arba OEM kodą' },
  { icon: '🌍', bg: 'bg-green-50',  title: 'Rinkitės iš Europos',    desc: 'Peržiūrėkite šimtus pasiūlymų iš patikrintų pardavėjų visoje Europoje' },
  { icon: '💳', bg: 'bg-purple-50', title: 'Atsiskaitykite saugiai', desc: 'Apmokėkite su Visa, Mastercard, Apple Pay ar banko pavedimu' },
  { icon: '📦', bg: 'bg-yellow-50', title: 'Gaukite pristatymą',     desc: 'Dalis pristatoma tiesiai į jūsų duris per 2–5 darbo dienas' },
]

// ── Live sales animation ──────────────────────────────────────────
const salePool = [
  { flag: '🇩🇪', city: 'Berlynas',    part: 'BMW E60 variklio dangtis',      price: '85€',  x: 43, y: 64 },
  { flag: '🇵🇱', city: 'Varšuva',     part: 'Audi A4 kapotas',               price: '240€', x: 54, y: 65 },
  { flag: '🇫🇷', city: 'Paryžius',    part: 'Mercedes W211 bamperis',        price: '210€', x: 28, y: 71 },
  { flag: '🇳🇱', city: 'Amsterdamas', part: 'VW Touareg priekiniai žib.',    price: '450€', x: 31, y: 65 },
  { flag: '🇸🇪', city: 'Stokholmas',  part: 'Volvo V90 galinis bamperis',    price: '290€', x: 50, y: 46 },
  { flag: '🇨🇿', city: 'Praha',       part: 'Skoda Octavia stabdžiai',       price: '135€', x: 45, y: 70 },
  { flag: '🇦🇹', city: 'Viena',       part: 'BMW X5 E70 sankaba',            price: '340€', x: 48, y: 74 },
  { flag: '🇧🇪', city: 'Briuselis',   part: 'Renault Megane variklis',       price: '890€', x: 31, y: 68 },
  { flag: '🇱🇻', city: 'Ryga',        part: 'Toyota RAV4 priekinė ašis',     price: '380€', x: 59, y: 53 },
  { flag: '🇭🇺', city: 'Budapeštas',  part: 'Opel Astra H variklio dangtis', price: '65€',  x: 51, y: 76 },
  { flag: '🇩🇰', city: 'Kopenhaga',   part: 'Volvo XC60 stabdžių diskai',    price: '180€', x: 42, y: 57 },
  { flag: '🇫🇮', city: 'Helsinkis',   part: 'Subaru Outback turbina',        price: '540€', x: 60, y: 44 },
  { flag: '🇮🇹', city: 'Milanas',     part: 'Alfa Romeo 159 durys',          price: '320€', x: 37, y: 80 },
  { flag: '🇬🇧', city: 'Londonas',    part: 'Range Rover Sport žibintas',    price: '620€', x: 24, y: 67 },
  { flag: '🇪🇸', city: 'Madridas',    part: 'Seat Leon 2.0 TDI variklis',    price: '760€', x: 19, y: 88 },
  { flag: '🇱🇹', city: 'Kaunas',      part: 'BMW 3 serija E90 sparnas',      price: '120€', x: 58, y: 59 },
  { flag: '🇷🇴', city: 'Bukureštas',  part: 'Dacia Logan sankaba',           price: '95€',  x: 62, y: 82 },
  { flag: '🇨🇭', city: 'Ciurichas',   part: 'Mercedes C klasė W204 ECU',     price: '280€', x: 36, y: 76 },
  { flag: '🇳🇴', city: 'Oslas',       part: 'Volvo S60 generatorius',        price: '195€', x: 40, y: 45 },
  { flag: '🇬🇷', city: 'Atėnai',      part: 'Toyota Yaris stabdžiai',        price: '88€',  x: 58, y: 92 },
]

interface Sale { id: number; flag: string; city: string; part: string; price: string; x: number; y: number }

const activeSales = ref<Sale[]>([])
let saleCounter = 0
let poolIndex = 0

function cardOffset(sale: Sale): string {
  // Place card above the dot by default, below if near top edge
  const above = sale.y > 28
  // Nudge horizontally so card doesn't escape map edges
  const nudge = sale.x > 68 ? '-90%' : sale.x < 22 ? '0%' : '-50%'
  const top = above ? 'auto' : '14px'
  const bottom = above ? '14px' : 'auto'
  return `bottom:${bottom};top:${top};left:0;transform:translateX(${nudge})`
}

function isTooClose(candidate: typeof salePool[0]): boolean {
  // Prevent spawning if any active card is within 18% distance on the map
  return activeSales.value.some(s => {
    const dx = s.x - candidate.x
    const dy = s.y - candidate.y
    return Math.sqrt(dx * dx + dy * dy) < 18
  })
}

function spawnSale() {
  // Max 2 visible at once to avoid crowding
  if (activeSales.value.length >= 2) activeSales.value.shift()

  // Try up to 8 candidates to find one that doesn't collide
  for (let attempt = 0; attempt < 8; attempt++) {
    const item = salePool[poolIndex % salePool.length]
    poolIndex++
    if (!isTooClose(item)) {
      activeSales.value.push({ ...item, id: ++saleCounter })
      return
    }
  }
  // Fallback: just add and shift anyway
  const item = salePool[poolIndex % salePool.length]
  poolIndex++
  activeSales.value.push({ ...item, id: ++saleCounter })
}

onMounted(() => {
  setTimeout(() => spawnSale(), 800)
  setTimeout(() => spawnSale(), 2600)
  const interval = setInterval(spawnSale, 3200)
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.sale-enter-active { transition: opacity 0.45s ease, transform 0.45s cubic-bezier(.4,0,.2,1); }
.sale-leave-active { transition: opacity 0.35s ease, transform 0.35s cubic-bezier(.4,0,.2,1); }
.sale-enter-from   { opacity: 0; transform: translateY(10px) scale(0.95); }
.sale-leave-to     { opacity: 0; transform: translateY(-8px) scale(0.95); }
.sale-move         { transition: transform 0.4s ease; }
</style>
