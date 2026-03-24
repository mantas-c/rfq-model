<template>
  <div class="p-6 space-y-6" style="font-family:'Plus Jakarta Sans','Inter',sans-serif;">

    <!-- Back + header -->
    <div>
      <button @click="navigateTo('/buyer/orders')"
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
          <p class="text-xs mt-1" style="color:#94A3B8;">Priimtas: {{ order.accepted }} · Terminas: {{ order.deliveryDate }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="showInvoice = true"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-slate-100"
            style="background:#fff; border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Sąskaita
          </button>
          <!-- Rate supplier (only after done + not rated) -->
          <button v-if="order.status === 'done' && !rated"
            @click="showRating = true"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style="background:#F59E0B; color:#fff;">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Įvertinti tiekėją
          </button>
          <div v-if="order.status === 'done' && rated"
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
            style="background:#F0FDF4; color:#14A34A; border:1px solid #BBF7D0;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Įvertinta {{ ratingValue }}★
          </div>
          <!-- Confirm received (shipped → done) -->
          <button v-if="order.status === 'shipped'"
            @click="order.status = 'done'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style="background:#14A34A; color:#fff;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Patvirtinti gavimą
          </button>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-3 gap-5">

      <!-- LEFT (2/3) -->
      <div class="col-span-2 space-y-5">

        <!-- Progress timeline -->
        <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E8F0;">
          <h2 class="text-sm font-bold mb-5" style="color:#0F172A;">Užsakymo eiga</h2>
          <div class="relative">
            <div class="absolute top-4 left-4 right-4 h-0.5 rounded-full" style="background:#E2E8F0;"></div>
            <div class="absolute top-4 left-4 h-0.5 rounded-full transition-all duration-500"
              :style="`width:${progressWidth}%; background:linear-gradient(90deg,#3B82F6,#60A5FA); z-index:1;`"></div>
            <div class="relative flex justify-between" style="z-index:2;">
              <div v-for="(step, i) in steps" :key="step.key" class="flex flex-col items-center" style="width:80px;">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-2 transition-all"
                  :style="stepStyle(i)">
                  <svg v-if="stepDone(i)" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <div v-else-if="stepActive(i)" class="w-2 h-2 rounded-full" style="background:#fff;"></div>
                  <div v-else class="w-2 h-2 rounded-full" style="background:#CBD5E1;"></div>
                </div>
                <p class="text-center text-[10px] font-semibold leading-tight whitespace-pre-line"
                  :style="stepDone(i)||stepActive(i) ? 'color:#0F172A;' : 'color:#94A3B8;'">{{ step.label }}</p>
                <p v-if="step.date && (stepDone(i)||stepActive(i))" class="text-[10px] text-center mt-0.5" style="color:#94A3B8;">{{ step.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery tracking (shown when shipped) -->
        <div v-if="order.status === 'shipped' || order.status === 'done'"
          class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="px-5 py-4 flex items-center justify-between" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Pristatymo sekimas</h2>
            <span v-if="order.trackingCode" class="text-xs font-mono font-bold px-2 py-0.5 rounded" style="background:#EFF6FF; color:#3B82F6;">{{ order.trackingCode }}</span>
          </div>
          <div class="px-5 py-4 space-y-3">
            <div v-for="event in trackingEvents" :key="event.id" class="flex gap-3">
              <div class="flex flex-col items-center">
                <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5" :style="`background:${event.active ? '#3B82F6' : '#E2E8F0'};`"></div>
                <div v-if="event.id < trackingEvents.length" class="w-px flex-1 mt-1" style="background:#E2E8F0; min-height:20px;"></div>
              </div>
              <div class="pb-3">
                <p class="text-sm font-semibold" :style="`color:${event.active ? '#0F172A' : '#94A3B8'};`">{{ event.title }}</p>
                <p class="text-xs mt-0.5" style="color:#94A3B8;">{{ event.location }} · {{ event.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice section -->
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
          <div class="grid px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
            style="grid-template-columns:1fr 60px 80px 90px; color:#94A3B8; border-bottom:1px solid #F1F5F9; background:#FAFAFA;">
            <span>Aprašymas</span><span class="text-center">Kiekis</span><span class="text-right">Vnt. kaina</span><span class="text-right">Suma</span>
          </div>
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
          <div class="px-5 py-4">
            <div class="flex justify-end">
              <div class="w-56 space-y-2">
                <div class="flex justify-between text-sm"><span style="color:#64748B;">Suma be PVM</span><span class="font-medium" style="color:#0F172A;">€{{ invoice.subtotal }}</span></div>
                <div class="flex justify-between text-sm"><span style="color:#64748B;">PVM (21%)</span><span class="font-medium" style="color:#0F172A;">€{{ invoice.vat }}</span></div>
                <div class="h-px" style="background:#E2E8F0;"></div>
                <div class="flex justify-between">
                  <span class="text-sm font-bold" style="color:#0F172A;">Viso</span>
                  <span class="text-lg font-bold" style="color:#3B82F6;">€{{ invoice.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="px-5 py-4" style="border-bottom:1px solid #E2E8F0;">
            <h2 class="text-sm font-bold" style="color:#0F172A;">Žinutės su tiekėju</h2>
          </div>
          <div class="px-5 py-4 space-y-3">
            <div v-for="msg in messages" :key="msg.id" class="flex gap-3" :class="msg.mine ? 'flex-row-reverse' : ''">
              <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                :style="`background:${msg.mine ? '#EFF6FF' : '#DCFCE7'}; color:${msg.mine ? '#3B82F6' : '#14A34A'};`">
                {{ msg.initials }}
              </div>
              <div class="flex-1 max-w-xs" :class="msg.mine ? 'items-end' : 'items-start'" style="display:flex; flex-direction:column;">
                <div class="rounded-xl px-3.5 py-2.5 mb-1"
                  :style="msg.mine ? 'background:#EFF6FF; color:#1E40AF;' : 'background:#F8FAFC; color:#475569; border:1px solid #E2E8F0;'">
                  <p class="text-sm">{{ msg.text }}</p>
                </div>
                <p class="text-[11px]" style="color:#94A3B8;">{{ msg.name }} · {{ msg.time }}</p>
              </div>
            </div>
          </div>
          <div class="px-5 pb-4 flex gap-2">
            <input v-model="newMessage" type="text" placeholder="Rašyti tiekėjui..."
              class="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none"
              style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;"
              @keydown.enter="sendMessage">
            <button @click="sendMessage"
              class="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
              style="background:#3B82F6; color:#fff;">Siųsti</button>
          </div>
        </div>

      </div>

      <!-- RIGHT (1/3) -->
      <div class="space-y-4">

        <!-- Payment -->
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
              <p class="text-sm font-bold" style="color:#0F172A;">{{ order.paid ? 'Apmokėta' : 'Laukiama mokėjimo' }}</p>
              <p class="text-xs" style="color:#64748B;">{{ order.paid ? 'Sėkmingai apmokėta' : 'Mokama po pristatymo patvirtinimo' }}</p>
            </div>
          </div>
          <div class="rounded-lg px-3 py-2.5 flex justify-between items-center mb-2" style="background:#F8FAFC; border:1px solid #F1F5F9;">
            <span class="text-xs" style="color:#64748B;">Suma</span>
            <span class="text-sm font-bold" style="color:#0F172A;">€{{ invoice.total }}</span>
          </div>
          <button v-if="!order.paid && order.status === 'done'"
            @click="order.paid = true"
            class="w-full py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style="background:#3B82F6; color:#fff;">
            Apmokėti dabar
          </button>
          <div v-if="order.paid"
            class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
            style="background:#F0FDF4; color:#14A34A;">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Apmokėta sėkmingai
          </div>
        </div>

        <!-- Supplier info -->
        <div class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Tiekėjas</h3>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style="background:#DCFCE7; color:#14A34A;">
              {{ order.supplier.split(' ').map((w: string) => w[0]).slice(0,2).join('') }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold truncate" style="color:#0F172A;">{{ order.supplier }}</p>
              <div class="flex items-center gap-1 mt-0.5">
                <span v-for="s in 5" :key="s" class="text-[11px]" :style="s <= Math.round(order.supplierRating) ? 'color:#F59E0B;' : 'color:#E2E8F0;'">★</span>
                <span class="text-[11px] ml-1" style="color:#64748B;">{{ order.supplierRating }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="text-xs" style="color:#475569;">{{ order.supplierEmail }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-xs" style="color:#475569;">{{ order.supplierCity }}</span>
            </div>
          </div>
        </div>

        <!-- Order info -->
        <div class="rounded-xl p-4" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Užsakymo duomenys</h3>
          <div class="space-y-2.5">
            <div v-for="f in orderFields" :key="f.label">
              <p class="text-[11px] font-medium" style="color:#94A3B8;">{{ f.label }}</p>
              <p class="text-sm font-semibold mt-0.5" style="color:#0F172A;">{{ f.value }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="rounded-xl p-4 space-y-2" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-xs font-bold mb-3" style="color:#0F172A;">Veiksmai</h3>
          <button @click="showInvoice = true"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50"
            style="border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#3B82F6;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Peržiūrėti sąskaitą
          </button>
          <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50"
            style="border:1px solid #E2E8F0; color:#475569;">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#14A34A;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Pateikti pretenziją
          </button>
        </div>

      </div>
    </div>

    <!-- Rating modal -->
    <Teleport to="body">
      <div v-if="showRating" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);"
        @click.self="showRating = false">
        <div class="w-full max-w-md rounded-2xl p-8 shadow-2xl" style="background:#fff;">
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background:#FFFBEB;">
              <svg class="w-7 h-7" style="color:#F59E0B;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-1" style="color:#0F172A;">Įvertinkite tiekėją</h3>
            <p class="text-sm" style="color:#64748B;">{{ order.supplier }} · {{ order.id }}</p>
          </div>

          <!-- Stars -->
          <div class="flex justify-center gap-2 mb-6">
            <button v-for="s in 5" :key="s" @click="ratingValue = s" class="cursor-pointer transition-transform hover:scale-110">
              <svg class="w-10 h-10" :style="`color:${s <= ratingValue ? '#F59E0B' : '#E2E8F0'};`" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          </div>
          <p v-if="ratingValue" class="text-center text-sm font-semibold mb-5"
            :style="`color:${ratingValue >= 4 ? '#14A34A' : ratingValue === 3 ? '#D97706' : '#EF4444'};`">
            {{ ['', 'Labai blogai', 'Blogai', 'Vidutiniškai', 'Gerai', 'Puikiai!'][ratingValue] }}
          </p>

          <textarea v-model="ratingComment" rows="3" placeholder="Komentaras (neprivaloma)..."
            class="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none resize-none mb-4"
            style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;"></textarea>

          <div class="flex gap-3">
            <button @click="showRating = false"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100"
              style="border:1px solid #E2E8F0; color:#475569;">Atšaukti</button>
            <button @click="submitRating"
              :disabled="!ratingValue"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-opacity"
              :style="ratingValue ? 'background:#F59E0B; color:#fff; opacity:1;' : 'background:#F1F5F9; color:#94A3B8; opacity:1; cursor:not-allowed;'">
              Pateikti įvertinimą
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Invoice modal -->
    <Teleport to="body">
      <div v-if="showInvoice" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);"
        @click.self="showInvoice = false">
        <div class="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style="background:#fff; max-height:90vh; overflow-y:auto;">

          <div class="p-8 pb-6" style="background:linear-gradient(135deg,#2563EB,#3B82F6 60%,#60A5FA);">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:rgba(255,255,255,0.2);">
                    <svg class="w-4 h-4" fill="none" stroke="#fff" stroke-width="2.2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <span class="text-sm font-bold" style="color:rgba(255,255,255,0.9);">recar<span style="color:#fff;">buy</span></span>
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

          <div class="p-8">
            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider mb-2" style="color:#94A3B8;">Tiekėjas</p>
                <p class="text-sm font-bold" style="color:#0F172A;">{{ order.supplier }}</p>
                <p class="text-xs mt-0.5" style="color:#64748B;">{{ order.supplierCity }}</p>
                <p class="text-xs" style="color:#64748B;">{{ order.supplierEmail }}</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider mb-2" style="color:#94A3B8;">Pirkėjas</p>
                <p class="text-sm font-bold" style="color:#0F172A;">UAB Draudimas LT</p>
                <p class="text-xs mt-0.5" style="color:#64748B;">Draudimo kompanija</p>
                <p class="text-xs" style="color:#64748B;">info@draudimas.lt</p>
              </div>
            </div>

            <div class="rounded-xl overflow-hidden mb-6" style="border:1px solid #E2E8F0;">
              <div class="grid px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
                style="grid-template-columns:1fr 60px 80px 90px; background:#FAFAFA; color:#94A3B8; border-bottom:1px solid #E2E8F0;">
                <span>Aprašymas</span><span class="text-center">Kiekis</span><span class="text-right">Vnt. kaina</span><span class="text-right">Suma</span>
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

            <div class="flex justify-end mb-8">
              <div class="w-60 space-y-2">
                <div class="flex justify-between text-sm"><span style="color:#64748B;">Suma be PVM</span><span class="font-medium" style="color:#0F172A;">€{{ invoice.subtotal }}</span></div>
                <div class="flex justify-between text-sm"><span style="color:#64748B;">PVM (21%)</span><span class="font-medium" style="color:#0F172A;">€{{ invoice.vat }}</span></div>
                <div class="h-px" style="background:#E2E8F0;"></div>
                <div class="flex justify-between">
                  <span class="font-bold" style="color:#0F172A;">Viso mokėti</span>
                  <span class="text-xl font-bold" style="color:#3B82F6;">€{{ invoice.total }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-lg px-4 py-3 text-xs mb-6" style="background:#F8FAFC; color:#94A3B8;">
              Sąskaita sugeneruota per recar platformą · recar.lt · Mokėjimas vykdomas per platformą
            </div>

            <div class="flex gap-3">
              <button @click="showInvoice = false"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100"
                style="border:1px solid #E2E8F0; color:#475569;">Uždaryti</button>
              <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
                style="background:#3B82F6; color:#fff;">
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
definePageMeta({ layout: 'buyer' })

const route = useRoute()
const showInvoice = ref(false)
const showRating  = ref(false)
const rated       = ref(false)
const ratingValue = ref(0)
const ratingComment = ref('')
const newMessage  = ref('')

const ordersMap: Record<string, any> = {
  'UZK-2847': { id: 'UZK-2847', part: 'Priekinis bamperis (M-packet)', car: 'BMW E60 520d',
    supplier: 'UAB AutoDalys', supplierRating: 4.9, supplierEmail: 'info@autodalys.lt', supplierCity: 'Vilnius, LT',
    amount: '185', status: 'active', deliveryDate: '2026-03-25', accepted: '2026-03-20',
    deliveryMethod: 'Kurjeris (DPD)', trackingCode: null, paid: false },
  'UZK-2851': { id: 'UZK-2851', part: 'Variklio dangtis', car: 'Audi A4 B8',
    supplier: 'SIA DalysFix', supplierRating: 4.7, supplierEmail: 'orders@dalysfix.lv', supplierCity: 'Ryga, LV',
    amount: '320', status: 'shipped', deliveryDate: '2026-03-23', accepted: '2026-03-18',
    deliveryMethod: 'Kurjeris (DPD)', trackingCode: 'DPD-LT-2847432', paid: false },
  'UZK-2839': { id: 'UZK-2839', part: 'Dešinės pusės veidrodis', car: 'VW Golf VII',
    supplier: 'UAB AutoDalys', supplierRating: 4.9, supplierEmail: 'info@autodalys.lt', supplierCity: 'Vilnius, LT',
    amount: '65', status: 'done', deliveryDate: '2026-03-18', accepted: '2026-03-12',
    deliveryMethod: 'Atsiėmimas', trackingCode: null, paid: true },
}

const id = route.params.id as string
const order = ref(ordersMap[id] ?? {
  id, part: 'Dalis', car: 'Automobilis',
  supplier: 'Tiekėjas', supplierRating: 4.5, supplierEmail: 'info@example.lt', supplierCity: 'Vilnius',
  amount: '0', status: 'active', deliveryDate: '2026-03-30', accepted: '2026-03-23',
  deliveryMethod: 'Kurjeris', trackingCode: null, paid: false,
})

useHead({ title: `${order.value.id} — recar BUY` })

const steps = computed(() => [
  { key: 'query',    label: 'Užklausa\nsiųsta',      date: order.value.accepted },
  { key: 'offer',   label: 'Pasiūlymas\ngautas',     date: order.value.accepted },
  { key: 'accepted',label: 'Pasiūlymas\npriimtas',   date: order.value.accepted },
  { key: 'shipped', label: 'Dalys\nišsiųstos',       date: order.value.status === 'shipped' || order.value.status === 'done' ? order.value.deliveryDate : null },
  { key: 'done',    label: 'Pristatyta\n& Baigta',   date: order.value.status === 'done' ? order.value.deliveryDate : null },
])

const stepIndex = computed(() => {
  const s = order.value.status
  if (s === 'done')    return 4
  if (s === 'shipped') return 3
  if (s === 'active')  return 2
  return 1
})

const progressWidth = computed(() => (stepIndex.value / (steps.value.length - 1)) * 100)
function stepDone(i: number)   { return i < stepIndex.value }
function stepActive(i: number) { return i === stepIndex.value }
function stepStyle(i: number) {
  if (stepDone(i))   return 'background:#3B82F6; color:#fff; box-shadow:0 0 0 3px #DBEAFE;'
  if (stepActive(i)) return 'background:#3B82F6; color:#fff; box-shadow:0 0 0 4px #DBEAFE;'
  return 'background:#F1F5F9; color:#94A3B8;'
}

// Tracking events for shipped/done
const trackingEvents = computed(() => {
  if (order.value.status === 'done') return [
    { id: 1, title: 'Pristatyta gavėjui', location: 'Vilnius', time: order.value.deliveryDate, active: true },
    { id: 2, title: 'Išvyko iš paskirstymo centro', location: 'Vilnius logistikos centras', time: '2026-03-22 14:30', active: false },
    { id: 3, title: 'Priimta į sandėlį', location: 'Kaunas', time: '2026-03-21 09:15', active: false },
    { id: 4, title: 'Išsiųsta tiekėjo', location: order.value.supplierCity, time: order.value.accepted + ' 11:00', active: false },
  ]
  return [
    { id: 1, title: 'Vežama → Vilnius', location: 'Kelyje', time: 'Numatoma: ' + order.value.deliveryDate, active: true },
    { id: 2, title: 'Priimta į sandėlį', location: 'Kaunas', time: '2026-03-21 09:15', active: false },
    { id: 3, title: 'Išsiųsta tiekėjo', location: order.value.supplierCity, time: order.value.accepted + ' 11:00', active: false },
  ]
})

const baseAmount = parseFloat(order.value.amount)
const invoice = computed(() => {
  const items = [
    { desc: order.value.part, note: order.value.car + ' · OEM kokybė', qty: 1, unit: order.value.amount, total: order.value.amount },
    { desc: 'Pristatymo mokestis', note: order.value.deliveryMethod, qty: 1, unit: '8.00', total: '8.00' },
  ]
  const subtotal = (baseAmount + 8).toFixed(2)
  const vat      = ((baseAmount + 8) * 0.21).toFixed(2)
  const total    = ((baseAmount + 8) * 1.21).toFixed(2)
  return { items, subtotal, vat, total }
})

const orderFields = computed(() => [
  { label: 'Dalis',           value: order.value.part },
  { label: 'Automobilis',     value: order.value.car },
  { label: 'Pristatymo data', value: order.value.deliveryDate },
  { label: 'Pristatymo būdas', value: order.value.deliveryMethod },
])

const messages = ref([
  { id: 1, initials: 'AD', name: 'UAB AutoDalys', time: 'prieš 3 val.', text: 'Dalis yra OEM originali, siunčiame rytoj per DPD kurjerį. Sekimo kodas bus atskirai.', mine: false },
  { id: 2, initials: 'EK', name: 'Elena K. (Jūs)', time: 'prieš 2 val.', text: 'Ačiū! Prašome susisiekti jei bus vėlavimų — dalis reikalinga iki penktadienio.', mine: true },
])

function sendMessage() {
  if (!newMessage.value.trim()) return
  messages.value.push({ id: Date.now(), initials: 'EK', name: 'Elena K. (Jūs)', time: 'ką tik', text: newMessage.value, mine: true })
  newMessage.value = ''
}

function submitRating() {
  if (!ratingValue.value) return
  rated.value    = true
  showRating.value = false
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
