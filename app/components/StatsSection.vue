<template>
  <section class="bg-white py-20 border-y border-gray-100 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section header -->
      <div v-reveal class="text-center mb-12">
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#00B67A">Platformos statistika</p>
        <h2 class="text-2xl font-black text-gray-950 tracking-tight">Skaičiai, kuriais pasitikima</h2>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          v-reveal="{ delay: i * 80 }"
          class="relative flex flex-col items-center text-center px-5 py-8 rounded-xl bg-white border border-gray-200 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
        >
          <!-- Thick top border -->
          <div class="absolute top-0 inset-x-0 h-1 rounded-t-xl transition-all duration-300"
            :style="{ background: hovered === i ? '#00B67A' : '#e5e7eb' }">
          </div>

          <!-- Icon circle -->
          <div class="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            :style="{ background: 'rgba(0,182,122,0.06)', border: '1.5px solid rgba(0,182,122,0.15)' }">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#00B67A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="stat.icon"/>
            </svg>
          </div>

          <!-- Value with count-up -->
          <div class="text-3xl xl:text-4xl font-black tabular-nums leading-none text-gray-950">
            {{ stat.prefix }}{{ stat.animated }}<span style="color:#00B67A" class="text-2xl xl:text-3xl font-black">{{ stat.suffix }}</span>
          </div>

          <!-- Label -->
          <div class="mt-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-snug">{{ stat.label }}</div>

          <!-- Trend badge -->
          <div v-if="stat.trend" class="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style="background:rgba(0,182,122,0.08); color:#00B67A">
            <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            {{ stat.trend }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const hovered = ref<number | null>(null)

const stats = [
  {
    prefix: '',
    value: 12400,
    decimals: 0,
    suffix: '+',
    label: 'Dalių sandėlyje',
    trend: '+340 šį mėn.',
    icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 00-2-2zM4 7V5a2 2 0 012-2h12a2 2 0 012 2v2',
    animated: ref('0'),
  },
  {
    prefix: '',
    value: 340,
    decimals: 0,
    suffix: '+',
    label: 'Patikimi pardavėjai',
    trend: '+18 šį mėn.',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    animated: ref('0'),
  },
  {
    prefix: '',
    value: 8200,
    decimals: 0,
    suffix: '+',
    label: 'Atsiliepimai',
    trend: '+120 šį mėn.',
    icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    animated: ref('0'),
  },
  {
    prefix: '',
    value: 24000,
    decimals: 0,
    suffix: '+',
    label: 'Patenkinti klientai',
    trend: '+580 šį mėn.',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    animated: ref('0'),
  },
  {
    prefix: '',
    value: 2.4,
    decimals: 1,
    suffix: ' d.d.',
    label: 'Vid. pristatymas',
    trend: '−0.3 vs. pernai',
    icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
    animated: ref('0'),
  },
]

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function animateStat(stat: typeof stats[0]) {
  const duration = 1400
  const start = performance.now()
  const tick = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutQuart(progress)
    const current = eased * stat.value
    stat.animated.value = stat.decimals > 0
      ? current.toFixed(stat.decimals)
      : Math.round(current).toLocaleString('lt-LT')
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  const section = document.querySelector('section')
  if (!section) return
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      stats.forEach((s, i) => setTimeout(() => animateStat(s), i * 120))
      observer.disconnect()
    }
  }, { threshold: 0.3 })
  observer.observe(section)
})
</script>
