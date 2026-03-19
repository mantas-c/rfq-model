<template>
  <section class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

      <!-- Trustpilot Reviews -->
      <div>
        <!-- Header with Trustpilot branding -->
        <div v-reveal class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p class="text-sm font-semibold text-brand-green uppercase tracking-widest mb-2">Atsiliepimai</p>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-950 tracking-tight">Ką sako mūsų klientai</h2>
          </div>

          <!-- Trustpilot widget -->
          <div class="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex-shrink-0">
            <!-- Trustpilot logo -->
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-1.5 mb-1">
                <svg viewBox="0 0 126 26" class="h-5 w-auto" fill="none">
                  <rect width="26" height="26" rx="2" fill="#14A34A"/>
                  <path d="M13 5l2.09 6.43H21l-4.95 3.6L18.09 21 13 17.4 7.91 21l2.04-5.97L5 11.43h5.91z" fill="white"/>
                  <text x="32" y="19" font-family="Arial, sans-serif" font-weight="700" font-size="15" fill="#191919" letter-spacing="-0.3">Trustpilot</text>
                </svg>
              </div>
              <div class="flex gap-0.5">
                <div v-for="i in 5" :key="i" class="w-5 h-5 flex items-center justify-center rounded-sm" style="background:#14A34A">
                  <svg viewBox="0 0 24 24" class="w-3 h-3 fill-white">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="w-px h-10 bg-gray-100"></div>
            <div>
              <div class="text-2xl font-black text-gray-950 leading-none">4.8</div>
              <div class="text-xs font-semibold text-gray-500 mt-0.5">Puiku · 328 atsiliepimai</div>
            </div>
          </div>
        </div>

        <!-- Review cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="(review, i) in reviews"
            :key="review.name"
            v-reveal="{ delay: i * 100 }"
            class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col gap-4"
          >
            <!-- Stars row -->
            <div class="flex items-center justify-between">
              <div class="flex gap-0.5">
                <div v-for="s in 5" :key="s" class="w-5 h-5 flex items-center justify-center rounded-sm" :style="{ background: s <= review.stars ? '#14A34A' : '#ddd' }">
                  <svg viewBox="0 0 24 24" class="w-3 h-3 fill-white">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                  </svg>
                </div>
              </div>
              <!-- Trustpilot mini logo -->
              <svg viewBox="0 0 18 18" class="w-4 h-4 flex-shrink-0" fill="none">
                <rect width="18" height="18" rx="2" fill="#14A34A"/>
                <path d="M9 3.5l1.45 4.46H15l-3.43 2.49 1.31 4.05L9 12.12l-3.88 2.38 1.31-4.05L3 8.96h4.55z" fill="white"/>
              </svg>
            </div>

            <!-- Title -->
            <h3 class="font-bold text-gray-950 text-sm leading-snug">{{ review.title }}</h3>

            <!-- Body -->
            <p class="text-gray-500 text-sm leading-relaxed flex-1">"{{ review.text }}"</p>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-50">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" :style="{ background: review.color }">
                  {{ review.name[0] }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900 text-xs">{{ review.name }}</div>
                  <div class="text-[10px] text-gray-400">{{ review.car }}</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <div class="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                  Patvirtinta
                </div>
                <div class="text-[10px] text-gray-400">{{ review.date }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- View all on Trustpilot -->
        <div v-reveal class="text-center mt-8">
          <a href="#" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Peržiūrėti visus atsiliepimus Trustpilot platformoje
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Trust badges -->
      <div v-reveal class="bg-white rounded-3xl border border-gray-100 p-10">
        <p class="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">Kodėl verta rinktis dalys.lt</p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="trust in trustItems" :key="trust.title" class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">{{ trust.icon }}</div>
            <div>
              <div class="font-bold text-gray-900 text-sm">{{ trust.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ trust.desc }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const reviews = [
  {
    stars: 5,
    title: 'Puikus servisas, greitas pristatymas!',
    text: 'Radau BMW E60 variklio dangtį labai geromis kainomis iš Vokietijos. Dalis atėjo per 3 darbo dienas, puikiai supakuota. Tikrai rekomenduoju.',
    name: 'Tomas K.',
    car: 'BMW 5 serija',
    color: '#1d4ed8',
    date: '2024-12-14',
  },
  {
    stars: 5,
    title: 'Retą dalį radau čia, ne kur kitur',
    text: 'Labai patogu filtruoti pagal automobilio modelį. Radau retą dalį Audi Q7, kurios neradau jokioje kitoje vietoje. Pardavėjas atsakė greitai.',
    name: 'Rasa P.',
    car: 'Audi Q7 4L',
    color: '#7c3aed',
    date: '2025-01-03',
  },
  {
    stars: 5,
    title: 'Greitas ir saugus pirkimas',
    text: 'Greitas pristatymas per DHL, dalis atitiko aprašymą 100%. Kainų palyginimas pagal OEM kodą – geniali funkcija. Tikrai grįšiu.',
    name: 'Mantas J.',
    car: 'Volvo XC60',
    color: '#16a34a',
    date: '2025-01-18',
  },
  {
    stars: 4,
    title: 'Geras pasirinkimas, patikima platforma',
    text: 'Užsakiau VW Passat B8 stabdžių diskus. Kaina konkurencinga, pristatymas iš Lenkijos užtruko 4 d.d. Dalis tiko tiksliai. Rekomenduoju.',
    name: 'Erikas M.',
    car: 'VW Passat B8',
    color: '#0891b2',
    date: '2025-02-05',
  },
  {
    stars: 5,
    title: 'Profesionalūs pardavėjai, puiki kokybė',
    text: 'Jau trečias pirkimas šioje platformoje. Visada aukšta kokybė, tikslūs aprašymai ir greitas atsakymas į klausimus. Labai patenkintas.',
    name: 'Darius S.',
    car: 'Mercedes E klasė',
    color: '#dc2626',
    date: '2025-02-22',
  },
  {
    stars: 5,
    title: 'OEM kainų palyginimas – super!',
    text: 'Suvedžiau OEM kodą ir iškart pamačiau 5 skirtingus pasiūlymus iš Europos. Sutaupiau 40% lyginant su vietinėmis dalimis. Nuostabu.',
    name: 'Živilė B.',
    car: 'Ford Mondeo V',
    color: '#d97706',
    date: '2025-03-01',
  },
]

const trustItems = [
  { icon: '🛡️', title: 'Saugus mokėjimas',    desc: 'SSL šifravimas ir patikimi mokėjimo sprendimai' },
  { icon: '↩️', title: '14 dienų grąžinimas', desc: 'Grąžinkite be klausimų per 14 dienų' },
  { icon: '✅', title: 'Patikrinti pardavėjai', desc: 'Visi pardavėjai patikrinti ir įvertinti' },
  { icon: '🚀', title: 'Greitas pristatymas',  desc: 'Pristatome per 2–5 darbo dienas' },
]
</script>
