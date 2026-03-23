<template>
  <div class="p-6 space-y-6" style="font-family:'Plus Jakarta Sans','Inter',sans-serif;">

    <!-- Back + Header -->
    <div>
      <button @click="navigateTo('/supplier/orders')"
        class="flex items-center gap-1.5 text-xs font-medium mb-4 cursor-pointer transition-opacity hover:opacity-70"
        style="color:#64748B;">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Grįžti į užsakymus
      </button>

      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-[22px] font-bold tracking-tight" style="color:#0F172A;">{{ order.id }}</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" :style="statusStyle(order.status)">
              <span class="w-1.5 h-1.5 rounded-full" style="background:currentColor;"></span>
              {{ statusLabel(order.status) }}
            </span>
          </div>
          <p class="text-sm" style="color:#64748B;">{{ order.part }} · {{ order.car }}</p>
          <p class="text-xs mt-1" style="color:#94A3B8;">Priimta: {{ order.accepted }} · Terminas: {{ order.deliveryDate }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="showInvoice = true"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-slate-100"
            style="background:#fff; border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Sąskaita
          </button>
          <button v-if="order.status === 'active'"
            @click="order.status = 'shipped'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style="background:#14A34A; color:#fff;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
            </svg>
            Pažymėti išsiųsta
          </button>
          <button v-if="order.status === 'shipped'"
            @click="order.status = 'done'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style="background:#14A34A; color:#fff;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Pažymėti pristatyta
          </button>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-3 gap-5">

      <!-- LEFT col (2/3) -->
      <div class="col-span-2 space-y-5">

        <!-- Progress timeline -->
        <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E8F0;">
          <h2 class="text-sm font-bold mb-5" style="color:#0F172A;">Vykdymo eiga</h2>
          <div class="relative">
            <!-- track line -->
            <div class="absolute top-4 left-4 right-4 h-0.5 rounded-full" style="background:#E2E8F0; z-index:0;"></div>
            <div class="absolute top-4 left-4 h-0.5 rounded-full transition-all duration-500"
              :style="`width:${progressWidth}%; background:linear-gradient(90deg,#14A34A,#22C55E); z-index:1;`"></div>

            <div class="relative flex justify-between" style="z-index:2;">
              <div v-for="(step, i) in steps" :key="step.key" class="flex flex-col items-center" style="width:80px;">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-2 transition-all duration-300"
                  :style="stepStyle(i)">
                  <svg v-if="stepDone(i)" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <div v-else-if="stepActive(i)" class="w-2 h-2 rounded-full" style="background:#fff;"></div>
                  <div v-else class="w-2 h-2 rounded-full" style="background:#CBD5E1;"></div>
                </div>
                <p class="text-center text-[10px] font-semibold leading-tight" :style="stepDone(i) || stepActive(i) ? 'color:#0F172A;' : 'color:#94A3B8;'">{{ step.label }}</p>
                <p v-if="step.date && (stepDone(i) || stepActive(i))" class="text-[10px] text-center mt-0.5" style="color:#94A3B8;">{{ step.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order details -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="px-5 py-4" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Užsakymo informacija</h2>
          </div>
          <div class="grid grid-cols-2 gap-0">
            <div v-for="(field, i) in orderFields" :key="field.label"
              class="px-5 py-3.5 flex flex-col gap-0.5"
              :style="i % 2 === 0 ? 'border-right:1px solid #F8FAFC;' : ''">
              <span class="text-[11px] font-medium" style="color:#94A3B8;">{{ field.label }}</span>
              <span class="text-sm font-semibold" style="color:#0F172A;">{{ field.value }}</span>
            </div>
          </div>
        </div>

        <!-- Invoice preview (line items) -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Sąskaita-faktūra</h2>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded" style="background:#F1F5F9; color:#475569;">SF-{{ order.id }}</span>
              <button @click="showInvoice = true"
                class="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-80"
                style="background:#EFF6FF; color:#3B82F6;">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Atsisiųsti PDF
              </button>
            </div>
          </div>

          <!-- Line items header -->
          <div class="grid px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
            style="grid-template-columns:1fr 60px 80px 90px; color:#94A3B8; border-bottom:1px solid #F1F5F9; background:#FAFAFA;">
            <span>Aprašymas</span>
            <span class="text-center">Kiekis</span>
            <span class="text-right">Vnt. kaina</span>
            <span class="text-right">Suma</span>
          </div>

          <!-- Line items -->
          <div v-for="item in invoice.items" :key="item.desc"
            class="grid px-5 py-3 items-center"
            style="grid-template-columns:1fr 60px 80px 90px; border-bottom:1px solid #F8FAFC;">
            <div>
              <p class="text-sm font-medium" style="color:#0F172A;">{{ item.desc }}</p>
              <p v-if="item.note" class="text-[11px] mt-0.5" style="color:#94A3B8;">{{ item.note }}</p>
            </div>
            <p class="text-sm text-center" style="color:#475569;">{{ item.qty }}</p>
            <p class="text-sm text-right" style="color:#475569;">€{{ item.unit }}</p>
            <p class="text-sm font-semibold text-right" style="color:#0F172A;">€{{ item.total }}</p>
          </div>

          <!-- Totals -->
          <div class="px-5 py-4 space-y-2">
            <div class="flex justify-end">
              <div class="w-56 space-y-2">
                <div class="flex justify-between text-sm">
                  <span style="color:#64748B;">Suma be PVM</span>
                  <span class="font-medium" style="color:#0F172A;">€{{ invoice.subtotal }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color:#64748B;">PVM (21%)</span>
                  <span class="font-medium" style="color:#0F172A;">€{{ invoice.vat }}</span>
                </div>
                <div class="h-px" style="background:#E2E8F0;"></div>
                <div class="flex justify-between">
                  <span class="text-sm font-bold" style="color:#0F172A;">Viso</span>
                  <span class="text-lg font-bold" style="color:#14A34A;">€{{ invoice.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes / Messages -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Pastabos ir žinutės</h2>
          </div>
          <div class="px-5 py-4 space-y-3">
            <div v-for="msg in messages" :key="msg.id" class="flex gap-3">
              <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                :style="`background:${msg.mine ? '#DCFCE7' : '#E0E7FF'}; color:${msg.mine ? '#14A34A' : '#6366F1'};`">
                {{ msg.initials }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-semibold" style="color:#0F172A;">{{ msg.name }}</span>
                  <span class="text-[11px]" style="color:#94A3B8;">{{ msg.time }}</span>
                </div>
                <p class="text-sm" style="color:#475569;">{{ msg.text }}</p>
              </div>
            </div>
          </div>
          <div class="px-5 pb-4 flex gap-2">
            <input v-model="newMessage" type="text" placeholder="Rašyti žinutę..."
              class="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none"
              style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;"
              @keydown.enter="sendMessage">
            <button @click="sendMessage"
              class="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
              style="background:#14A34A; color:#fff;">
              Siųsti
            </button>
          </div>
        </div>

      </div>

      <!-- RIGHT col (1/3) -->
      <div class="space-y-4">

        <!-- Payment status -->
        <div class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Mokėjimas</h3>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="order.paid ? 'background:#F0FDF4;' : 'background:#FFFBEB;'">
              <svg class="w-5 h-5" :style="order.paid ? 'color:#14A34A;' : 'color:#D97706;'" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="order.paid ? 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold" style="color:#0F172A;">{{ order.paid ? 'Apmokėta' : 'Laukiama' }}</p>
              <p class="text-xs" style="color:#64748B;">{{ order.paid ? order.paidDate : 'Mokėjimo terminas: ' + order.deliveryDate }}</p>
            </div>
          </div>
          <div class="rounded-lg px-3 py-2.5 flex items-center justify-between" style="background:#F8FAFC; border:1px solid #F1F5F9;">
            <span class="text-xs" style="color:#64748B;">Suma</span>
            <span class="text-sm font-bold" style="color:#0F172A;">€{{ invoice.total }}</span>
          </div>
          <div v-if="!order.paid" class="mt-3 rounded-lg px-3 py-2" style="background:#FFFBEB; border:1px solid #FDE68A;">
            <p class="text-xs" style="color:#92400E;">Mokėjimas gaunamas po pristatymo patvirtinimo iš kliento.</p>
          </div>
        </div>

        <!-- Client info -->
        <div class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Klientas</h3>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style="background:#E0E7FF; color:#6366F1;">
              {{ order.client.split(' ').map((w: string) => w[0]).slice(0, 2).join('') }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold truncate" style="color:#0F172A;">{{ order.client }}</p>
              <p class="text-xs truncate" style="color:#64748B;">{{ order.clientType }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="text-xs" style="color:#475569;">{{ order.clientEmail }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="text-xs" style="color:#475569;">{{ order.clientPhone }}</span>
            </div>
          </div>
          <button class="w-full mt-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style="background:#F0FDF4; color:#14A34A; border:1px solid #BBF7D0;">
            Rašyti žinutę
          </button>
        </div>

        <!-- Delivery details -->
        <div class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Pristatymo informacija</h3>
          <div class="space-y-2.5">
            <div>
              <p class="text-[11px] font-medium mb-0.5" style="color:#94A3B8;">Būdas</p>
              <p class="text-sm font-semibold" style="color:#0F172A;">{{ order.deliveryMethod }}</p>
            </div>
            <div>
              <p class="text-[11px] font-medium mb-0.5" style="color:#94A3B8;">Adresas</p>
              <p class="text-sm font-semibold" style="color:#0F172A;">{{ order.deliveryAddress }}</p>
            </div>
            <div>
              <p class="text-[11px] font-medium mb-0.5" style="color:#94A3B8;">Terminas</p>
              <p class="text-sm font-semibold" :style="`color:${deliveryColor};`">{{ order.deliveryDate }}</p>
            </div>
            <div v-if="order.trackingCode">
              <p class="text-[11px] font-medium mb-0.5" style="color:#94A3B8;">Sekimo kodas</p>
              <p class="text-sm font-mono font-semibold" style="color:#6366F1;">{{ order.trackingCode }}</p>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="rounded-xl p-4 space-y-2" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Veiksmai</h3>
          <button @click="showInvoice = true"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50"
            style="border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#6366F1;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Peržiūrėti sąskaitą
          </button>
          <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50"
            style="border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#3B82F6;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Spausdinti sąskaitą
          </button>
          <button v-if="order.status !== 'cancelled' && order.status !== 'done'"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-red-50"
            style="border:1px solid #FCA5A5; color:#EF4444;">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Atšaukti užsakymą
          </button>
        </div>

      </div>
    </div>

    <!-- Invoice modal -->
    <Teleport to="body">
      <div v-if="showInvoice" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);"
        @click.self="showInvoice = false">
        <div class="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style="background:#fff; max-height:90vh; overflow-y:auto;">

          <!-- Invoice header -->
          <div class="p-8 pb-6" style="background:linear-gradient(135deg,#14A34A,#16A34A 60%,#059669);">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:rgba(255,255,255,0.2);">
                    <svg class="w-4 h-4" fill="none" stroke="#fff" stroke-width="2.2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <span class="text-sm font-bold" style="color:rgba(255,255,255,0.9);">recar<span style="color:#fff;">pro</span></span>
                </div>
                <h2 class="text-2xl font-bold text-white mb-0.5">Sąskaita-faktūra</h2>
                <p class="text-sm font-mono" style="color:rgba(255,255,255,0.75);">SF-{{ order.id }}</p>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
                  :style="order.paid ? 'background:rgba(255,255,255,0.2); color:#fff;' : 'background:rgba(253,230,138,0.3); color:#FDE68A;'">
                  {{ order.paid ? 'Apmokėta' : 'Laukiama' }}
                </div>
                <p class="text-xs" style="color:rgba(255,255,255,0.7);">Išrašyta: {{ order.accepted }}</p>
                <p class="text-xs" style="color:rgba(255,255,255,0.7);">Terminas: {{ order.deliveryDate }}</p>
              </div>
            </div>
          </div>

          <!-- Invoice body -->
          <div class="p-8">
            <!-- From / To -->
            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider mb-2" style="color:#94A3B8;">Tiekėjas</p>
                <p class="text-sm font-bold" style="color:#0F172A;">UAB AutoDalys</p>
                <p class="text-xs mt-0.5" style="color:#64748B;">Gedimino pr. 45, Vilnius</p>
                <p class="text-xs" style="color:#64748B;">PVM kodas: LT100001234</p>
                <p class="text-xs" style="color:#64748B;">jonas@autodalys.lt</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider mb-2" style="color:#94A3B8;">Pirkėjas</p>
                <p class="text-sm font-bold" style="color:#0F172A;">{{ order.client }}</p>
                <p class="text-xs mt-0.5" style="color:#64748B;">{{ order.clientType }}</p>
                <p class="text-xs" style="color:#64748B;">{{ order.clientEmail }}</p>
                <p class="text-xs" style="color:#64748B;">{{ order.clientPhone }}</p>
              </div>
            </div>

            <!-- Items -->
            <div class="rounded-xl overflow-hidden mb-6" style="border:1px solid #E2E8F0;">
              <div class="grid px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
                style="grid-template-columns:1fr 60px 80px 90px; background:#FAFAFA; color:#94A3B8; border-bottom:1px solid #E2E8F0;">
                <span>Aprašymas</span>
                <span class="text-center">Kiekis</span>
                <span class="text-right">Vnt. kaina</span>
                <span class="text-right">Suma</span>
              </div>
              <div v-for="item in invoice.items" :key="item.desc"
                class="grid px-4 py-3 items-center"
                style="grid-template-columns:1fr 60px 80px 90px; border-bottom:1px solid #F8FAFC;">
                <div>
                  <p class="text-sm font-medium" style="color:#0F172A;">{{ item.desc }}</p>
                  <p v-if="item.note" class="text-[11px]" style="color:#94A3B8;">{{ item.note }}</p>
                </div>
                <p class="text-sm text-center" style="color:#475569;">{{ item.qty }}</p>
                <p class="text-sm text-right" style="color:#475569;">€{{ item.unit }}</p>
                <p class="text-sm font-semibold text-right" style="color:#0F172A;">€{{ item.total }}</p>
              </div>
            </div>

            <!-- Totals -->
            <div class="flex justify-end mb-8">
              <div class="w-60 space-y-2">
                <div class="flex justify-between text-sm">
                  <span style="color:#64748B;">Suma be PVM</span>
                  <span class="font-medium" style="color:#0F172A;">€{{ invoice.subtotal }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color:#64748B;">PVM (21%)</span>
                  <span class="font-medium" style="color:#0F172A;">€{{ invoice.vat }}</span>
                </div>
                <div class="h-px" style="background:#E2E8F0;"></div>
                <div class="flex justify-between">
                  <span class="font-bold" style="color:#0F172A;">Viso mokėti</span>
                  <span class="text-xl font-bold" style="color:#14A34A;">€{{ invoice.total }}</span>
                </div>
              </div>
            </div>

            <!-- Footer note -->
            <div class="rounded-lg px-4 py-3 text-xs" style="background:#F8FAFC; color:#94A3B8;">
              Sąskaita sugeneruota per recar platformą · recar.lt · Mokėjimas vykdomas per platformą
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6">
              <button @click="showInvoice = false"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100"
                style="border:1px solid #E2E8F0; color:#475569;">
                Uždaryti
              </button>
              <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
                style="background:#14A34A; color:#fff;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Atsisiųsti PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'supplier' })

const route = useRoute()
const showInvoice = ref(false)
const newMessage = ref('')

// Mock order data keyed by route param
const ordersMap: Record<string, any> = {
  'UZK-2847': {
    id: 'UZK-2847', part: 'Priekinis bamperis (M-packet)', car: 'BMW E60 520d',
    client: 'UAB Draudimas LT', clientType: 'Draudimo įmonė',
    clientEmail: 'info@draudimas.lt', clientPhone: '+370 5 123 4567',
    amount: '185', status: 'active',
    deliveryDate: '2026-03-25', accepted: '2026-03-20',
    deliveryMethod: 'Kurjeris (DPD)', deliveryAddress: 'Gedimino pr. 1, Vilnius',
    trackingCode: null, paid: false, paidDate: null,
  },
  'UZK-2851': {
    id: 'UZK-2851', part: 'Variklio dangtis', car: 'Audi A4 B8',
    client: 'If P&C Insurance', clientType: 'Draudimo įmonė',
    clientEmail: 'claims@if.lt', clientPhone: '+370 5 246 8000',
    amount: '320', status: 'shipped',
    deliveryDate: '2026-03-23', accepted: '2026-03-18',
    deliveryMethod: 'Kurjeris (DPD)', deliveryAddress: 'Konstitucijos pr. 7, Vilnius',
    trackingCode: 'DPD-LT-2847432', paid: false, paidDate: null,
  },
  'UZK-2839': {
    id: 'UZK-2839', part: 'Dešinės pusės veidrodis', car: 'VW Golf VII',
    client: 'Ergo Lietuva', clientType: 'Draudimo įmonė',
    clientEmail: 'claims@ergo.lt', clientPhone: '+370 5 252 7777',
    amount: '65', status: 'done',
    deliveryDate: '2026-03-18', accepted: '2026-03-12',
    deliveryMethod: 'Atsiėmimas', deliveryAddress: 'Lvovo g. 25, Vilnius',
    trackingCode: null, paid: true, paidDate: '2026-03-19',
  },
}

const id = route.params.id as string
const order = ref(ordersMap[id] ?? {
  id, part: 'Dalis', car: 'Automobilis',
  client: 'Klientas', clientType: 'Įmonė',
  clientEmail: 'info@example.lt', clientPhone: '+370 600 00000',
  amount: '0', status: 'active',
  deliveryDate: '2026-03-30', accepted: '2026-03-23',
  deliveryMethod: 'Kurjeris', deliveryAddress: '—',
  trackingCode: null, paid: false, paidDate: null,
})

useHead({ title: `${order.value.id} — recar PRO` })

// Timeline steps
const steps = computed(() => [
  { key: 'query',    label: 'Užklausa\ngauta',        date: order.value.accepted },
  { key: 'offer',   label: 'Pasiūlymas\npateiktas',   date: order.value.accepted },
  { key: 'accepted',label: 'Pasiūlymas\npriimtas',    date: order.value.accepted },
  { key: 'shipped', label: 'Dalys\nišsiųstos',         date: order.value.status === 'shipped' || order.value.status === 'done' ? order.value.deliveryDate : null },
  { key: 'done',    label: 'Pristatyta\n& Užbaigta',  date: order.value.status === 'done' ? order.value.paidDate : null },
])

const stepIndex = computed(() => {
  const s = order.value.status
  if (s === 'done')      return 4
  if (s === 'shipped')   return 3
  if (s === 'active')    return 2
  return 1
})

const progressWidth = computed(() => {
  return (stepIndex.value / (steps.value.length - 1)) * 100
})

function stepDone(i: number) { return i < stepIndex.value }
function stepActive(i: number) { return i === stepIndex.value }

function stepStyle(i: number) {
  if (stepDone(i))   return 'background:#14A34A; color:#fff; box-shadow:0 0 0 3px #DCFCE7;'
  if (stepActive(i)) return 'background:#14A34A; color:#fff; box-shadow:0 0 0 4px #DCFCE7;'
  return 'background:#F1F5F9; color:#94A3B8;'
}

// Invoice data
const baseAmount = parseFloat(order.value.amount)
const invoice = computed(() => {
  const items = [
    { desc: order.value.part, note: order.value.car + ' · OEM kokybė', qty: 1, unit: order.value.amount, total: order.value.amount },
    { desc: 'Pristatymo mokestis', note: order.value.deliveryMethod, qty: 1, unit: '8.00', total: '8.00' },
  ]
  const subtotal = (baseAmount + 8).toFixed(2)
  const vat = ((baseAmount + 8) * 0.21).toFixed(2)
  const total = ((baseAmount + 8) * 1.21).toFixed(2)
  return { items, subtotal, vat, total }
})

// Order meta fields
const orderFields = computed(() => [
  { label: 'Užsakymo ID',    value: order.value.id },
  { label: 'Statusas',       value: statusLabel(order.value.status) },
  { label: 'Dalis',          value: order.value.part },
  { label: 'Automobilis',    value: order.value.car },
  { label: 'Priimta',        value: order.value.accepted },
  { label: 'Pristatymo data',value: order.value.deliveryDate },
  { label: 'Pristatymo būdas', value: order.value.deliveryMethod },
  { label: 'Suma',           value: '€' + order.value.amount },
])

// Delivery colour
const deliveryColor = computed(() => {
  if (order.value.status === 'done') return '#14A34A'
  const diff = new Date(order.value.deliveryDate).getTime() - new Date('2026-03-23').getTime()
  if (diff < 0)         return '#EF4444'
  if (diff < 86400000)  return '#EA580C'
  if (diff < 172800000) return '#D97706'
  return '#475569'
})

// Messages
const messages = ref([
  { id: 1, initials: 'DL', name: 'UAB Draudimas LT', time: 'prieš 2 val.', text: 'Prašome patvirtinti, ar dalis yra originali (OEM) ar ekvivalentinė. Taip pat ar galima pristatyti iki penktadienio?', mine: false },
  { id: 2, initials: 'JK', name: 'Jonas K. (Jūs)',   time: 'prieš 1 val.', text: 'Taip, dalis yra originali OEM. Pristatymas galimas ketvirtadienį, 2026-03-25. Sekimo kodas bus išsiųstas išsiuntus.', mine: true },
])

function sendMessage() {
  if (!newMessage.value.trim()) return
  messages.value.push({
    id: Date.now(), initials: 'JK', name: 'Jonas K. (Jūs)',
    time: 'ką tik', text: newMessage.value, mine: true,
  })
  newMessage.value = ''
}

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
</script>
