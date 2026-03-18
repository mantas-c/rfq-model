<template>
  <section class="py-14 bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-reveal class="mb-8">
        <p class="text-sm font-semibold text-brand-green uppercase tracking-widest mb-1">Kategorijos</p>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Pasirinkite iš kitų kategorijų</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          v-for="(cat, i) in categories"
          :key="cat.title"
          v-reveal="{ delay: i * 100 }"
          :href="cat.href"
          class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 hover:border-gray-200 hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-between"
          :style="{ '--accent': cat.accent }"
        >
          <!-- Left: text -->
          <div class="space-y-2">
            <span
              v-if="cat.badge"
              class="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
              :style="{ background: cat.accent }"
            >{{ cat.badge }}</span>
            <h3 class="text-lg font-black text-gray-950 leading-tight">{{ cat.title }}</h3>
            <p class="text-sm text-gray-500">{{ cat.desc }}</p>
            <span class="inline-flex items-center gap-1 text-sm font-semibold transition-colors" :style="{ color: cat.accent }">
              Peržiūrėti
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>

          <!-- Right: icon -->
          <div class="text-6xl ml-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 select-none">
            {{ cat.icon }}
          </div>

          <!-- Hover glow -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" :style="{ background: `radial-gradient(ellipse at 80% 50%, ${cat.accent}10, transparent 70%)` }"></div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const categories = [
  {
    title: 'OEM Originalios Dalys',
    desc: 'Naujos gamyklinės dalys pagal OEM kodą',
    icon: '🔩',
    badge: 'Naujiena',
    accent: '#f59e0b',
    href: '/catalog?vehicleType=oem',
  },
  {
    title: 'Motociklų Dalys',
    desc: 'Naudotos dalys motociklams ir skūteriams',
    icon: '🏍️',
    badge: null,
    accent: '#3b82f6',
    href: '/catalog?vehicleType=moto',
  },
  {
    title: 'Sunkvežimių Dalys',
    desc: 'Komercinių transporto priemonių dalys',
    icon: '🚛',
    badge: null,
    accent: '#8b5cf6',
    href: '/catalog?vehicleType=commercial',
  },
]
</script>
