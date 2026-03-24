<template>
  <div class="p-6 space-y-6" style="font-family:'Plus Jakarta Sans','Inter',sans-serif;">

    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[22px] font-bold tracking-tight" style="color:#0F172A;">Užsakymai</h1>
        <p class="text-sm mt-0.5" style="color:#64748B;">Priimtų pasiūlymų vykdymas ir istorija</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-slate-100"
          style="background:#fff; border:1px solid #E2E8F0; color:#475569;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Eksportuoti
        </button>
        <button class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
          style="background:#3B82F6; color:#fff;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nauja užklausa
        </button>
      </div>
    </div>

    <!-- KPI cards -->
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

    <!-- Filters -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1 max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Ieškoti pagal ID, dalį, tiekėją..."
          class="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none"
          style="background:#fff; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
      </div>

      <!-- Date range -->
      <select v-model="dateFilter"
        class="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
        style="background:#fff; border:1px solid #E2E8F0; color:#475569; font-family:inherit;">
        <option value="all">Visi laikotarpiai</option>
        <option value="month">Šis mėnuo</option>
        <option value="quarter">Šis ketvirtis</option>
        <option value="year">Šie metai</option>
      </select>

      <!-- Status tabs -->
      <div class="flex items-center gap-1 ml-auto p-1 rounded-lg" style="background:#F1F5F9;">
        <button v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all"
          :style="activeTab === tab.key
            ? 'background:#fff; color:#0F172A; box-shadow:0 1px 3px rgba(0,0,0,0.08);'
            : 'color:#64748B;'">
          {{ tab.label }}
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            :style="activeTab === tab.key ? `background:${tab.color}15; color:${tab.color}` : 'background:#E2E8F0; color:#94A3B8;'">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Orders table -->
    <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">

      <div class="grid items-center px-5 py-3 text-[11px] font-semibold uppercase tracking-wide"
        style="grid-template-columns:100px 1fr 150px 120px 100px 110px 110px 60px; color:#94A3B8; border-bottom:1px solid #F1F5F9; background:#FAFAFA;">
        <span>Užsakymas</span>
        <span>Dalis / Automobilis</span>
        <span>Tiekėjas</span>
        <span>Pristatymas</span>
        <span class="text-right">Suma</span>
        <span class="text-center">Mokėjimas</span>
        <span class="text-center">Statusas</span>
        <span></span>
      </div>

      <div v-if="filteredOrders.length === 0" class="py-16 text-center">
        <svg class="w-10 h-10 mx-auto mb-3" style="color:#E2E8F0;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <p class="text-sm font-medium" style="color:#94A3B8;">Užsakymų nerasta</p>
      </div>

      <div v-for="order in filteredOrders" :key="order.id"
        @click="navigateTo(`/buyer/orders/${order.id}`)"
        class="grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-slate-50"
        style="grid-template-columns:100px 1fr 150px 120px 100px 110px 110px 60px; border-bottom:1px solid #F8FAFC;">

        <div>
          <span class="text-xs font-mono font-bold" style="color:#3B82F6;">{{ order.id }}</span>
        </div>

        <div class="min-w-0 pr-3">
          <p class="text-sm font-semibold truncate" style="color:#0F172A;">{{ order.part }}</p>
          <p class="text-xs truncate mt-0.5" style="color:#64748B;">{{ order.car }}</p>
        </div>

        <div class="min-w-0 flex items-center gap-2">
          <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style="background:#DCFCE7; color:#14A34A;">
            {{ order.supplier.split(' ').map((w: string) => w[0]).slice(0,2).join('') }}
          </div>
          <p class="text-xs font-medium truncate" style="color:#475569;">{{ order.supplier }}</p>
        </div>

        <div>
          <p class="text-xs font-medium" style="color:#475569;">{{ order.deliveryDate }}</p>
          <p class="text-[11px] mt-0.5" :style="`color:${deliveryColor(order)}`">{{ deliveryLabel(order) }}</p>
        </div>

        <div class="text-right">
          <p class="text-sm font-bold" style="color:#0F172A;">€{{ order.amount }}</p>
          <p class="text-[11px] mt-0.5" style="color:#94A3B8;">su PVM</p>
        </div>

        <div class="flex justify-center">
          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
            :style="order.paid ? 'background:#F0FDF4; color:#14A34A;' : 'background:#FFFBEB; color:#D97706;'">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="order.paid ? 'M5 13l4 4L19 7' : 'M12 8v4l3 3'"/>
            </svg>
            {{ order.paid ? 'Apmokėta' : 'Laukiama' }}
          </span>
        </div>

        <div class="flex justify-center">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" :style="statusStyle(order.status)">
            <span class="w-1.5 h-1.5 rounded-full" style="background:currentColor;"></span>
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <div class="flex justify-end">
          <svg class="w-3.5 h-3.5" style="color:#CBD5E1;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <div class="flex items-center justify-between px-5 py-3" style="border-top:1px solid #F1F5F9;">
        <p class="text-xs" style="color:#94A3B8;">Rodoma {{ filteredOrders.length }} iš {{ allOrders.length }} užsakymų</p>
        <div class="flex items-center gap-1">
          <button v-for="p in 3" :key="p"
            class="w-7 h-7 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            :style="p === 1 ? 'background:#3B82F6; color:#fff;' : 'color:#64748B;'">{{ p }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'buyer' })
useHead({ title: 'Užsakymai — recar BUY' })

const search     = ref('')
const activeTab  = ref('all')
const dateFilter = ref('all')

const tabs = [
  { key: 'all',      label: 'Visi',      count: 22, color: '#0F172A' },
  { key: 'active',   label: 'Vykdomi',   count: 5,  color: '#3B82F6' },
  { key: 'shipped',  label: 'Išsiųsti',  count: 3,  color: '#F59E0B' },
  { key: 'done',     label: 'Užbaigti',  count: 14, color: '#14A34A' },
  { key: 'cancelled',label: 'Atšaukti',  count: 0,  color: '#EF4444' },
]

const kpis = [
  { label: 'Aktyvūs užsakymai', value: '5', trend: '3 laukia pristatymo', trendColor: '#3B82F6',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { label: 'Laukia apmokėjimo', value: '2', trend: '€ 387 iš viso', trendColor: '#D97706',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', iconBg: '#FFFBEB', iconColor: '#F59E0B' },
  { label: 'Užbaigti šį mėnesį', value: '14', trend: '↑ 4 vs praėjęs mėn.', trendColor: '#14A34A',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', iconBg: '#F0FDF4', iconColor: '#14A34A' },
  { label: 'Išleista šį mėnesį', value: '€4 218', trend: '↓ 8% vs praėjęs', trendColor: '#14A34A',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
]

const allOrders = [
  { id: 'UZK-2847', part: 'Priekinis bamperis (M-packet)', car: 'BMW E60 520d',        supplier: 'UAB AutoDalys',    amount: '223.85', status: 'active',    deliveryDate: '2026-03-25', paid: false },
  { id: 'UZK-2851', part: 'Variklio dangtis',              car: 'Audi A4 B8',          supplier: 'SIA DalysFix',     amount: '387.20', status: 'shipped',   deliveryDate: '2026-03-23', paid: false },
  { id: 'UZK-2839', part: 'Dešinės pusės veidrodis',       car: 'VW Golf VII',         supplier: 'UAB AutoDalys',    amount: '78.65',  status: 'done',      deliveryDate: '2026-03-18', paid: true  },
  { id: 'UZK-2835', part: 'Kairės pusės durys',            car: 'Skoda Octavia A5',    supplier: 'MB SpareNow',      amount: '580.80', status: 'done',      deliveryDate: '2026-03-15', paid: true  },
  { id: 'UZK-2853', part: 'Priekinė transmisija',          car: 'Ford Focus III',      supplier: 'UAB AutoDalys',    amount: '350.90', status: 'active',    deliveryDate: '2026-03-27', paid: false },
  { id: 'UZK-2848', part: 'Galinis buferis',               car: 'Toyota Corolla E12',  supplier: 'SIA DalysFix',     amount: '145.20', status: 'shipped',   deliveryDate: '2026-03-24', paid: false },
  { id: 'UZK-2844', part: 'Vairas su pagalvėle',           car: 'Mercedes C W204',     supplier: 'MB SpareNow',      amount: '496.10', status: 'active',    deliveryDate: '2026-03-28', paid: false },
  { id: 'UZK-2842', part: 'Stabdžių diskai (kompl.)',      car: 'Honda Civic IX',      supplier: 'UAB AutoDalys',    amount: '114.95', status: 'done',      deliveryDate: '2026-03-14', paid: true  },
  { id: 'UZK-2840', part: 'Priekinis stiklas',             car: 'Renault Megane III',  supplier: 'SIA DalysFix',     amount: '290.40', status: 'done',      deliveryDate: '2026-03-16', paid: true  },
  { id: 'UZK-2836', part: 'Priekiniai žibintai (kompl.)', car: 'BMW E90 325i',        supplier: 'MB SpareNow',      amount: '677.60', status: 'done',      deliveryDate: '2026-03-12', paid: true  },
  { id: 'UZK-2831', part: 'Katalizatorius',                car: 'Peugeot 308 II',      supplier: 'UAB AutoDalys',    amount: '223.85', status: 'done',      deliveryDate: '2026-03-10', paid: true  },
  { id: 'UZK-2855', part: 'Alternatorius',                 car: 'Opel Astra H',        supplier: 'SIA DalysFix',     amount: '175.45', status: 'active',    deliveryDate: '2026-03-29', paid: false },
  { id: 'UZK-2856', part: 'Šildytuvo radiatorius',         car: 'Volvo V70 III',       supplier: 'MB SpareNow',      amount: '266.20', status: 'active',    deliveryDate: '2026-03-30', paid: false },
  { id: 'UZK-2857', part: 'Kuro siurblys',                 car: 'BMW X5 E53',          supplier: 'UAB AutoDalys',    amount: '459.80', status: 'shipped',   deliveryDate: '2026-03-24', paid: false },
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
      o.supplier.toLowerCase().includes(q)
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
  if (diff < 0)   return 'Vėluoja!'
  if (diff === 0) return 'Šiandien'
  if (diff === 1) return 'Rytoj'
  return `Po ${diff}d.`
}
</script>
