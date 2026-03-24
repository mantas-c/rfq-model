<template>
  <div class="flex h-full" style="font-family:'Plus Jakarta Sans','Inter',sans-serif;">

    <!-- Sidebar filters -->
    <aside class="w-56 flex-shrink-0 overflow-y-auto" style="background:#fff; border-right:1px solid #E2E8F0;">
      <div class="p-4">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color:#94A3B8;">Kategorija</p>
        <div class="space-y-0.5">
          <button v-for="cat in categories" :key="cat.key"
            @click="activeCategory = activeCategory === cat.key ? '' : cat.key"
            class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left cursor-pointer transition-all duration-150"
            :style="activeCategory === cat.key
              ? 'background:#F0FDF4; color:#14A34A; font-weight:600;'
              : 'color:#475569; hover:background:#F8FAFC;'">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="cat.icon"/>
              </svg>
              <span class="text-xs font-medium">{{ cat.label }}</span>
            </div>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              :style="activeCategory === cat.key ? 'background:#14A34A; color:#fff;' : 'background:#F1F5F9; color:#94A3B8;'">
              {{ cat.count }}
            </span>
          </button>
        </div>
      </div>

      <div class="h-px mx-4" style="background:#E2E8F0;"></div>

      <div class="p-4">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color:#94A3B8;">Markė</p>
        <div class="space-y-1.5">
          <label v-for="make in carMakes" :key="make" class="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" v-model="selectedMakes" :value="make"
              class="w-3.5 h-3.5 rounded cursor-pointer accent-green-600">
            <span class="text-xs group-hover:text-slate-900 transition-colors" style="color:#475569;">{{ make }}</span>
          </label>
        </div>
      </div>

      <div class="h-px mx-4" style="background:#E2E8F0;"></div>

      <div class="p-4">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color:#94A3B8;">Būklė</p>
        <div class="space-y-1.5">
          <label v-for="cond in conditions" :key="cond.key" class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="selectedConditions" :value="cond.key"
              class="w-3.5 h-3.5 rounded cursor-pointer accent-green-600">
            <span class="text-xs" style="color:#475569;">{{ cond.label }}</span>
          </label>
        </div>
      </div>

      <div class="h-px mx-4" style="background:#E2E8F0;"></div>

      <div class="p-4">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color:#94A3B8;">Kaina (€)</p>
        <div class="flex items-center gap-2 mb-3">
          <input v-model.number="priceMin" type="number" placeholder="Nuo" min="0"
            class="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
            style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
          <span class="text-xs flex-shrink-0" style="color:#94A3B8;">—</span>
          <input v-model.number="priceMax" type="number" placeholder="Iki" min="0"
            class="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
            style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
        </div>
        <button @click="resetFilters"
          class="w-full py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-100"
          style="border:1px solid #E2E8F0; color:#64748B;">
          Išvalyti filtrus
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Top toolbar -->
      <div class="flex items-center gap-3 px-6 py-4 flex-shrink-0" style="background:#fff; border-bottom:1px solid #E2E8F0;">

        <!-- Search -->
        <div class="relative flex-1 max-w-lg">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="search" type="text" placeholder="Ieškoti pagal pavadinimą, OEM kodą, modelį..."
            class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
            style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
          <button v-if="search" @click="search = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color:#94A3B8;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Sort -->
        <select v-model="sortBy"
          class="text-sm rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer flex-shrink-0"
          style="background:#F8FAFC; border:1px solid #E2E8F0; color:#475569; font-family:inherit;">
          <option value="name">Pagal pavadinimą</option>
          <option value="price_asc">Kaina: mažiausia</option>
          <option value="price_desc">Kaina: didžiausia</option>
          <option value="stock">Sandėlyje</option>
        </select>

        <!-- View toggle -->
        <div class="flex items-center rounded-xl overflow-hidden flex-shrink-0" style="border:1px solid #E2E8F0;">
          <button @click="viewMode = 'grid'"
            class="px-3 py-2.5 cursor-pointer transition-colors"
            :style="viewMode === 'grid' ? 'background:#14A34A; color:#fff;' : 'color:#64748B; background:#fff;'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button @click="viewMode = 'list'"
            class="px-3 py-2.5 cursor-pointer transition-colors"
            :style="viewMode === 'list' ? 'background:#14A34A; color:#fff;' : 'color:#64748B; background:#fff;'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Add new part -->
        <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 flex-shrink-0"
          style="background:#14A34A; color:#fff;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Pridėti dalį
        </button>
      </div>

      <!-- Results bar -->
      <div class="flex items-center gap-3 px-6 py-2.5 flex-shrink-0" style="background:#F8FAFC; border-bottom:1px solid #F1F5F9;">
        <p class="text-xs" style="color:#64748B;">
          Rasta <span class="font-bold" style="color:#0F172A;">{{ filteredProducts.length }}</span> dalių
          <span v-if="activeCategory" class="ml-1">kategorijoje <span class="font-semibold" style="color:#14A34A;">{{ categories.find(c=>c.key===activeCategory)?.label }}</span></span>
        </p>
        <!-- Active filter chips -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <span v-for="make in selectedMakes" :key="make"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer"
            style="background:#DCFCE7; color:#14A34A;"
            @click="selectedMakes = selectedMakes.filter(m => m !== make)">
            {{ make }}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </span>
          <span v-for="cond in selectedConditions" :key="cond"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer"
            :style="`background:${conditionStyle(cond).bg}; color:${conditionStyle(cond).color};`"
            @click="selectedConditions = selectedConditions.filter(c => c !== cond)">
            {{ conditions.find(c=>c.key===cond)?.label }}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </span>
        </div>
      </div>

      <!-- Product grid/list -->
      <div class="flex-1 overflow-y-auto p-6">

        <!-- Empty state -->
        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-24">
          <svg class="w-16 h-16 mb-4" style="color:#E2E8F0;" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="text-sm font-semibold mb-1" style="color:#475569;">Dalių nerasta</p>
          <p class="text-xs" style="color:#94A3B8;">Pabandykite pakeisti paieškos kriterijus</p>
          <button @click="resetFilters" class="mt-4 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer" style="background:#F0FDF4; color:#14A34A;">
            Išvalyti filtrus
          </button>
        </div>

        <!-- GRID VIEW -->
        <div v-else-if="viewMode === 'grid'" class="grid gap-4" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));">
          <div v-for="p in filteredProducts" :key="p.id"
            class="rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-md"
            style="background:#fff; border:1px solid #E2E8F0;">

            <!-- Image area -->
            <div class="relative h-36 flex items-center justify-center" :style="`background:${p.imgBg};`"
              @click="navigateTo(`/supplier/catalog/${p.id}`)">
              <!-- Part icon -->
              <svg class="w-16 h-16 opacity-30" :style="`color:${p.imgColor};`" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="p.icon"/>
              </svg>
              <!-- Condition badge -->
              <span class="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                :style="`background:${conditionStyle(p.condition).bg}; color:${conditionStyle(p.condition).color};`">
                {{ conditionLabel(p.condition) }}
              </span>
              <!-- Stock badge -->
              <span class="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                :style="p.stock > 0 ? 'background:#DCFCE7; color:#14A34A;' : 'background:#FEF2F2; color:#EF4444;'">
                {{ p.stock > 0 ? `${p.stock} vnt.` : 'Nėra' }}
              </span>
            </div>

            <!-- Info -->
            <div class="p-3.5" @click="navigateTo(`/supplier/catalog/${p.id}`)">
              <p class="text-xs font-mono mb-1" style="color:#94A3B8;">{{ p.oemCode }}</p>
              <p class="text-sm font-semibold mb-1 leading-snug" style="color:#0F172A;">{{ p.name }}</p>
              <div class="flex flex-wrap gap-1 mb-2.5">
                <span v-for="compat in p.compat.slice(0,2)" :key="compat"
                  class="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style="background:#F1F5F9; color:#64748B;">{{ compat }}</span>
                <span v-if="p.compat.length > 2" class="text-[10px] font-medium px-1.5 py-0.5 rounded" style="background:#F1F5F9; color:#94A3B8;">+{{ p.compat.length - 2 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-base font-bold" style="color:#0F172A;">€{{ p.price }}</span>
              </div>
            </div>

            <!-- Add to offer button -->
            <div class="px-3.5 pb-3.5">
              <button @click.stop="openOfferModal(p)"
                class="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5"
                :style="p.stock > 0
                  ? 'background:#F0FDF4; color:#14A34A; border:1px solid #BBF7D0; hover:background:#DCFCE7;'
                  : 'background:#F8FAFC; color:#94A3B8; border:1px solid #E2E8F0; cursor:not-allowed;'"
                :disabled="p.stock === 0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Į pasiūlymą
              </button>
            </div>
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-else class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="grid px-5 py-3 text-[11px] font-semibold uppercase tracking-wide"
            style="grid-template-columns:44px 1fr 120px 100px 80px 90px 110px; color:#94A3B8; border-bottom:1px solid #F1F5F9; background:#FAFAFA;">
            <span></span>
            <span>Pavadinimas / OEM kodas</span>
            <span>Suderinama</span>
            <span>Kategorija</span>
            <span class="text-center">Sandėlis</span>
            <span class="text-right">Kaina</span>
            <span></span>
          </div>

          <div v-for="p in filteredProducts" :key="p.id"
            class="grid items-center px-5 py-3 cursor-pointer transition-colors hover:bg-slate-50"
            style="grid-template-columns:44px 1fr 120px 100px 80px 90px 110px; border-bottom:1px solid #F8FAFC;"
            @click="navigateTo(`/supplier/catalog/${p.id}`)">

            <!-- Icon -->
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :style="`background:${p.imgBg};`">
              <svg class="w-5 h-5 opacity-50" :style="`color:${p.imgColor};`" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="p.icon"/>
              </svg>
            </div>

            <!-- Name + OEM + condition -->
            <div class="min-w-0 pr-4">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-sm font-semibold truncate" style="color:#0F172A;">{{ p.name }}</p>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  :style="`background:${conditionStyle(p.condition).bg}; color:${conditionStyle(p.condition).color};`">
                  {{ conditionLabel(p.condition) }}
                </span>
              </div>
              <p class="text-xs font-mono" style="color:#94A3B8;">{{ p.oemCode }}</p>
            </div>

            <!-- Compat -->
            <div class="min-w-0">
              <p class="text-xs truncate" style="color:#475569;">{{ p.compat[0] }}</p>
              <p v-if="p.compat.length > 1" class="text-[11px]" style="color:#94A3B8;">+{{ p.compat.length - 1 }} daugiau</p>
            </div>

            <!-- Category -->
            <p class="text-xs truncate" style="color:#64748B;">{{ categories.find(c => c.key === p.category)?.label ?? p.category }}</p>

            <!-- Stock -->
            <div class="flex justify-center">
              <span class="text-xs font-semibold" :style="p.stock > 0 ? 'color:#14A34A;' : 'color:#EF4444;'">
                {{ p.stock > 0 ? p.stock + ' vnt.' : '—' }}
              </span>
            </div>

            <!-- Price -->
            <p class="text-sm font-bold text-right" style="color:#0F172A;">€{{ p.price }}</p>

            <!-- Action -->
            <div class="flex justify-end" @click.stop>
              <button @click="openOfferModal(p)"
                :disabled="p.stock === 0"
                class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                :style="p.stock > 0 ? 'background:#F0FDF4; color:#14A34A; border:1px solid #BBF7D0;' : 'background:#F8FAFC; color:#CBD5E1; border:1px solid #F1F5F9; cursor:not-allowed;'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Į pasiūlymą
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Add to offer modal -->
    <Teleport to="body">
      <div v-if="offerModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);"
        @click.self="offerModal.open = false">
        <div class="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style="background:#fff;">

          <!-- Header -->
          <div class="px-6 py-5" style="background:linear-gradient(135deg,#14A34A,#16A34A 60%,#059669);">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold mb-1" style="color:rgba(255,255,255,0.7);">Pridėti į pasiūlymą</p>
                <h3 class="text-base font-bold text-white">{{ offerModal.product?.name }}</h3>
                <p class="text-xs mt-0.5 font-mono" style="color:rgba(255,255,255,0.65);">{{ offerModal.product?.oemCode }}</p>
              </div>
              <button @click="offerModal.open = false" class="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer" style="background:rgba(255,255,255,0.15); color:#fff;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <!-- Link to query -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#0F172A;">Susieti su užklausa</label>
              <select v-model="offerModal.queryId"
                class="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none cursor-pointer"
                style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
                <option value="">— Pasirinkite užklausą —</option>
                <option v-for="q in openQueries" :key="q.id" :value="q.id">{{ q.id }} · {{ q.part }} ({{ q.car }})</option>
              </select>
            </div>

            <!-- Qty + Price row -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#0F172A;">Kiekis</label>
                <input v-model.number="offerModal.qty" type="number" min="1" :max="offerModal.product?.stock"
                  class="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
                  style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
                <p class="text-[11px] mt-1" style="color:#94A3B8;">Sandėlyje: {{ offerModal.product?.stock }} vnt.</p>
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#0F172A;">Jūsų kaina (€)</label>
                <input v-model.number="offerModal.price" type="number" min="0" step="0.01"
                  class="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
                  style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;">
                <p class="text-[11px] mt-1" style="color:#94A3B8;">Katalogo kaina: €{{ offerModal.product?.price }}</p>
              </div>
            </div>

            <!-- Delivery days -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#0F172A;">Pristatymo terminas (darbo dienos)</label>
              <div class="flex gap-2">
                <button v-for="d in [1,2,3,5,7]" :key="d"
                  @click="offerModal.deliveryDays = d"
                  class="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  :style="offerModal.deliveryDays === d
                    ? 'background:#14A34A; color:#fff;'
                    : 'background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0;'">
                  {{ d }}d.
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#0F172A;">Pastabos pirkėjui <span style="color:#94A3B8;">(neprivaloma)</span></label>
              <textarea v-model="offerModal.notes" rows="2" placeholder="pvz. Originali OEM dalis, garantija 6 mėn...."
                class="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none resize-none"
                style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;"></textarea>
            </div>

            <!-- Summary -->
            <div class="rounded-xl px-4 py-3 flex items-center justify-between" style="background:#F0FDF4; border:1px solid #BBF7D0;">
              <div>
                <p class="text-xs" style="color:#14A34A;">{{ offerModal.qty }} × €{{ offerModal.price }}</p>
                <p class="text-sm font-bold" style="color:#14A34A;">Iš viso: €{{ (offerModal.qty * offerModal.price).toFixed(2) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs" style="color:#64748B;">Pristatymas</p>
                <p class="text-sm font-semibold" style="color:#0F172A;">{{ offerModal.deliveryDays }} d.d.</p>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-1">
              <button @click="offerModal.open = false"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100"
                style="border:1px solid #E2E8F0; color:#475569;">
                Atšaukti
              </button>
              <button @click="submitOffer"
                :disabled="!offerModal.queryId"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-opacity flex items-center justify-center gap-2"
                :style="offerModal.queryId
                  ? 'background:#14A34A; color:#fff;'
                  : 'background:#F1F5F9; color:#CBD5E1; cursor:not-allowed;'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                Siųsti pasiūlymą
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success toast -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition-all duration-300" leave-to-class="translate-y-4 opacity-0">
        <div v-if="toast.show" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl"
          style="background:#0F172A; color:#fff; min-width:280px;">
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
useHead({ title: 'Katalogas — recar PRO' })

const search             = ref('')
const activeCategory     = ref('')
const selectedMakes      = ref<string[]>([])
const selectedConditions = ref<string[]>([])
const priceMin           = ref<number|null>(null)
const priceMax           = ref<number|null>(null)
const viewMode           = ref<'grid'|'list'>('grid')
const sortBy             = ref('name')

const categories = [
  { key: 'body',        label: 'Kėbulas',        count: 48, icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
  { key: 'engine',      label: 'Variklis',        count: 32, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { key: 'suspension',  label: 'Pakaba',          count: 27, icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  { key: 'brakes',      label: 'Stabdžiai',       count: 21, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'transmission',label: 'Transmisija',     count: 18, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10' },
  { key: 'electrical',  label: 'Elektrika',       count: 35, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'glass',       label: 'Stiklai',         count: 14, icon: 'M7 3a1 1 0 000 2h10a1 1 0 100-2H7zM4 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z' },
  { key: 'interior',    label: 'Interjeras',      count: 19, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
]

const carMakes = ['BMW', 'Audi', 'Volkswagen', 'Mercedes', 'Toyota', 'Ford', 'Skoda', 'Volvo', 'Opel', 'Renault']

const conditions = [
  { key: 'oem',          label: 'OEM Originali' },
  { key: 'used',         label: 'Naudota' },
  { key: 'aftermarket',  label: 'Aftermarket' },
  { key: 'refurbished',  label: 'Restauruota' },
]

interface Product {
  id: string; name: string; oemCode: string; category: string
  make: string; compat: string[]; condition: string
  price: number; stock: number; icon: string; imgBg: string; imgColor: string
}

const allProducts: Product[] = [
  { id: 'p001', name: 'Priekinis bamperis (M-paket.)', oemCode: '51117906699',  category: 'body',         make: 'BMW',       compat: ['BMW E60','BMW E61'],                condition: 'used',        price: 185,  stock: 2,  icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z', imgBg: '#F0F9FF', imgColor: '#0EA5E9' },
  { id: 'p002', name: 'Variklio dangtis',              oemCode: '8K0823029',    category: 'body',         make: 'Audi',      compat: ['Audi A4 B8','Audi A5 8T'],         condition: 'used',        price: 320,  stock: 1,  icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z', imgBg: '#FFF7ED', imgColor: '#F97316' },
  { id: 'p003', name: 'Dešin. pusės veidrodis el.',    oemCode: '5G0857508',    category: 'body',         make: 'Volkswagen', compat: ['VW Golf VII','VW Golf VIII'],      condition: 'used',        price: 65,   stock: 4,  icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', imgBg: '#F0FDF4', imgColor: '#22C55E' },
  { id: 'p004', name: 'Kairės pusės durys',            oemCode: '1Z3831051',    category: 'body',         make: 'Skoda',     compat: ['Skoda Octavia A5'],                condition: 'used',        price: 480,  stock: 1,  icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0z', imgBg: '#FDF4FF', imgColor: '#A855F7' },
  { id: 'p005', name: 'Priekinė transmisija CVT',      oemCode: '2T143400F',    category: 'transmission', make: 'Ford',      compat: ['Ford Focus III','Ford Focus IV'],   condition: 'used',        price: 290,  stock: 1,  icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10', imgBg: '#EFF6FF', imgColor: '#3B82F6' },
  { id: 'p006', name: 'Galinis buferis',               oemCode: '52159-02280', category: 'body',         make: 'Toyota',    compat: ['Toyota Corolla E12','Toyota Corolla E14'], condition: 'used', price: 120, stock: 3,  icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0z', imgBg: '#F0FDF4', imgColor: '#10B981' },
  { id: 'p007', name: 'Vairas su oro pagalvėle',       oemCode: 'A2044601003',  category: 'interior',     make: 'Mercedes',  compat: ['Mercedes C W204','Mercedes E W212'], condition: 'used',       price: 410,  stock: 2,  icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4', imgBg: '#FFFBEB', imgColor: '#F59E0B' },
  { id: 'p008', name: 'Stabdžių diskai priekiniai',    oemCode: '45251-S5A-A00',category: 'brakes',       make: 'Toyota',    compat: ['Honda Civic IX','Honda Jazz III'], condition: 'aftermarket', price: 95,   stock: 6,  icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', imgBg: '#FEF2F2', imgColor: '#EF4444' },
  { id: 'p009', name: 'Priekinis stiklas (HUD)',       oemCode: '8200793088',   category: 'glass',        make: 'Renault',   compat: ['Renault Megane III','Renault Laguna III'], condition: 'oem', price: 240, stock: 1,  icon: 'M7 3a1 1 0 000 2h10a1 1 0 100-2H7z', imgBg: '#F0F9FF', imgColor: '#0EA5E9' },
  { id: 'p010', name: 'Priekiniai žibintai (bi-LED)',  oemCode: '63117296908',  category: 'electrical',   make: 'BMW',       compat: ['BMW E90','BMW E91','BMW E92'],      condition: 'used',        price: 560,  stock: 2,  icon: '13 10V3L4 14h7v7l9-11h-7z', imgBg: '#FFFBEB', imgColor: '#F59E0B' },
  { id: 'p011', name: 'Katalizatorius',                oemCode: '1731.L0',      category: 'engine',       make: 'Renault',   compat: ['Peugeot 308 II','Citroen C4 II'],  condition: 'used',        price: 185,  stock: 1,  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0', imgBg: '#F0FDF4', imgColor: '#22C55E' },
  { id: 'p012', name: 'Pakabos svirtis kairė',        oemCode: '31120392935',  category: 'suspension',   make: 'BMW',       compat: ['VW Passat B7','VW Passat B8'],     condition: 'oem',         price: 145,  stock: 3,  icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4', imgBg: '#EFF6FF', imgColor: '#6366F1' },
  { id: 'p013', name: 'Alternatorius 120A',            oemCode: '13500-77E01',  category: 'electrical',   make: 'Opel',      compat: ['Opel Astra H','Opel Vectra C'],    condition: 'refurbished', price: 145,  stock: 2,  icon: '13 10V3L4 14h7v7l9-11h-7z', imgBg: '#FFFBEB', imgColor: '#F59E0B' },
  { id: 'p014', name: 'Radiatorius aušinimo',          oemCode: '31293598',     category: 'engine',       make: 'Volvo',     compat: ['Volvo V70 III','Volvo XC70 II'],    condition: 'used',        price: 220,  stock: 1,  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0', imgBg: '#F0F9FF', imgColor: '#0EA5E9' },
  { id: 'p015', name: 'Kuro siurblys aukšto sp.',     oemCode: '13517823499',  category: 'engine',       make: 'BMW',       compat: ['BMW X5 E53','BMW X5 E70'],         condition: 'used',        price: 380,  stock: 1,  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0', imgBg: '#FEF2F2', imgColor: '#EF4444' },
  { id: 'p016', name: 'Amortizatorius galiniai (2vnt)', oemCode: '33526785534', category: 'suspension',   make: 'BMW',       compat: ['BMW 5 F10','BMW 5 F11'],           condition: 'oem',         price: 310,  stock: 4,  icon: 'M12 6V4m0 2a2 2 0 100 4', imgBg: '#EFF6FF', imgColor: '#6366F1' },
]

const openQueries = [
  { id: 'UZK-2847', part: 'Priekinis bamperis', car: 'BMW E60 520d' },
  { id: 'UZK-2853', part: 'Transmisija', car: 'Ford Focus III' },
  { id: 'UZK-2844', part: 'Vairas', car: 'Mercedes C W204' },
  { id: 'UZK-2860', part: 'Stabdžiai', car: 'Honda Civic IX' },
  { id: 'UZK-2862', part: 'Žibintai', car: 'BMW E90' },
]

const filteredProducts = computed(() => {
  let list = allProducts
  if (activeCategory.value) list = list.filter(p => p.category === activeCategory.value)
  if (selectedMakes.value.length) list = list.filter(p => selectedMakes.value.includes(p.make))
  if (selectedConditions.value.length) list = list.filter(p => selectedConditions.value.includes(p.condition))
  if (priceMin.value !== null) list = list.filter(p => p.price >= (priceMin.value as number))
  if (priceMax.value !== null) list = list.filter(p => p.price <= (priceMax.value as number))
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.oemCode.toLowerCase().includes(q) ||
      p.compat.some(c => c.toLowerCase().includes(q)) ||
      p.make.toLowerCase().includes(q)
    )
  }
  if (sortBy.value === 'price_asc')  list = [...list].sort((a,b) => a.price - b.price)
  if (sortBy.value === 'price_desc') list = [...list].sort((a,b) => b.price - a.price)
  if (sortBy.value === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'stock')      list = [...list].sort((a,b) => b.stock - a.stock)
  return list
})

function resetFilters() {
  search.value = ''; activeCategory.value = ''; selectedMakes.value = []; selectedConditions.value = []; priceMin.value = null; priceMax.value = null
}

function conditionStyle(cond: string) {
  if (cond === 'oem')         return { bg: '#EFF6FF', color: '#3B82F6' }
  if (cond === 'used')        return { bg: '#F0FDF4', color: '#14A34A' }
  if (cond === 'aftermarket') return { bg: '#FFFBEB', color: '#D97706' }
  if (cond === 'refurbished') return { bg: '#FDF4FF', color: '#A855F7' }
  return { bg: '#F1F5F9', color: '#64748B' }
}
function conditionLabel(cond: string) {
  if (cond === 'oem')         return 'OEM'
  if (cond === 'used')        return 'Naudota'
  if (cond === 'aftermarket') return 'Aftermarket'
  if (cond === 'refurbished') return 'Restauruota'
  return cond
}

// Offer modal
const offerModal = reactive({
  open: false,
  product: null as Product|null,
  queryId: '',
  qty: 1,
  price: 0,
  deliveryDays: 2,
  notes: '',
})

function openOfferModal(product: Product) {
  offerModal.product = product
  offerModal.price   = product.price
  offerModal.qty     = 1
  offerModal.queryId = ''
  offerModal.deliveryDays = 2
  offerModal.notes   = ''
  offerModal.open    = true
}

// Toast
const toast = reactive({ show: false, message: '' })
function showToast(msg: string) {
  toast.message = msg; toast.show = true
  setTimeout(() => { toast.show = false }, 3500)
}

function submitOffer() {
  if (!offerModal.queryId) return
  const q = openQueries.find(q => q.id === offerModal.queryId)
  offerModal.open = false
  showToast(`${offerModal.product?.name} → ${q?.id} (${q?.car})`)
}
</script>
