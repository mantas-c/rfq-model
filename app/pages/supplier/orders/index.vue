<template>
  <div class="p-6 space-y-6" style="font-family:'Plus Jakarta Sans','Inter',sans-serif;">

    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[22px] font-bold tracking-tight" style="color:#0F172A;">Užsakymai</h1>
        <p class="text-sm mt-0.5" style="color:#64748B;">Visi jūsų priimti pasiūlymai ir jų vykdymo statusas</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-slate-100"
          style="background:#fff; border:1px solid #E2E8F0; color:#475569;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Eksportuoti
        </button>
      </div>
    </div>

    <!-- KPI row -->
    <div class="grid grid-cols-4 gap-4">
      <div v-for="kpi in kpis" :key="kpi.label"
        class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-medium" style="color:#64748B;">{{ kpi.label }}</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :style="`background:${kpi.iconBg}`">
            <svg class="w-4 h-4" :style="`color:${kpi.iconColor}`" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="kpi.icon"/>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold mb-1" style="color:#0F172A;">{{ kpi.value }}</p>
        <p class="text-xs" :style="`color:${kpi.trendColor}`">{{ kpi.trend }}</p>
      </div>
    </div>

    <!-- Filters row -->
    <div class="flex items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1 max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Ieškoti pagal ID, dalį, klientą..."
          class="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none transition-all"
          style="background:#fff; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
      </div>

      <!-- Status tabs -->
      <div class="flex items-center gap-1 ml-auto p-1 rounded-lg" style="background:#F1F5F9;">
        <button v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-150"
          :style="activeTab === tab.key
            ? 'background:#fff; color:#0F172A; box-shadow:0 1px 3px rgba(0,0,0,0.08);'
            : 'color:#64748B;'">
          {{ tab.label }}
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            :style="activeTab === tab.key ? `background:${tab.color}18; color:${tab.color}` : 'background:#E2E8F0; color:#94A3B8;'">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Orders table -->
    <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">

      <!-- Table header -->
      <div class="grid items-center px-5 py-3 text-[11px] font-semibold uppercase tracking-wide"
        style="grid-template-columns:100px 1fr 140px 120px 100px 110px 80px; color:#94A3B8; border-bottom:1px solid #F1F5F9; background:#FAFAFA;">
        <span>Užsakymas</span>
        <span>Dalis / Automobilis</span>
        <span>Klientas</span>
        <span>Pristatymas</span>
        <span class="text-right">Suma</span>
        <span class="text-center">Statusas</span>
        <span></span>
      </div>

      <!-- Table rows -->
      <div v-if="filteredOrders.length === 0" class="py-16 text-center">
        <svg class="w-10 h-10 mx-auto mb-3" style="color:#E2E8F0;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p class="text-sm font-medium" style="color:#94A3B8;">Užsakymų nerasta</p>
      </div>

      <div v-for="order in filteredOrders" :key="order.id"
        @click="navigateTo(`/supplier/orders/${order.id}`)"
        class="grid items-center px-5 py-3.5 cursor-pointer transition-colors duration-100 hover:bg-slate-50"
        style="grid-template-columns:100px 1fr 140px 120px 100px 110px 80px; border-bottom:1px solid #F8FAFC;">

        <!-- ID -->
        <div>
          <span class="text-xs font-mono font-bold" style="color:#6366F1;">{{ order.id }}</span>
        </div>

        <!-- Part / Car -->
        <div class="min-w-0 pr-4">
          <p class="text-sm font-semibold truncate" style="color:#0F172A;">{{ order.part }}</p>
          <p class="text-xs truncate mt-0.5" style="color:#64748B;">{{ order.car }}</p>
        </div>

        <!-- Client -->
        <div class="min-w-0">
          <p class="text-xs font-medium truncate" style="color:#475569;">{{ order.client }}</p>
          <p class="text-[11px] truncate mt-0.5" style="color:#94A3B8;">{{ order.clientType }}</p>
        </div>

        <!-- Delivery -->
        <div>
          <p class="text-xs font-medium" style="color:#475569;">{{ order.deliveryDate }}</p>
          <p class="text-[11px] mt-0.5" :style="`color:${deliveryColor(order)}`">{{ deliveryLabel(order) }}</p>
        </div>

        <!-- Amount -->
        <div class="text-right">
          <p class="text-sm font-bold" style="color:#0F172A;">€{{ order.amount }}</p>
          <p class="text-[11px] mt-0.5" style="color:#94A3B8;">+ PVM</p>
        </div>

        <!-- Status -->
        <div class="flex justify-center">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" :style="statusStyle(order.status)">
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="`background:currentColor;`"></span>
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <!-- Arrow -->
        <div class="flex justify-end">
          <svg class="w-3.5 h-3.5" style="color:#CBD5E1;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-5 py-3" style="border-top:1px solid #F1F5F9;">
        <p class="text-xs" style="color:#94A3B8;">Rodoma {{ filteredOrders.length }} iš {{ allOrders.length }} užsakymų</p>
        <div class="flex items-center gap-1">
          <button v-for="p in 3" :key="p"
            class="w-7 h-7 rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150"
            :style="p === 1 ? 'background:#14A34A; color:#fff;' : 'color:#64748B; hover:background:#F1F5F9;'">
            {{ p }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'supplier' })
useHead({ title: 'Užsakymai — recar PRO' })

const search = ref('')
const activeTab = ref('all')

const tabs = [
  { key: 'all',       label: 'Visi',       count: 28, color: '#0F172A' },
  { key: 'active',    label: 'Vykdomi',    count: 8,  color: '#3B82F6' },
  { key: 'shipped',   label: 'Išsiųsti',   count: 5,  color: '#F59E0B' },
  { key: 'done',      label: 'Užbaigti',   count: 14, color: '#14A34A' },
  { key: 'cancelled', label: 'Atšaukti',   count: 1,  color: '#EF4444' },
]

const kpis = [
  { label: 'Aktyvūs užsakymai', value: '8', trend: '↑2 nuo praėjusios savaitės', trendColor: '#14A34A',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { label: 'Laukia išsiuntimo', value: '3', trend: 'Reikia dėmesio', trendColor: '#D97706',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10', iconBg: '#FFFBEB', iconColor: '#F59E0B' },
  { label: 'Užbaigti šį mėnesį', value: '14', trend: '+4 vs praėjęs mėn.', trendColor: '#14A34A',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', iconBg: '#F0FDF4', iconColor: '#14A34A' },
  { label: 'Pajamos šį mėnesį', value: '€3 840', trend: '↑12% vs praėjęs', trendColor: '#14A34A',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconBg: '#F0FDF4', iconColor: '#14A34A' },
]

const allOrders = [
  { id: 'UZK-2847', part: 'Priekinis bamperis (M-packet)', car: 'BMW E60 520d', client: 'UAB Draudimas LT', clientType: 'Draudimo įmonė', amount: '185', status: 'active',    deliveryDate: '2026-03-25', accepted: '2026-03-20' },
  { id: 'UZK-2851', part: 'Variklio dangtis',              car: 'Audi A4 B8',   client: 'If P&C Insurance', clientType: 'Draudimo įmonė', amount: '320', status: 'shipped',   deliveryDate: '2026-03-23', accepted: '2026-03-18' },
  { id: 'UZK-2839', part: 'Dešinės pusės veidrodis',       car: 'VW Golf VII',  client: 'Ergo Lietuva',    clientType: 'Draudimo įmonė', amount: '65',  status: 'done',      deliveryDate: '2026-03-18', accepted: '2026-03-12' },
  { id: 'UZK-2835', part: 'Kairės pusės durys',            car: 'Skoda Octavia A5', client: 'Gjensidige LT',   clientType: 'Draudimo įmonė', amount: '480', status: 'done',      deliveryDate: '2026-03-15', accepted: '2026-03-08' },
  { id: 'UZK-2853', part: 'Priekinė transmisija',          car: 'Ford Focus III', client: 'UAB TechAuto',  clientType: 'Autoservisas',  amount: '290', status: 'active',    deliveryDate: '2026-03-27', accepted: '2026-03-21' },
  { id: 'UZK-2848', part: 'Galinis buferis',               car: 'Toyota Corolla E12', client: 'SIA AutoFix', clientType: 'Autoservisas', amount: '120', status: 'shipped',   deliveryDate: '2026-03-24', accepted: '2026-03-19' },
  { id: 'UZK-2844', part: 'Vairas su pagalvėle',           car: 'Mercedes C-Class W204', client: 'UAB Draudimas LT', clientType: 'Draudimo įmonė', amount: '410', status: 'active', deliveryDate: '2026-03-28', accepted: '2026-03-21' },
  { id: 'UZK-2842', part: 'Stabdžių diskai (kompl.)',      car: 'Honda Civic IX', client: 'Ergo Lietuva', clientType: 'Draudimo įmonė', amount: '95',  status: 'done',      deliveryDate: '2026-03-14', accepted: '2026-03-07' },
  { id: 'UZK-2840', part: 'Priekinis stiklas',             car: 'Renault Megane III', client: 'If P&C Insurance', clientType: 'Draudimo įmonė', amount: '240', status: 'done',   deliveryDate: '2026-03-16', accepted: '2026-03-09' },
  { id: 'UZK-2836', part: 'Priekiniai žibintai (kompl.)', car: 'BMW E90 325i',  client: 'Gjensidige LT', clientType: 'Draudimo įmonė', amount: '560', status: 'done',      deliveryDate: '2026-03-12', accepted: '2026-03-05' },
  { id: 'UZK-2831', part: 'Katalizatorius',                car: 'Peugeot 308 II', client: 'UAB TechAuto', clientType: 'Autoservisas', amount: '185', status: 'done',       deliveryDate: '2026-03-10', accepted: '2026-03-03' },
  { id: 'UZK-2826', part: 'Pakabos svirties komplektas',   car: 'VW Passat B7',  client: 'SIA AutoFix',  clientType: 'Autoservisas', amount: '310', status: 'cancelled',  deliveryDate: '2026-03-08', accepted: '2026-02-28' },
  { id: 'UZK-2855', part: 'Alternatorius',                 car: 'Opel Astra H',  client: 'Ergo Lietuva', clientType: 'Draudimo įmonė', amount: '145', status: 'active',    deliveryDate: '2026-03-29', accepted: '2026-03-22' },
  { id: 'UZK-2856', part: 'Šildytuvo radiatorius',         car: 'Volvo V70 III', client: 'UAB Draudimas LT', clientType: 'Draudimo įmonė', amount: '220', status: 'active', deliveryDate: '2026-03-30', accepted: '2026-03-22' },
  { id: 'UZK-2857', part: 'Kuro siurblys',                 car: 'BMW X5 E53',    client: 'If P&C Insurance', clientType: 'Draudimo įmonė', amount: '380', status: 'shipped', deliveryDate: '2026-03-24', accepted: '2026-03-19' },
]

const filteredOrders = computed(() => {
  let list = allOrders
  if (activeTab.value !== 'all') list = list.filter(o => o.status === activeTab.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.part.toLowerCase().includes(q) ||
      o.car.toLowerCase().includes(q) ||
      o.client.toLowerCase().includes(q)
    )
  }
  return list
})

function statusStyle(s: string) {
  if (s === 'active')    return 'background:#EFF6FF; color:#3B82F6;'
  if (s === 'shipped')   return 'background:#FFFBEB; color:#D97706;'
  if (s === 'done')      return 'background:#F0FDF4; color:#14A34A;'
  if (s === 'cancelled') return 'background:#FEF2F2; color:#EF4444;'
  return 'background:#F1F5F9; color:#64748B;'
}

function statusLabel(s: string) {
  if (s === 'active')    return 'Vykdoma'
  if (s === 'shipped')   return 'Išsiųsta'
  if (s === 'done')      return 'Užbaigta'
  if (s === 'cancelled') return 'Atšaukta'
  return s
}

function deliveryColor(order: typeof allOrders[0]) {
  if (order.status === 'done')      return '#14A34A'
  if (order.status === 'cancelled') return '#EF4444'
  const diff = new Date(order.deliveryDate).getTime() - new Date('2026-03-23').getTime()
  if (diff < 0)          return '#EF4444'
  if (diff < 86400000)   return '#EA580C'
  if (diff < 172800000)  return '#D97706'
  return '#64748B'
}

function deliveryLabel(order: typeof allOrders[0]) {
  if (order.status === 'done')      return 'Pristatyta'
  if (order.status === 'cancelled') return 'Atšaukta'
  const diff = Math.ceil((new Date(order.deliveryDate).getTime() - new Date('2026-03-23').getTime()) / 86400000)
  if (diff < 0)  return 'Vėluoja!'
  if (diff === 0) return 'Šiandien'
  if (diff === 1) return 'Rytoj'
  return `Po ${diff}d.`
}
</script>
