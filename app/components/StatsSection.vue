<template>
  <section ref="sectionRef" class="relative overflow-hidden">

    <!-- ── Background layers ─────────────────────────────────────────────── -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0b1120] to-slate-950"></div>

    <!-- Dot-grid texture -->
    <div class="absolute inset-0 stats-dots opacity-100 pointer-events-none"></div>

    <!-- Central green ambient glow -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="stats-center-glow"></div>
    </div>

    <!-- Top hairline accent -->
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
    <!-- Bottom hairline accent -->
    <div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

    <!-- ── Content ────────────────────────────────────────────────────────── -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <!-- Header -->
      <div v-reveal class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 stats-badge">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Platformos statistika
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Skaičiai, kuriais pasitikima</h2>
      </div>

      <!-- Stats strip -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-white/[0.06]">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          v-reveal="{ delay: i * 90 }"
          class="stat-card relative flex flex-col items-center text-center px-4 py-7 rounded-xl lg:rounded-none cursor-default group"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
        >
          <!-- Mobile card border -->
          <div class="lg:hidden absolute inset-0 rounded-xl stats-card-border pointer-events-none"></div>

          <!-- Hover radial glow -->
          <div
            class="absolute inset-0 rounded-xl lg:rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style="background: radial-gradient(ellipse 80% 80% at 50% 50%, rgba(20,163,74,0.07) 0%, transparent 70%)"
          ></div>

          <!-- Icon bubble -->
          <div
            class="relative z-10 w-11 h-11 rounded-xl mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(20,163,74,0.35)]"
            style="background: rgba(20,163,74,0.1); border: 1px solid rgba(20,163,74,0.25);"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#14A34A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="stat.icon"/>
            </svg>
          </div>

          <!-- Animated value -->
          <div class="relative z-10 flex items-baseline gap-0.5 leading-none tabular-nums">
            <span
              class="text-3xl xl:text-4xl font-black text-white transition-all duration-300"
              :class="{ 'stat-value-glow': hovered === i }"
            >{{ stat.prefix }}{{ stat.animated }}</span>
            <span
              class="text-xl xl:text-2xl font-black transition-all duration-300"
              :class="{ 'stat-suffix-glow': hovered === i }"
              style="color: #14A34A"
            >{{ stat.suffix }}</span>
          </div>

          <!-- Label -->
          <div class="relative z-10 mt-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] leading-snug">{{ stat.label }}</div>

          <!-- Trend badge -->
          <div
            v-if="stat.trend"
            class="relative z-10 mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300"
            :class="stat.trendDown ? 'stat-trend-down' : 'stat-trend-up'"
          >
            <svg class="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path :d="stat.trendDown ? 'M12 5v14M5 12l7 7 7-7' : 'M12 19V5M5 12l7-7 7 7'"/>
            </svg>
            {{ stat.trend }}
          </div>

          <!-- Bottom accent line (visible on hover) -->
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 h-px transition-all duration-500 rounded-full"
            :style="{
              width: hovered === i ? '60%' : '0%',
              background: 'linear-gradient(to right, transparent, #14A34A, transparent)',
              opacity: hovered === i ? 1 : 0
            }"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const hovered = ref<number | null>(null)

const stats = [
  {
    prefix: '',
    value: 12400,
    decimals: 0,
    suffix: '+',
    label: 'Dalių sandėlyje',
    trend: '+340 šį mėn.',
    trendDown: false,
    icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM4 7V5a2 2 0 012-2h12a2 2 0 012 2v2',
    animated: ref('0'),
  },
  {
    prefix: '',
    value: 340,
    decimals: 0,
    suffix: '+',
    label: 'Patikimi pardavėjai',
    trend: '+18 šį mėn.',
    trendDown: false,
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
    trendDown: false,
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
    trendDown: false,
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
    trendDown: true,
    icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
    animated: ref('0'),
  },
]

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function animateStat(stat: (typeof stats)[0]) {
  const duration = 1600
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
  const el = sectionRef.value
  if (!el) return
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      stats.forEach((s, i) => setTimeout(() => animateStat(s), i * 130))
      observer.disconnect()
    }
  }, { threshold: 0.25 })
  observer.observe(el)
})
</script>

<style scoped>
/* Dot grid texture */
.stats-dots {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* Central green ambient glow */
.stats-center-glow {
  width: 700px;
  height: 350px;
  border-radius: 9999px;
  background: radial-gradient(ellipse at center, rgba(20, 163, 74, 0.15) 0%, transparent 70%);
  filter: blur(40px);
}

/* Live badge */
.stats-badge {
  color: #14A34A;
  background: rgba(20, 163, 74, 0.08);
  border: 1px solid rgba(20, 163, 74, 0.25);
}

/* Mobile card */
.stats-card-border {
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

/* Hover value glow */
.stat-value-glow {
  text-shadow: 0 0 28px rgba(255, 255, 255, 0.25);
}
.stat-suffix-glow {
  text-shadow: 0 0 24px rgba(20, 163, 74, 0.6);
}

/* Trend pills */
.stat-trend-up {
  background: rgba(20, 163, 74, 0.1);
  color: #14A34A;
  border: 1px solid rgba(20, 163, 74, 0.2);
}
.stat-trend-down {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .animate-ping { animation: none; }
}
</style>
