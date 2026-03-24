<template>
  <div class="p-6 space-y-6" style="font-family:'Plus Jakarta Sans','Inter',sans-serif;">

    <!-- Back -->
    <div>
      <button @click="navigateTo('/supplier/catalog')"
        class="flex items-center gap-1.5 text-xs font-medium mb-4 cursor-pointer transition-opacity hover:opacity-70"
        style="color:#64748B;">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Grįžti į katalogą
      </button>

      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs mb-4" style="color:#94A3B8;">
        <span style="color:#64748B;">Katalogas</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        <span style="color:#64748B;">{{ product.category }}</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        <span style="color:#0F172A;">{{ product.name }}</span>
      </div>
    </div>

    <!-- Main layout -->
    <div class="grid grid-cols-3 gap-6">

      <!-- LEFT: images + specs (2/3) -->
      <div class="col-span-2 space-y-5">

        <!-- Hero image + thumbnails -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <!-- Main image placeholder -->
          <div class="relative h-72 flex items-center justify-center" :style="`background:${product.imgBg};`">
            <svg class="w-36 h-36 opacity-20" :style="`color:${product.imgColor};`" fill="none" stroke="currentColor" stroke-width="0.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="product.icon"/>
            </svg>
            <!-- Condition badge -->
            <span class="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full"
              :style="`background:${conditionStyle(product.condition).bg}; color:${conditionStyle(product.condition).color};`">
              {{ conditionLabel(product.condition) }}
            </span>
            <!-- Stock badge -->
            <span class="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
              :style="product.stock > 0 ? 'background:#DCFCE7; color:#14A34A;' : 'background:#FEF2F2; color:#EF4444;'">
              {{ product.stock > 0 ? `Sandėlyje: ${product.stock} vnt.` : 'Nėra sandėlyje' }}
            </span>
          </div>
          <!-- Thumbnail strip -->
          <div class="flex gap-2 p-4" style="border-top:1px solid #F1F5F9;">
            <div v-for="i in 4" :key="i"
              class="w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all"
              :style="`background:${product.imgBg}; border:2px solid ${i===1 ? '#14A34A' : '#E2E8F0'};`">
              <svg class="w-7 h-7 opacity-25" :style="`color:${product.imgColor};`" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="product.icon"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E8F0;">
          <h2 class="text-sm font-bold mb-3" style="color:#0F172A;">Aprašymas</h2>
          <p class="text-sm leading-relaxed" style="color:#475569;">{{ product.description }}</p>
          <div class="flex flex-wrap gap-2 mt-4">
            <span v-for="tag in product.tags" :key="tag"
              class="text-xs font-medium px-2.5 py-1 rounded-lg"
              style="background:#F1F5F9; color:#475569;">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Specs table -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="px-5 py-4" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Techniniai duomenys</h2>
          </div>
          <div class="grid grid-cols-2 gap-0">
            <div v-for="(spec, i) in product.specs" :key="spec.label"
              class="px-5 py-3 flex flex-col gap-0.5"
              :style="[i % 2 === 0 ? 'border-right:1px solid #F8FAFC;' : '', 'border-bottom:1px solid #F8FAFC;'].join('')">
              <span class="text-[11px] font-medium" style="color:#94A3B8;">{{ spec.label }}</span>
              <span class="text-sm font-semibold" style="color:#0F172A;">{{ spec.value }}</span>
            </div>
          </div>
        </div>

        <!-- Car compatibility -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Suderinamumas</h2>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#F0FDF4; color:#14A34A;">{{ product.compatibility.length }} modelių</span>
          </div>
          <div class="grid grid-cols-3 gap-0">
            <div v-for="(compat, i) in product.compatibility" :key="i"
              class="flex items-center gap-2.5 px-4 py-3"
              :style="'border-bottom:1px solid #F8FAFC;' + (i % 3 !== 2 ? 'border-right:1px solid #F8FAFC;' : '')">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style="background:#F1F5F9; color:#64748B;">
                {{ compat.make.slice(0,2).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold truncate" style="color:#0F172A;">{{ compat.model }}</p>
                <p class="text-[11px]" style="color:#94A3B8;">{{ compat.years }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT (1/3) -->
      <div class="space-y-4">

        <!-- Price + offer panel -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="p-5">
            <h1 class="text-base font-bold leading-snug mb-1" style="color:#0F172A;">{{ product.name }}</h1>
            <p class="text-xs font-mono mb-4" style="color:#94A3B8;">OEM: {{ product.oemCode }}</p>

            <div class="flex items-end gap-2 mb-4">
              <span class="text-3xl font-bold" style="color:#0F172A;">€{{ product.price }}</span>
              <span class="text-sm mb-1" style="color:#94A3B8;">/ vnt.</span>
            </div>

            <div class="space-y-2 mb-5">
              <div class="flex items-center justify-between text-sm">
                <span style="color:#64748B;">Sandėlyje</span>
                <span class="font-semibold" :style="product.stock > 0 ? 'color:#14A34A;' : 'color:#EF4444;'">
                  {{ product.stock > 0 ? product.stock + ' vnt.' : 'Nėra' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span style="color:#64748B;">Būklė</span>
                <span class="font-semibold px-2 py-0.5 rounded-full text-xs" :style="`background:${conditionStyle(product.condition).bg}; color:${conditionStyle(product.condition).color};`">
                  {{ conditionLabel(product.condition) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span style="color:#64748B;">Garantija</span>
                <span class="font-semibold" style="color:#0F172A;">{{ product.warranty }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span style="color:#64748B;">Pristatymas</span>
                <span class="font-semibold" style="color:#0F172A;">1–3 d.d.</span>
              </div>
            </div>

            <div class="h-px mb-5" style="background:#F1F5F9;"></div>

            <!-- Quick offer -->
            <p class="text-xs font-semibold mb-2" style="color:#0F172A;">Pridėti į pasiūlymą</p>
            <select v-model="selectedQueryId"
              class="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none cursor-pointer mb-3"
              style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
              <option value="">— Pasirinkite užklausą —</option>
              <option v-for="q in openQueries" :key="q.id" :value="q.id">{{ q.id }} · {{ q.car }}</option>
            </select>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label class="block text-[11px] font-medium mb-1" style="color:#64748B;">Kiekis</label>
                <input v-model.number="offerQty" type="number" min="1" :max="product.stock"
                  class="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                  style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
              </div>
              <div>
                <label class="block text-[11px] font-medium mb-1" style="color:#64748B;">Kaina (€)</label>
                <input v-model.number="offerPrice" type="number" min="0" step="0.01"
                  class="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                  style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
              </div>
            </div>

            <!-- Delivery days -->
            <label class="block text-[11px] font-medium mb-1.5" style="color:#64748B;">Pristatymo terminas</label>
            <div class="flex gap-1.5 mb-4">
              <button v-for="d in [1,2,3,5,7]" :key="d"
                @click="deliveryDays = d"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                :style="deliveryDays === d
                  ? 'background:#14A34A; color:#fff;'
                  : 'background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0;'">
                {{ d }}d.
              </button>
            </div>

            <!-- Iš viso -->
            <div class="rounded-xl px-4 py-2.5 flex justify-between items-center mb-4" style="background:#F0FDF4; border:1px solid #BBF7D0;">
              <span class="text-xs" style="color:#14A34A;">{{ offerQty }} × €{{ offerPrice }}</span>
              <span class="text-sm font-bold" style="color:#14A34A;">€{{ (offerQty * offerPrice).toFixed(2) }}</span>
            </div>

            <button @click="submitOffer"
              :disabled="!selectedQueryId || product.stock === 0"
              class="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity flex items-center justify-center gap-2"
              :style="selectedQueryId && product.stock > 0
                ? 'background:#14A34A; color:#fff;'
                : 'background:#F1F5F9; color:#CBD5E1; cursor:not-allowed;'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              Siųsti pasiūlymą
            </button>
          </div>
        </div>

        <!-- Seller info (your own part) -->
        <div class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Jūsų sandėlio info</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span style="color:#64748B;">Vieta sandėlyje</span>
              <span class="font-semibold" style="color:#0F172A;">{{ product.location }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color:#64748B;">Įsigyta</span>
              <span class="font-semibold" style="color:#0F172A;">{{ product.acquired }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color:#64748B;">Savikaina</span>
              <span class="font-semibold" style="color:#0F172A;">€{{ product.costPrice }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color:#64748B;">Marža</span>
              <span class="font-semibold" style="color:#14A34A;">+{{ Math.round((product.price - product.costPrice) / product.costPrice * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="rounded-xl p-4 space-y-2" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Veiksmai</h3>
          <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50" style="border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#6366F1;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Redaguoti dalį
          </button>
          <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50" style="border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#F59E0B;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            Dubliuoti įrašą
          </button>
          <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-red-50" style="border:1px solid #FCA5A5; color:#EF4444;">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Pašalinti iš katalogo
          </button>
        </div>

      </div>
    </div>

    <!-- Success toast -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition-all duration-300" leave-to-class="translate-y-4 opacity-0">
        <div v-if="toast.show" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl"
          style="background:#0F172A; color:#fff; min-width:300px;">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background:#14A34A;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold">Pasiūlymas išsiųstas!</p>
            <p class="text-xs" style="color:#94A3B8;">{{ toast.message }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'supplier' })

const route = useRoute()
const id    = route.params.id as string

const selectedQueryId = ref('')
const offerQty        = ref(1)
const offerPrice      = ref(0)
const deliveryDays    = ref(2)
const toast           = reactive({ show: false, message: '' })

// Full product data keyed by id
const productsMap: Record<string, any> = {
  p001: {
    id: 'p001', name: 'Priekinis bamperis (M-paket.)', oemCode: '51117906699',
    category: 'Kėbulas', make: 'BMW', condition: 'used',
    price: 185, costPrice: 90, stock: 2, warranty: '3 mėn.',
    location: 'A-12-3', acquired: '2025-11-15',
    imgBg: '#F0F9FF', imgColor: '#0EA5E9',
    icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1',
    description: 'Priekinis bamperis su M-paketų apdaila. Paimtas iš BMW E60 520d 2007m. automobilio po smulkios priekinės kliūties. Mechaniškai nepažeistas, nedidelė dešinės pusės danga šiurkštoka. Liukai ir grotelės komplekte. Tinkamai paruoštas džiovinimui ir lakavimui.',
    tags: ['Pilnas komplektas', 'Su grotelėmis', 'M-paket dizainas', 'Kėbulo spalva: Titansilber'],
    specs: [
      { label: 'Gamintojas',     value: 'BMW AG' },
      { label: 'Dalies numeris', value: '51117906699' },
      { label: 'Automobilis',    value: 'BMW E60 / E61' },
      { label: 'Metai',          value: '2003–2010' },
      { label: 'Pusė',           value: 'Priekinė' },
      { label: 'Spalva',         value: 'Titansilber (354)' },
      { label: 'Būklė',         value: 'Naudota, gera' },
      { label: 'Svoris',         value: '~4,2 kg' },
    ],
    compatibility: [
      { make: 'BMW', model: 'BMW E60 5-series', years: '2003–2010' },
      { make: 'BMW', model: 'BMW E61 Touring',  years: '2004–2010' },
    ],
    compat: ['BMW E60', 'BMW E61'],
  },
  p009: {
    id: 'p009', name: 'Priekinis stiklas (HUD)', oemCode: '8200793088',
    category: 'Stiklai', make: 'Renault', condition: 'oem',
    price: 240, costPrice: 140, stock: 1, warranty: '12 mėn.',
    location: 'C-04-1', acquired: '2026-01-08',
    imgBg: '#F0F9FF', imgColor: '#0EA5E9',
    icon: 'M7 3a1 1 0 000 2h10a1 1 0 100-2H7zM4 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z',
    description: 'Originalus Renault Megane III priekinis stiklas su HUD (heads-up display) funkcija. Naujas originalus gamintojas Saint-Gobain. Komplekte su guminiu rėmeliu ir montavimo priedais. Skirtas 4 durų kėbulo modifikacijai.',
    tags: ['OEM Originalas', 'HUD funkcija', 'Saint-Gobain', 'Su rėmeliu'],
    specs: [
      { label: 'Gamintojas',     value: 'Saint-Gobain / AGC' },
      { label: 'Dalies numeris', value: '8200793088' },
      { label: 'Automobilis',    value: 'Renault Megane III' },
      { label: 'Metai',          value: '2008–2016' },
      { label: 'Storis',         value: '4,0 mm' },
      { label: 'Šildymas',       value: 'Nėra' },
      { label: 'HUD',            value: 'Taip' },
      { label: 'Svoris',         value: '~8,5 kg' },
    ],
    compatibility: [
      { make: 'Renault', model: 'Renault Megane III', years: '2008–2016' },
      { make: 'Renault', model: 'Renault Megane III CC', years: '2010–2016' },
      { make: 'Renault', model: 'Renault Laguna III', years: '2007–2015' },
    ],
    compat: ['Renault Megane III', 'Renault Laguna III'],
  },
}

// Fallback product if id not in map
const product = ref(productsMap[id] ?? {
  id, name: 'Dalis', oemCode: '—', category: 'Katalogas', make: '—',
  condition: 'used', price: 0, costPrice: 0, stock: 0, warranty: '—',
  location: '—', acquired: '—',
  imgBg: '#F8FAFC', imgColor: '#94A3B8',
  icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
  description: 'Dalies aprašymas dar nepridėtas.',
  tags: [], specs: [], compatibility: [], compat: [],
})

useHead({ title: `${product.value.name} — Katalogas · recar PRO` })

offerPrice.value = product.value.price

const openQueries = [
  { id: 'UZK-2847', part: 'Priekinis bamperis', car: 'BMW E60 520d' },
  { id: 'UZK-2853', part: 'Transmisija',         car: 'Ford Focus III' },
  { id: 'UZK-2844', part: 'Vairas',              car: 'Mercedes C W204' },
  { id: 'UZK-2860', part: 'Stabdžiai',           car: 'Honda Civic IX' },
  { id: 'UZK-2862', part: 'Žibintai',            car: 'BMW E90' },
]

function submitOffer() {
  if (!selectedQueryId.value || product.value.stock === 0) return
  const q = openQueries.find(q => q.id === selectedQueryId.value)
  toast.message = `${product.value.name} → ${q?.id} (${q?.car})`
  toast.show = true
  setTimeout(() => { toast.show = false }, 3500)
  selectedQueryId.value = ''
}

function conditionStyle(cond: string) {
  if (cond === 'oem')         return { bg: '#EFF6FF', color: '#3B82F6' }
  if (cond === 'used')        return { bg: '#F0FDF4', color: '#14A34A' }
  if (cond === 'aftermarket') return { bg: '#FFFBEB', color: '#D97706' }
  if (cond === 'refurbished') return { bg: '#FDF4FF', color: '#A855F7' }
  return { bg: '#F1F5F9', color: '#64748B' }
}
function conditionLabel(cond: string) {
  if (cond === 'oem')         return 'OEM Originali'
  if (cond === 'used')        return 'Naudota'
  if (cond === 'aftermarket') return 'Aftermarket'
  if (cond === 'refurbished') return 'Restauruota'
  return cond
}
</script>
