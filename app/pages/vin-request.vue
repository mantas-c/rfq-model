<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div class="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Nemokama paslauga
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">Neradote dalies?<br>Mes ieškosime už jus.</h1>
        <p class="mt-4 text-base text-gray-500 max-w-xl mx-auto">Užpildykite formą, pridėkite VIN kodą ir dokumento nuotrauką — mūsų komanda per 24 val. ras geriausią pasiūlymą iš Europos pardavėjų.</p>
      </div>
    </div>

    <!-- Form -->
    <div class="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <div v-if="submitted" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style="background: rgba(20,163,74,0.1);">
          <svg class="w-8 h-8" fill="none" stroke="#14A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-950 mb-2">Gavome jūsų užklausą!</h2>
        <p class="text-gray-500 mb-6">Susisieksime per 24 valandas el. paštu arba telefonu su geriausiais pasiūlymais.</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5" style="background:#14A34A;">
          Grįžti į pradžią
        </NuxtLink>
      </div>

      <form v-else @submit.prevent="submit" class="space-y-6">

        <!-- Contact info -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-900">Kontaktinė informacija</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Vardas *</label>
              <input v-model="form.name" type="text" required placeholder="Jūsų vardas"
                class="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all" style="--tw-ring-color:#14A34A;">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">El. paštas *</label>
              <input v-model="form.email" type="email" required placeholder="jusu@pastas.lt"
                class="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all" style="--tw-ring-color:#14A34A;">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Telefono numeris</label>
              <input v-model="form.phone" type="tel" placeholder="+370 600 00000"
                class="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all" style="--tw-ring-color:#14A34A;">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Automobilis</label>
              <input v-model="form.car" type="text" placeholder="pvz. BMW E60 520d 2005"
                class="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all" style="--tw-ring-color:#14A34A;">
            </div>
          </div>
        </div>

        <!-- Vehicle dropdowns -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-900">Automobilio informacija</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="relative">
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Markė</label>
              <select v-model="form.make" class="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer pr-8" style="--tw-ring-color:#14A34A;">
                <option value="">Pasirinkti...</option>
                <option>BMW</option><option>Mercedes-Benz</option><option>Audi</option><option>Volkswagen</option>
                <option>Volvo</option><option>Opel</option><option>Toyota</option><option>Honda</option>
                <option>Ford</option><option>Renault</option><option>Peugeot</option><option>Skoda</option>
              </select>
              <svg class="absolute right-3 bottom-3.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
            <div class="relative">
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Modelis</label>
              <select v-model="form.model" class="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer pr-8" style="--tw-ring-color:#14A34A;">
                <option value="">Pasirinkti...</option>
              </select>
              <svg class="absolute right-3 bottom-3.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
            <div class="relative">
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Generacija</label>
              <select v-model="form.generation" class="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer pr-8" style="--tw-ring-color:#14A34A;">
                <option value="">Pasirinkti...</option>
              </select>
              <svg class="absolute right-3 bottom-3.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">VIN kodas</label>
            <input v-model="form.vin" type="text" maxlength="17" placeholder="pvz. WBA3A5G59DNP26082"
              class="w-full px-4 py-3 text-sm font-mono text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all uppercase" style="--tw-ring-color:#14A34A;"
              @input="form.vin = form.vin.toUpperCase()">
            <p class="text-[11px] text-gray-400 mt-1.5">VIN kodą rasite ant priekinio stiklo apačioje arba automobilio dokumentuose (17 simbolių).</p>
          </div>
        </div>

        <!-- Part info -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-900">Dalies informacija</h2>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Reikiama dalis *</label>
            <input v-model="form.part" type="text" required placeholder='pvz. "Priekinis bamperis", "Variklio dangtis"...'
              class="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all" style="--tw-ring-color:#14A34A;">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">OEM kodai <span class="font-normal text-gray-400">(jei žinote)</span></label>
            <input v-model="form.oem" type="text" placeholder="pvz. 41617111919, 8K0823029"
              class="w-full px-4 py-3 text-sm font-mono text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all" style="--tw-ring-color:#14A34A;">
            <p class="text-[11px] text-gray-400 mt-1.5">Galite įvesti kelis OEM kodus atskirtus kableliu.</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Papildomi komentarai</label>
            <textarea v-model="form.notes" rows="3" placeholder="Nurodykite daugiau detalių: spalvą, pusę (kairė/dešinė), būklės pageidavimus ir kt."
              class="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none" style="--tw-ring-color:#14A34A;"></textarea>
          </div>
        </div>

        <!-- Part photos upload -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-900">Dalies nuotraukos <span class="text-xs font-normal text-gray-400">(neprivaloma)</span></h2>
          <p class="text-xs text-gray-500">Įkelkite reikiamos dalies nuotrauką — tai padės mūsų komandai tiksliau identifikuoti ir surasti tinkamą dalį.</p>

          <label
            class="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-green-300 hover:bg-green-50/50 transition-all group"
            :class="{ 'border-green-400 bg-green-50': files.length > 0 }"
          >
            <input type="file" accept="image/*,.pdf" multiple class="hidden" @change="onFileChange">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: rgba(20,163,74,0.08);">
              <svg class="w-6 h-6" fill="none" stroke="#14A34A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-700">Įkelkite dalies nuotraukas</p>
              <p class="text-xs text-gray-400 mt-0.5">PNG, JPG iki 10MB</p>
            </div>
          </label>

          <!-- File list -->
          <div v-if="files.length > 0" class="space-y-2">
            <div v-for="(f, i) in files" :key="i" class="flex items-center gap-3 px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="text-xs font-medium text-green-800 flex-1 truncate">{{ f.name }}</span>
              <button type="button" @click="files.splice(i, 1)" class="text-green-400 hover:text-green-700 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 py-4 text-base font-bold text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          style="background: #14A34A;"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
          {{ loading ? 'Siunčiama...' : 'Siųsti užklausą' }}
        </button>

        <p class="text-center text-xs text-gray-400">Atsakysime per 24 val. darbo dienomis. Paslauga nemokama.</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Neradote dalies? Siųskite VIN — dalys.lt',
  meta: [{ name: 'description', content: 'Negalite rasti reikiamos automobilių dalies? Siųskite VIN kodą ir dokumentus — mūsų komanda per 24 val. suras geriausią pasiūlymą iš Europos.' }],
})

const submitted = ref(false)
const loading = ref(false)
const files = ref<File[]>([])

const form = reactive({
  name: '',
  email: '',
  phone: '',
  car: '',
  make: '',
  model: '',
  generation: '',
  part: '',
  vin: '',
  oem: '',
  notes: '',
})

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) files.value.push(...Array.from(input.files))
}

async function submit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  submitted.value = true
}
</script>
