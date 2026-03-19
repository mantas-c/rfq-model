<template>
  <header class="sticky top-0 z-50">
    <!-- Collapsible top bars (hide on scroll) -->
    <div
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :style="{ maxHeight: scrolled ? '0px' : '100px', opacity: scrolled ? 0 : 1 }"
    >
      <!-- Announcement Bar -->
      <div v-if="showAnnouncement" class="relative overflow-hidden" style="background: linear-gradient(90deg, #052e16 0%, #14532d 40%, #166534 60%, #052e16 100%);">
        <!-- Shimmer overlay -->
        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);"></div>

        <div class="flex items-center h-9">
          <!-- Left label -->
          <div class="flex-shrink-0 flex items-center gap-1.5 px-4 bg-green-500 h-full">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span class="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Naujienos</span>
          </div>

          <!-- Scrolling ticker -->
          <div class="flex-1 overflow-hidden relative">
            <div class="flex items-center animate-ticker whitespace-nowrap gap-0">
              <template v-for="_ in 2" :key="_">
                <span v-for="msg in messages" :key="msg.text" class="inline-flex items-center gap-2 px-8 text-xs font-medium text-white/90">
                  <span class="text-sm">{{ msg.icon }}</span>
                  <span v-html="msg.text"></span>
                  <span class="text-white/30 mx-2">·</span>
                </span>
              </template>
            </div>
          </div>

          <!-- Close -->
          <button
            @click="showAnnouncement = false"
            class="flex-shrink-0 flex items-center justify-center w-9 h-full text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Secondary Nav — hidden on mobile -->
      <div class="hidden sm:block bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-4 lg:gap-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide overflow-x-auto scrollbar-none">
            <a href="#" class="hover:text-gray-900 transition-colors">Pristatymas</a>
            <a href="#" class="hover:text-gray-900 transition-colors">Atsiskaitymas</a>
            <a href="#" class="hover:text-gray-900 transition-colors">Grąžinimas</a>
            <a href="#" class="hover:text-gray-900 transition-colors">D.U.K.</a>
            <a href="#" class="hover:text-gray-900 transition-colors">Tapk partneriu</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Nav -->
    <nav
      class="bg-white border-b transition-shadow duration-300"
      :class="scrolled ? 'border-gray-200 shadow-md' : 'border-gray-200 shadow-sm'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-8">
            <a href="/" class="flex items-center">
              <img src="/logo.svg" alt="dalys.lt" class="h-8 w-auto" />
            </a>

            <!-- Desktop Nav Links -->
            <div class="hidden md:flex items-center gap-1">
              <div class="relative group">
                <button class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                  Katalogas
                  <svg class="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <!-- Dropdown -->
                <div class="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div class="p-2">
                    <a v-for="cat in categories" :key="cat.name" href="#" class="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                      <span class="text-base">{{ cat.icon }}</span>
                      <span>{{ cat.name }}</span>
                    </a>
                  </div>
                </div>
              </div>
              <a href="/catalog" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">Visos dalys</a>
              <a href="#" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">Naujienos</a>
              <a href="#" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">Kontaktai</a>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-2">
            <!-- Cart -->
            <button class="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
              <div class="relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span class="absolute -top-2 -right-2 bg-brand-green text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </div>
              <span class="hidden sm:inline">0.00 €</span>
            </button>

            <!-- Language / Region switcher -->
            <div class="relative group">
              <button class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                <img src="https://flagcdn.com/w40/lt.png" alt="LT" class="w-5 h-5 rounded-full object-cover" />
                <span class="hidden sm:inline text-xs font-bold">Lietuvių</span>
                <svg class="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <div class="absolute top-full right-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden">

                <!-- Languages grid -->
                <div class="p-4 grid grid-cols-2 gap-1">
                  <a v-for="lang in languages" :key="lang.code" href="#"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
                    :class="lang.active ? 'opacity-40 pointer-events-none' : ''"
                  >
                    <img :src="`https://flagcdn.com/w40/${lang.flag}.png`" :alt="lang.code" class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-800">{{ lang.label }}</span>
                  </a>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-100"></div>

                <!-- Partversal regions -->
                <div class="py-2">
                  <a v-for="r in partversalRegions" :key="r.code" :href="r.href" target="_blank"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group/item"
                  >
                    <img :src="`https://flagcdn.com/w40/${r.flag}.png`" :alt="r.code" class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-semibold text-gray-900">{{ r.domain }}</div>
                      <div class="text-xs text-gray-400">{{ r.desc }}</div>
                    </div>
                    <svg class="w-4 h-4 text-gray-300 group-hover/item:text-gray-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <!-- Login -->
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md hover:-translate-y-px" style="background:#14A34A;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="hidden sm:inline">Prisijungti</span>
            </a>

            <!-- Mobile menu button -->
            <button class="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors" @click="mobileMenuOpen = !mobileMenuOpen">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
        <a href="/catalog" class="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Katalogas</a>
        <a href="#" class="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Naujienos</a>
        <a href="#" class="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Kontaktai</a>
        <hr class="border-gray-100 my-2">
        <a href="#" class="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Pristatymas</a>
        <a href="#" class="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Atsiskaitymas</a>
        <a href="#" class="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Tapk partneriu</a>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const showAnnouncement = ref(true)

const messages = [
  { icon: '⚡', text: 'Naujiena: <strong>BMW &amp; Mercedes OEM dalys</strong> dabar sandėlyje!' },
  { icon: '🚚', text: 'Nemokamas pristatymas užsakymams <strong>virš 150 €</strong>' },
  { icon: '🛡️', text: '<strong>14 dienų</strong> grąžinimo garantija be klausimų' },
  { icon: '🌍', text: 'Daugiau nei <strong>12,400 dalių</strong> iš 15 Europos šalių' },
  { icon: '💳', text: 'Atsiskaitykite saugiai: <strong>Visa, Mastercard, Apple Pay</strong>' },
  { icon: '⭐', text: 'Įvertinti <strong>4.8/5</strong> pagal Trustpilot atsiliepimus' },
]
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

onMounted(() => {
  const onScroll = () => {
    const y = window.scrollY
    if (!scrolled.value && y > 80) scrolled.value = true
    else if (scrolled.value && y < 40) scrolled.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const languages = [
  { code: 'LT', flag: 'lt', label: 'Lietuvių', active: true },
  { code: 'EN', flag: 'gb', label: 'English',  active: false },
  { code: 'RU', flag: 'ru', label: 'Русский',  active: false },
  { code: 'LV', flag: 'lv', label: 'Latviešu', active: false },
]

const partversalRegions = [
  { code: 'GB', flag: 'gb', domain: 'partversal.co.uk', desc: 'You will be redirected to Partversal UK',        href: 'https://partversal.co.uk' },
  { code: 'SE', flag: 'se', domain: 'partversal.se',    desc: 'Du omdirigeras till Partversal Sverige',         href: 'https://partversal.se' },
  { code: 'FI', flag: 'fi', domain: 'partversal.fi',    desc: 'Sinut ohjataan Partversal Suomeen',              href: 'https://partversal.fi' },
  { code: 'DE', flag: 'de', domain: 'partversal.de',    desc: 'Sie werden zu Partversal Deutschland weitergeleitet', href: 'https://partversal.de' },
  { code: 'FR', flag: 'fr', domain: 'partversal.fr',    desc: 'Vous serez redirigé vers Partversal France',     href: 'https://partversal.fr' },
  { code: 'IT', flag: 'it', domain: 'partversal.it',    desc: 'Sarete reindirizzati a Partversal Italia',       href: 'https://partversal.it' },
  { code: 'ES', flag: 'es', domain: 'partversal.es',    desc: 'Serás redirigido a Partversal España',           href: 'https://partversal.es' },
  { code: 'PL', flag: 'pl', domain: 'partversal.pl',    desc: 'Zostaniesz przekierowany do Partversal Polska',  href: 'https://partversal.pl' },
]

const categories = [
  { icon: '🔧', name: 'Variklio dalys' },
  { icon: '⚙️', name: 'Transmisija' },
  { icon: '🛑', name: 'Stabdžių sistema' },
  { icon: '💡', name: 'Žibintai ir optika' },
  { icon: '🚗', name: 'Kėbulo dalys' },
  { icon: '❄️', name: 'Kondicionierius' },
  { icon: '🔌', name: 'Elektrika' },
  { icon: '🪑', name: 'Salonas' },
]
</script>

<style scoped>
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-ticker {
  animation: ticker 28s linear infinite;
}
.animate-ticker:hover {
  animation-play-state: paused;
}
</style>

