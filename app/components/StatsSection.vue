<template>
  <section class="relative overflow-hidden bg-gray-950 py-16">
    <!-- Subtle grid texture -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px;"></div>
      <!-- Green glow top-left -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full" style="background: radial-gradient(circle, rgba(0,182,122,0.12) 0%, transparent 70%);"></div>
      <!-- Green glow bottom-right -->
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full" style="background: radial-gradient(circle, rgba(0,182,122,0.08) 0%, transparent 70%);"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-800">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          v-reveal="{ delay: i * 100 }"
          class="stat-card relative bg-gray-950 px-8 py-10 text-center group hover:bg-gray-900 transition-colors duration-300"
        >
          <!-- Top accent line -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 transition-all duration-500 group-hover:w-20" style="background: linear-gradient(90deg, transparent, #00B67A, transparent);"></div>

          <!-- Icon -->
          <div class="flex justify-center mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style="background: rgba(0,182,122,0.1); border: 1px solid rgba(0,182,122,0.2);">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#00B67A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path :d="stat.icon"/>
              </svg>
            </div>
          </div>

          <!-- Value -->
          <div class="text-3xl sm:text-4xl xl:text-5xl font-black tabular-nums leading-none" style="background: linear-gradient(135deg, #ffffff 60%, #00B67A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            {{ stat.value }}
          </div>

          <!-- Label -->
          <div class="mt-3 text-sm font-medium text-gray-400 tracking-wide">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  {
    value: '12,400+',
    label: 'Dalių sandėlyje',
    icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM4 7V5a2 2 0 012-2h12a2 2 0 012 2v2',
  },
  {
    value: '340+',
    label: 'Patikimi pardavėjai',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  },
  {
    value: '18',
    label: 'Šalių Europoje',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
  {
    value: '4.9★',
    label: 'Klientų įvertinimas',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
]
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .stat-card { transition: none; }
  .stat-card .absolute { transition: none; }
  .stat-card div { transition: none; }
}
</style>
