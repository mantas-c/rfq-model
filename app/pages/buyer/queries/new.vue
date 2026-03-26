<template>
  <div class="min-h-full flex flex-col" style="font-family:'Plus Jakarta Sans','Inter',sans-serif; background:#F8FAFC;">

    <!-- Step indicator -->
    <div v-if="step < 5" class="flex-shrink-0 px-8 py-4" style="background:#fff; border-bottom:1px solid #E2E8F0;">
      <div class="flex items-center">
        <div v-for="(label, i) in stepLabels" :key="i" class="flex items-center">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
              :style="step > i+1 ? 'background:#14A34A; color:#fff;' : step === i+1 ? 'background:#3B82F6; color:#fff;' : 'background:#F1F5F9; color:#94A3B8;'">
              <svg v-if="step > i+1" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span v-else>{{ i+1 }}</span>
            </div>
            <span class="text-xs font-semibold transition-colors hidden sm:block"
              :style="step === i+1 ? 'color:#0F172A;' : step > i+1 ? 'color:#14A34A;' : 'color:#94A3B8;'">{{ label }}</span>
          </div>
          <div v-if="i < stepLabels.length-1" class="w-12 h-0.5 mx-3 flex-shrink-0 transition-all duration-500"
            :style="step > i+1 ? 'background:#14A34A;' : 'background:#E2E8F0;'"></div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- STEP 1 · Vehicle identification             -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="step === 1" class="flex-1 flex items-start justify-center py-12 px-6">
      <div class="w-full max-w-lg space-y-5">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background:#EFF6FF;">
            <svg class="w-7 h-7" style="color:#3B82F6;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold" style="color:#0F172A;">Identifikuokite transporto priemonę</h2>
          <p class="text-sm mt-1" style="color:#64748B;">Įveskite VIN arba valstybinį numerį</p>
        </div>

        <div class="flex rounded-xl p-1" style="background:#F1F5F9;">
          <button @click="lookupMode='vin'" class="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
            :style="lookupMode==='vin' ? 'background:#fff; color:#0F172A; box-shadow:0 1px 3px rgba(0,0,0,0.08);' : 'color:#64748B;'">VIN kodas</button>
          <button @click="lookupMode='plate'" class="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
            :style="lookupMode==='plate' ? 'background:#fff; color:#0F172A; box-shadow:0 1px 3px rgba(0,0,0,0.08);' : 'color:#64748B;'">Valst. numeris</button>
        </div>

        <div v-if="lookupMode==='vin'">
          <label class="block text-xs font-semibold mb-1.5" style="color:#475569;">VIN kodas (17 simbolių)</label>
          <div class="flex gap-2">
            <input v-model="vinInput" type="text" placeholder="pvz. WBA3B51090F000001" maxlength="17"
              class="flex-1 px-4 py-3 text-sm rounded-xl focus:outline-none tracking-widest uppercase"
              style="background:#fff; border:1px solid #E2E8F0; color:#0F172A; font-family:'Courier New',monospace; letter-spacing:0.08em;"
              @keydown.enter="decodeVehicle">
            <button @click="decodeVehicle" :disabled="decoding || !vinInput.trim()"
              class="px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 flex-shrink-0"
              :style="vinInput.trim() && !decoding ? 'background:#3B82F6; color:#fff;' : 'background:#F1F5F9; color:#CBD5E1; cursor:not-allowed;'">
              {{ decoding ? '...' : 'Dekoduoti' }}</button>
          </div>
          <p class="text-xs mt-1.5" style="color:#94A3B8;">VIN rasite priekiniame stikle arba registracijos dokumente</p>
        </div>

        <div v-if="lookupMode==='plate'">
          <label class="block text-xs font-semibold mb-1.5" style="color:#475569;">Valstybinis numeris</label>
          <div class="flex gap-2">
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <div class="w-5 h-3.5 rounded-sm flex items-center justify-center" style="background:#003399;">
                  <span class="text-[8px] font-bold" style="color:#FFD700;">LT</span>
                </div>
              </div>
              <input v-model="plateInput" type="text" placeholder="ABC 123" maxlength="8"
                class="pl-12 pr-4 py-3 text-sm rounded-xl focus:outline-none uppercase tracking-widest"
                style="background:#fff; border:1px solid #E2E8F0; color:#0F172A; font-family:'Courier New',monospace; width:170px;"
                @keydown.enter="decodeVehicle">
            </div>
            <button @click="decodeVehicle" :disabled="decoding || !plateInput.trim()"
              class="flex-1 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
              :style="plateInput.trim() && !decoding ? 'background:#3B82F6; color:#fff;' : 'background:#F1F5F9; color:#CBD5E1; cursor:not-allowed;'">
              {{ decoding ? 'Ieškoma...' : 'Rasti' }}</button>
          </div>
        </div>

        <div v-if="decoding" class="rounded-xl p-5 text-center" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="flex items-center justify-center gap-3">
            <svg class="w-5 h-5 animate-spin" style="color:#3B82F6;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <p class="text-sm font-medium" style="color:#475569;">Kreipiamasi į registrą...</p>
          </div>
        </div>

        <div v-if="vehicle && !decoding" class="rounded-2xl overflow-hidden shadow-sm" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="px-5 py-3 flex items-center gap-2" style="background:#0F172A;">
            <svg class="w-4 h-4" style="color:#14A34A;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs font-semibold" style="color:#94A3B8;">Transporto priemonė rasta</span>
            <span class="ml-auto text-xs font-mono" style="color:#475569;">{{ vehicle.vin }}</span>
          </div>
          <div class="p-5">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" :style="`background:${vehicle.colorBg};`">
                <svg class="w-9 h-9" :style="`color:${vehicle.colorAccent};`" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold" style="color:#0F172A;">{{ vehicle.make }} {{ vehicle.model }}</h3>
                <p class="text-sm mt-0.5" style="color:#64748B;">{{ vehicle.year }} · {{ vehicle.body }}</p>
                <div class="grid grid-cols-3 gap-3 mt-3">
                  <div><p class="text-[10px] font-medium uppercase tracking-wide" style="color:#94A3B8;">Spalva</p>
                    <div class="flex items-center gap-1.5 mt-0.5"><div class="w-3.5 h-3.5 rounded-full border" :style="`background:${vehicle.color}; border-color:#E2E8F0;`"></div>
                    <span class="text-xs font-semibold truncate" style="color:#0F172A;">{{ vehicle.colorName }}</span></div></div>
                  <div><p class="text-[10px] font-medium uppercase tracking-wide" style="color:#94A3B8;">Variklis</p><p class="text-xs font-semibold mt-0.5" style="color:#0F172A;">{{ vehicle.engine }}</p></div>
                  <div><p class="text-[10px] font-medium uppercase tracking-wide" style="color:#94A3B8;">Galia</p><p class="text-xs font-semibold mt-0.5" style="color:#0F172A;">{{ vehicle.power }}</p></div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-5 pb-5">
            <button @click="step = 2" class="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 flex items-center justify-center gap-2" style="background:#14A34A; color:#fff;">
              Tęsti → Įkelti žalos nuotraukas
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div v-if="!vehicle && !decoding" class="flex items-center gap-2 flex-wrap">
          <span class="text-xs" style="color:#94A3B8;">Išbandykite:</span>
          <button v-for="ex in examples" :key="ex.vin"
            @click="vinInput = ex.vin; lookupMode = 'vin'; decodeVehicle()"
            class="text-xs font-semibold px-2.5 py-1 rounded-lg cursor-pointer hover:opacity-80"
            style="background:#EFF6FF; color:#3B82F6;">{{ ex.label }}</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- STEP 2 · Upload & AI analysis               -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="step === 2" class="flex-1 flex items-start justify-center py-10 px-6">
      <div class="w-full max-w-xl">

        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background:linear-gradient(135deg,#6366F1,#8B5CF6);">
            <svg class="w-7 h-7" fill="none" stroke="#fff" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold" style="color:#0F172A;">AI žalos analizė</h2>
          <p class="text-sm mt-1" style="color:#64748B;">Įkelkite pažeisto automobilio nuotraukas — AI automatiškai identifikuos pažeistas dalis</p>
        </div>

        <!-- ── Uploading state ── -->
        <div v-if="aiState === 'idle'" class="space-y-4">

          <!-- Drop zone -->
          <div class="relative rounded-2xl cursor-pointer transition-all duration-200"
            :style="isDragOver
              ? 'background:#EFF6FF; border:2px dashed #3B82F6;'
              : 'background:#fff; border:2px dashed #E2E8F0;'"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="onDrop"
            @click="fileInput?.click()">
            <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileChange">

            <div v-if="uploadedImages.length === 0" class="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background:#F1F5F9;">
                <svg class="w-8 h-8" style="color:#94A3B8;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <p class="text-sm font-bold mb-1" style="color:#475569;">Nuvilkite nuotraukas čia</p>
              <p class="text-xs" style="color:#94A3B8;">arba spustelėkite, kad pasirinktumėte failą</p>
              <p class="text-[11px] mt-3 px-4 py-1.5 rounded-full" style="background:#F8FAFC; color:#94A3B8;">JPEG, PNG, WEBP · maks. 4 nuotraukos</p>
            </div>

            <!-- Thumbnails grid -->
            <div v-else class="p-4">
              <div class="grid grid-cols-2 gap-3">
                <div v-for="(img, i) in uploadedImages" :key="i"
                  class="relative rounded-xl overflow-hidden group"
                  style="aspect-ratio:4/3;">
                  <img :src="img.preview" class="w-full h-full object-cover">
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style="background:rgba(15,23,42,0.5);">
                    <button @click.stop="removeImage(i)"
                      class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                      style="background:rgba(239,68,68,0.9); color:#fff;">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-medium truncate" style="background:rgba(15,23,42,0.7); color:#fff;">{{ img.name }}</div>
                </div>

                <!-- Add more slot -->
                <div v-if="uploadedImages.length < 4"
                  class="rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-50"
                  style="aspect-ratio:4/3; border:2px dashed #E2E8F0;">
                  <svg class="w-6 h-6 mb-1" style="color:#CBD5E1;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span class="text-[11px]" style="color:#CBD5E1;">Pridėti</span>
                </div>
              </div>

              <p class="text-[11px] mt-3 text-center" style="color:#94A3B8;">{{ uploadedImages.length }}/4 nuotraukos · spustelėkite, kad pridėtumėte daugiau</p>
            </div>
          </div>

          <!-- Tips -->
          <div class="rounded-xl px-4 py-3 flex items-start gap-3" style="background:#F8FAFC; border:1px solid #E2E8F0;">
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" style="color:#6366F1;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="text-xs font-semibold mb-1" style="color:#0F172A;">Geriausi rezultatai</p>
              <p class="text-xs" style="color:#64748B;">Fotografuokite iš kelių kampų (priekis, šonai, galas). Įsitikinkite, kad pažeistos vietos aiškiai matomos ir apšviestos.</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button @click="step = 1"
              class="px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100"
              style="border:1px solid #E2E8F0; color:#475569;">← Atgal</button>

            <button @click="skipToManual"
              class="px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100 flex-shrink-0"
              style="border:1px solid #E2E8F0; color:#64748B;">
              Praleisti, rinktis rankiniu būdu
            </button>

            <button @click="startAnalysis"
              :disabled="uploadedImages.length === 0"
              class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2"
              :style="uploadedImages.length > 0
                ? 'background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff;'
                : 'background:#F1F5F9; color:#CBD5E1; cursor:not-allowed;'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
              </svg>
              Analizuoti su AI ({{ uploadedImages.length }})
            </button>
          </div>
        </div>

        <!-- ── AI analysing state ── -->
        <div v-if="aiState === 'analysing'" class="rounded-2xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="p-10 flex flex-col items-center text-center">
            <!-- Animated logo -->
            <div class="relative w-20 h-20 mb-6">
              <div class="absolute inset-0 rounded-full animate-ping opacity-20" style="background:linear-gradient(135deg,#6366F1,#8B5CF6);"></div>
              <div class="absolute inset-2 rounded-full animate-spin-slow" style="border:3px solid transparent; border-top-color:#6366F1; border-right-color:#8B5CF6;"></div>
              <div class="absolute inset-0 rounded-full flex items-center justify-center" style="background:linear-gradient(135deg,#6366F1,#8B5CF6);">
                <svg class="w-8 h-8" fill="none" stroke="#fff" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
                </svg>
              </div>
            </div>

            <h3 class="text-base font-bold mb-2" style="color:#0F172A;">AI analizuoja nuotraukas...</h3>
            <p class="text-sm mb-6" style="color:#64748B;">{{ analysisStatusMsg }}</p>

            <!-- Progress bar -->
            <div class="w-full max-w-xs rounded-full h-1.5 mb-6" style="background:#F1F5F9;">
              <div class="h-1.5 rounded-full transition-all duration-1000" style="background:linear-gradient(90deg,#6366F1,#8B5CF6);" :style="`width:${analysisProgress}%`"></div>
            </div>

            <!-- Mini image strips -->
            <div class="flex gap-2">
              <div v-for="(img, i) in uploadedImages" :key="i"
                class="w-14 h-14 rounded-lg overflow-hidden"
                :style="`opacity:${analysisProgress > (i+1)*25 ? 1 : 0.3}; transition:opacity 0.5s;`">
                <img :src="img.preview" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </div>

        <!-- ── AI result state ── -->
        <div v-if="aiState === 'done' && aiResult" class="space-y-4">

          <!-- Result header card -->
          <div class="rounded-2xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
            <div class="px-5 py-4 flex items-center gap-3" style="background:linear-gradient(135deg,#6366F1,#8B5CF6);">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,255,255,0.2);">
                <svg class="w-5 h-5" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-white">AI aptiko pažeistas dalis</p>
                <p class="text-xs" style="color:rgba(255,255,255,0.75);">{{ aiResult.damaged_parts.length }} dalių · {{ Math.round((aiResult.confidence ?? 0.9) * 100) }}% tikimybė</p>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" :style="severityBadge(aiResult.severity)">
                  {{ severityLt(aiResult.severity) }}
                </div>
              </div>
            </div>

            <div class="p-5 space-y-4">
              <!-- Description -->
              <div class="rounded-xl px-4 py-3" style="background:#F8FAFC; border-left:3px solid #6366F1;">
                <p class="text-sm" style="color:#475569;">{{ aiResult.description }}</p>
              </div>

              <!-- Confidence meter -->
              <div>
                <div class="flex justify-between items-center mb-1.5">
                  <p class="text-xs font-semibold" style="color:#475569;">AI pasitikėjimas</p>
                  <p class="text-xs font-bold" style="color:#6366F1;">{{ Math.round((aiResult.confidence ?? 0.9) * 100) }}%</p>
                </div>
                <div class="h-2 rounded-full" style="background:#F1F5F9;">
                  <div class="h-2 rounded-full transition-all duration-1000"
                    style="background:linear-gradient(90deg,#6366F1,#8B5CF6);"
                    :style="`width:${Math.round((aiResult.confidence ?? 0.9) * 100)}%`"></div>
                </div>
              </div>

              <!-- Detected parts chips -->
              <div>
                <p class="text-xs font-semibold mb-2" style="color:#475569;">Aptiktos pažeistos dalys:</p>
                <div class="flex flex-wrap gap-2">
                  <div v-for="pid in aiResult.damaged_parts" :key="pid"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style="background:#EEF2FF; color:#4F46E5; border:1px solid #C7D2FE;">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ partLabel(pid) }}
                    <span v-if="aiResult.damage_notes?.[pid]" class="text-[10px] opacity-70">· {{ aiResult.damage_notes[pid] }}</span>
                  </div>
                </div>
              </div>

              <!-- Photos used -->
              <div class="flex gap-2 pt-1">
                <div v-for="(img, i) in uploadedImages" :key="i" class="w-12 h-12 rounded-lg overflow-hidden" style="border:1.5px solid #E2E8F0;">
                  <img :src="img.preview" class="w-full h-full object-cover">
                </div>
                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-[10px] font-semibold" style="background:#F8FAFC; border:1.5px dashed #E2E8F0; color:#94A3B8;">+foto</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button @click="aiState = 'idle'"
              class="px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100"
              style="border:1px solid #E2E8F0; color:#475569;">
              ↺ Bandyti iš naujo
            </button>
            <button @click="acceptAiAndContinue"
              class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style="background:#14A34A; color:#fff;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
              Tęsti → Peržiūrėti diagramoje
            </button>
          </div>
        </div>

        <!-- ── Error state ── -->
        <div v-if="aiState === 'error'" class="rounded-2xl p-6 text-center" style="background:#FEF2F2; border:1px solid #FECACA;">
          <svg class="w-10 h-10 mx-auto mb-3" style="color:#EF4444;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm font-bold mb-1" style="color:#B91C1C;">Analizė nepavyko</p>
          <p class="text-xs mb-4" style="color:#EF4444;">{{ aiError }}</p>
          <div class="flex gap-2 justify-center">
            <button @click="aiState = 'idle'"
              class="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              style="background:#FEF2F2; color:#EF4444; border:1px solid #FECACA;">Bandyti iš naujo</button>
            <button @click="skipToManual"
              class="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              style="background:#fff; color:#475569; border:1px solid #E2E8F0;">Rinktis rankiniu būdu</button>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- STEP 3 · Review & adjust diagram            -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="step === 3" class="flex-1 flex overflow-hidden">

      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-6 py-3 flex-shrink-0" style="background:#fff; border-bottom:1px solid #E2E8F0;">
          <div>
            <p class="text-sm font-bold" style="color:#0F172A;">{{ vehicle?.make }} {{ vehicle?.model }} · {{ vehicle?.year }}</p>
            <p class="text-xs" style="color:#64748B;">
              <span v-if="aiResult" class="inline-flex items-center gap-1 mr-2">
                <span class="w-2 h-2 rounded-full" style="background:#6366F1;"></span>
                AI parinktos dalys pažymėtos · koreguokite jei reikia
              </span>
              <span v-else>Spustelėkite ant pažeistų vietų</span>
            </p>
          </div>
          <div class="flex items-center gap-1 p-1 rounded-xl" style="background:#F1F5F9;">
            <button v-for="v in diagramViews" :key="v.key" @click="activeView = v.key"
              class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              :style="activeView === v.key ? 'background:#fff; color:#0F172A; box-shadow:0 1px 3px rgba(0,0,0,0.08);' : 'color:#64748B;'">{{ v.label }}</button>
          </div>
        </div>

        <div class="flex-1 overflow-auto flex items-start justify-center py-8 px-4 relative">

          <div class="absolute top-4 left-4 space-y-1.5 text-[11px]">
            <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded border" style="background:rgba(99,102,241,0.25); border-color:#6366F1;"></div><span style="color:#64748B;">AI aptikta</span></div>
            <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded border" style="background:rgba(20,163,74,0.25); border-color:#14A34A;"></div><span style="color:#64748B;">Rankiniu būdu</span></div>
            <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded border" style="background:rgba(59,130,246,0.12); border-color:#3B82F6;"></div><span style="color:#94A3B8;">Hover</span></div>
          </div>

          <!-- TOP VIEW -->
          <div v-if="activeView === 'top'" class="relative">
            <svg viewBox="0 0 300 520" style="width:230px; height:auto; cursor:crosshair;" xmlns="http://www.w3.org/2000/svg">
              <path d="M90,30 C118,18 182,18 210,30 L258,72 L260,175 L258,345 L238,432 C204,476 96,476 62,432 L42,345 L40,175 L42,72 Z" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1.5" pointer-events="none"/>
              <ellipse cx="42" cy="148" rx="20" ry="25" fill="#1E293B" stroke="#0F172A" stroke-width="1"/>
              <ellipse cx="258" cy="148" rx="20" ry="25" fill="#1E293B" stroke="#0F172A" stroke-width="1"/>
              <ellipse cx="42" cy="365" rx="20" ry="25" fill="#1E293B" stroke="#0F172A" stroke-width="1"/>
              <ellipse cx="258" cy="365" rx="20" ry="25" fill="#1E293B" stroke="#0F172A" stroke-width="1"/>
              <ellipse cx="42" cy="148" rx="10" ry="13" fill="#475569"/>
              <ellipse cx="258" cy="148" rx="10" ry="13" fill="#475569"/>
              <ellipse cx="42" cy="365" rx="10" ry="13" fill="#475569"/>
              <ellipse cx="258" cy="365" rx="10" ry="13" fill="#475569"/>

              <path v-for="p in topViewParts" :key="p.id" :d="p.path"
                :fill="zoneColor(p.id, 'fill')"
                :stroke="zoneColor(p.id, 'stroke')"
                :stroke-width="(selectedIds.has(p.id) || hoveredPart===p.id) ? '2' : '1'"
                stroke-linejoin="round" class="cursor-pointer"
                @mouseenter="hoveredPart = p.id" @mouseleave="hoveredPart = null" @click="togglePart(p)">
                <title>{{ p.label }}</title>
              </path>
              <text v-for="p in topViewParts.filter(p => p.showLabel)" :key="'t'+p.id"
                :x="p.labelX" :y="p.labelY" text-anchor="middle" dominant-baseline="middle"
                :fill="selectedIds.has(p.id) ? (aiIds.has(p.id) ? '#6366F1' : '#14A34A') : '#94A3B8'"
                font-size="8.5" font-weight="600" pointer-events="none" style="font-family:'Plus Jakarta Sans',sans-serif;">{{ p.label }}</text>
              <g v-for="p in topViewParts.filter(p => selectedIds.has(p.id))" :key="'ck'+p.id" pointer-events="none">
                <circle :cx="p.labelX" :cy="p.labelY - 13" r="7" :fill="aiIds.has(p.id) ? '#6366F1' : '#14A34A'"/>
                <text :x="p.labelX" :y="p.labelY - 13" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="9" font-weight="800">✓</text>
              </g>
            </svg>
            <div v-if="hoveredPart" class="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap" style="background:#0F172A; color:#fff;">{{ allParts.find(p => p.id === hoveredPart)?.label }}</div>
          </div>

          <!-- FRONT VIEW -->
          <div v-if="activeView === 'front'" class="relative">
            <svg viewBox="0 0 300 240" style="width:310px; height:auto; cursor:crosshair;" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="150" cy="226" rx="128" ry="10" fill="rgba(0,0,0,0.05)" pointer-events="none"/>
              <ellipse cx="52" cy="200" rx="40" ry="20" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/>
              <ellipse cx="248" cy="200" rx="40" ry="20" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/>
              <ellipse cx="52" cy="200" rx="20" ry="10" fill="#475569"/>
              <ellipse cx="248" cy="200" rx="20" ry="10" fill="#475569"/>
              <rect x="30" y="58" width="240" height="155" rx="10" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1.5" pointer-events="none"/>
              <path v-for="p in frontViewParts" :key="p.id" :d="p.path"
                :fill="zoneColor(p.id, 'fill')" :stroke="zoneColor(p.id, 'stroke')"
                :stroke-width="(selectedIds.has(p.id) || hoveredPart===p.id) ? '2' : '1'"
                stroke-linejoin="round" class="cursor-pointer"
                @mouseenter="hoveredPart = p.id" @mouseleave="hoveredPart = null" @click="togglePart(p)">
                <title>{{ p.label }}</title>
              </path>
              <text v-for="p in frontViewParts.filter(p => p.showLabel)" :key="'t'+p.id" :x="p.labelX" :y="p.labelY" text-anchor="middle" dominant-baseline="middle"
                :fill="selectedIds.has(p.id) ? (aiIds.has(p.id) ? '#6366F1' : '#14A34A') : '#94A3B8'"
                font-size="9" font-weight="600" pointer-events="none" style="font-family:'Plus Jakarta Sans',sans-serif;">{{ p.label }}</text>
              <g v-for="p in frontViewParts.filter(p => selectedIds.has(p.id))" :key="'ck'+p.id" pointer-events="none">
                <circle :cx="p.labelX" :cy="p.labelY - 14" r="7" :fill="aiIds.has(p.id) ? '#6366F1' : '#14A34A'"/>
                <text :x="p.labelX" :y="p.labelY - 14" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="9" font-weight="800">✓</text>
              </g>
            </svg>
            <div v-if="hoveredPart" class="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap" style="background:#0F172A; color:#fff;">{{ allParts.find(p => p.id === hoveredPart)?.label }}</div>
          </div>

          <!-- REAR VIEW -->
          <div v-if="activeView === 'rear'" class="relative">
            <svg viewBox="0 0 300 240" style="width:310px; height:auto; cursor:crosshair;" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="150" cy="226" rx="128" ry="10" fill="rgba(0,0,0,0.05)" pointer-events="none"/>
              <ellipse cx="52" cy="200" rx="40" ry="20" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/>
              <ellipse cx="248" cy="200" rx="40" ry="20" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/>
              <ellipse cx="52" cy="200" rx="20" ry="10" fill="#475569"/>
              <ellipse cx="248" cy="200" rx="20" ry="10" fill="#475569"/>
              <rect x="30" y="55" width="240" height="158" rx="10" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1.5" pointer-events="none"/>
              <path v-for="p in rearViewParts" :key="p.id" :d="p.path"
                :fill="zoneColor(p.id, 'fill')" :stroke="zoneColor(p.id, 'stroke')"
                :stroke-width="(selectedIds.has(p.id) || hoveredPart===p.id) ? '2' : '1'"
                stroke-linejoin="round" class="cursor-pointer"
                @mouseenter="hoveredPart = p.id" @mouseleave="hoveredPart = null" @click="togglePart(p)">
                <title>{{ p.label }}</title>
              </path>
              <text v-for="p in rearViewParts.filter(p => p.showLabel)" :key="'t'+p.id" :x="p.labelX" :y="p.labelY" text-anchor="middle" dominant-baseline="middle"
                :fill="selectedIds.has(p.id) ? (aiIds.has(p.id) ? '#6366F1' : '#14A34A') : '#94A3B8'"
                font-size="9" font-weight="600" pointer-events="none" style="font-family:'Plus Jakarta Sans',sans-serif;">{{ p.label }}</text>
              <g v-for="p in rearViewParts.filter(p => selectedIds.has(p.id))" :key="'ck'+p.id" pointer-events="none">
                <circle :cx="p.labelX" :cy="p.labelY - 14" r="7" :fill="aiIds.has(p.id) ? '#6366F1' : '#14A34A'"/>
                <text :x="p.labelX" :y="p.labelY - 14" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="9" font-weight="800">✓</text>
              </g>
            </svg>
            <div v-if="hoveredPart" class="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap" style="background:#0F172A; color:#fff;">{{ allParts.find(p => p.id === hoveredPart)?.label }}</div>
          </div>
        </div>
      </div>

      <!-- Right sidebar -->
      <div class="w-72 flex-shrink-0 flex flex-col overflow-hidden" style="background:#fff; border-left:1px solid #E2E8F0;">
        <div class="px-5 py-4 flex-shrink-0" style="border-bottom:1px solid #E2E8F0;">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-sm font-bold" style="color:#0F172A;">Pasirinktos dalys</h3>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full" :style="selectedParts.length ? 'background:#14A34A; color:#fff;' : 'background:#F1F5F9; color:#94A3B8;'">{{ selectedParts.length }}</span>
          </div>
          <p v-if="aiResult" class="text-[11px] flex items-center gap-1" style="color:#6366F1;">
            <span class="w-1.5 h-1.5 rounded-full" style="background:#6366F1;"></span>
            Indigo = AI aptikta · Žalia = pridėta
          </p>
        </div>

        <div v-if="selectedParts.length === 0" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p class="text-xs font-semibold mb-1" style="color:#94A3B8;">Dalių nepasirinkta</p>
          <p class="text-xs" style="color:#CBD5E1;">Spustelėkite ant diagramos</p>
        </div>

        <div v-else class="flex-1 overflow-y-auto p-3 space-y-1.5">
          <TransitionGroup name="list">
            <div v-for="p in selectedParts" :key="p.id"
              class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl group"
              :style="aiIds.has(p.id) ? 'background:#EEF2FF; border:1px solid #C7D2FE;' : 'background:#F0FDF4; border:1px solid #BBF7D0;'">
              <div class="w-2 h-2 rounded-full flex-shrink-0" :style="aiIds.has(p.id) ? 'background:#6366F1;' : 'background:#14A34A;'"></div>
              <p class="text-xs font-semibold flex-1 min-w-0 truncate" style="color:#0F172A;">{{ p.label }}</p>
              <span v-if="aiIds.has(p.id)" class="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style="background:#C7D2FE; color:#4F46E5;">AI</span>
              <button @click="togglePart(p)" class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" style="color:#94A3B8;">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </TransitionGroup>
        </div>

        <div class="p-4 space-y-2 flex-shrink-0" style="border-top:1px solid #E2E8F0;">
          <button @click="step = 2" class="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-100" style="border:1px solid #E2E8F0; color:#64748B;">← Atgal</button>
          <button @click="goToStep4" :disabled="selectedParts.length === 0"
            class="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2"
            :style="selectedParts.length > 0 ? 'background:#14A34A; color:#fff;' : 'background:#F1F5F9; color:#CBD5E1; cursor:not-allowed;'">
            Tęsti ({{ selectedParts.length }} dalys)
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- STEP 4 · Damage details                     -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="step === 4" class="flex-1 overflow-y-auto p-6">
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="mb-6">
          <h2 class="text-xl font-bold" style="color:#0F172A;">Žalos detalės</h2>
          <p class="text-sm mt-1" style="color:#64748B;">Peržiūrėkite AI pasiūlymus ir patikslinkite jei reikia</p>
        </div>

        <div v-for="(pd, i) in partDetails" :key="pd.id" class="rounded-2xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="flex items-center gap-3 px-5 py-3.5" style="background:#FAFAFA; border-bottom:1px solid #F1F5F9;">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style="background:#DCFCE7; color:#14A34A;">{{ i+1 }}</div>
            <p class="text-sm font-bold" style="color:#0F172A;">{{ pd.label }}</p>
            <span v-if="aiIds.has(pd.id)" class="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded" style="background:#EEF2FF; color:#6366F1;">AI</span>
            <span class="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style="background:#F1F5F9; color:#64748B;">{{ viewLabel(pd.view) }}</span>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-semibold mb-2" style="color:#475569;">Žalos laipsnis</label>
              <div class="flex gap-2">
                <button v-for="sev in severities" :key="sev.key" @click="pd.severity = sev.key"
                  class="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all text-center"
                  :style="pd.severity === sev.key ? `background:${sev.bg}; color:${sev.color}; border:1.5px solid ${sev.border};` : 'background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0;'">
                  {{ sev.icon }} {{ sev.label }}
                </button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#475569;">Pažeidimo aprašymas <span style="color:#94A3B8;">(neprivaloma)</span></label>
              <textarea v-model="pd.description" rows="2" :placeholder="pd.placeholder"
                class="w-full px-3.5 py-2.5 text-sm rounded-xl focus:outline-none resize-none"
                style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;"></textarea>
            </div>
          </div>
        </div>

        <div class="rounded-2xl p-5" style="background:#fff; border:1px solid #E2E8F0;">
          <h3 class="text-sm font-bold mb-4" style="color:#0F172A;">Bendra informacija</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold mb-2" style="color:#475569;">Skubumas</label>
              <div class="flex gap-2">
                <button @click="priority = 'normal'" class="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  :style="priority==='normal' ? 'background:#EFF6FF; color:#3B82F6; border:1.5px solid #BFDBFE;' : 'background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0;'">Įprastas (2–5 d.d.)</button>
                <button @click="priority = 'urgent'" class="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  :style="priority==='urgent' ? 'background:#FEF2F2; color:#EF4444; border:1.5px solid #FECACA;' : 'background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0;'">🔴 Skubu (iki 24 val.)</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#475569;">Papildomos pastabos</label>
              <textarea v-model="notes" rows="2" placeholder="pvz. Originali dalis pageidaujama..." class="w-full px-3.5 py-2.5 text-sm rounded-xl focus:outline-none resize-none" style="background:#F8FAFC; border:1px solid #E2E8F0; color:#0F172A; font-family:inherit;"></textarea>
            </div>
          </div>
        </div>

        <div class="rounded-2xl overflow-hidden" style="background:#fff; border:1px solid #E2E8F0;">
          <div class="px-5 py-4 flex items-center justify-between" style="background:#F0FDF4; border-bottom:1px solid #DCFCE7;">
            <div>
              <p class="text-sm font-bold" style="color:#14A34A;">{{ vehicle?.make }} {{ vehicle?.model }} {{ vehicle?.year }}</p>
              <p class="text-xs mt-0.5" style="color:#64748B;">{{ partDetails.length }} užklausa(-os) bus siunčiamos tiekėjams</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" :style="priority==='urgent' ? 'background:#FEF2F2; color:#EF4444;' : 'background:#EFF6FF; color:#3B82F6;'">{{ priority==='urgent' ? '🔴 Skubu' : 'Įprastas' }}</span>
          </div>
          <div class="p-5 flex gap-3">
            <button @click="step = 3" class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100" style="border:1px solid #E2E8F0; color:#475569;">← Atgal</button>
            <button @click="submit" class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 flex items-center justify-center gap-2" style="background:#14A34A; color:#fff;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Pateikti {{ partDetails.length }} užklausą(-as)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- STEP 5 · Success                            -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="step === 5" class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full text-center">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style="background:#F0FDF4; border:3px solid #DCFCE7;">
          <svg class="w-10 h-10" style="color:#14A34A;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2" style="color:#0F172A;">Užklausos pateiktos!</h2>
        <p class="text-sm mb-2" style="color:#64748B;">{{ partDetails.length }} užklausa(-os) išsiųstos tiekėjams.</p>
        <p v-if="aiResult" class="text-xs mb-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style="background:#EEF2FF; color:#6366F1;">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/></svg>
          Identifikuota AI · {{ Math.round((aiResult.confidence ?? 0.9)*100) }}% tikimybė
        </p>

        <div class="rounded-2xl p-4 mb-6 text-left" style="background:#F0FDF4; border:1px solid #DCFCE7;">
          <p class="text-xs font-bold mb-3" style="color:#14A34A;">Sukurtos užklausos:</p>
          <div class="space-y-2">
            <div v-for="(pd, i) in partDetails" :key="pd.id" class="flex items-center justify-between py-1.5 px-3 rounded-lg" style="background:#fff; border:1px solid #DCFCE7;">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:#14A34A; color:#fff;">{{ i+1 }}</div>
                <span class="text-xs font-semibold" style="color:#0F172A;">{{ pd.label }}</span>
                <span v-if="aiIds.has(pd.id)" class="text-[9px] font-bold px-1 py-0.5 rounded" style="background:#EEF2FF; color:#6366F1;">AI</span>
              </div>
              <span class="text-xs font-mono font-bold" style="color:#94A3B8;">UZK-{{ 2860 + i }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="navigateTo('/buyer/queries')" class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-100" style="border:1px solid #E2E8F0; color:#475569;">Žiūrėti užklausas</button>
          <button @click="resetWizard" class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90" style="background:#3B82F6; color:#fff;">+ Nauja užklausa</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'buyer' })
useHead({ title: 'Nauja užklausa — recar BUY' })

// ── Wizard state ────────────────────────────────────────────
const step       = ref(1)
const stepLabels = ['Transporto priemonė', 'AI analizė', 'Diagrama', 'Žalos detalės']

// ── Step 1: Vehicle ─────────────────────────────────────────
const lookupMode = ref<'vin'|'plate'>('vin')
const vinInput   = ref('')
const plateInput = ref('')
const decoding   = ref(false)

interface Vehicle { vin:string; make:string; model:string; year:number; engine:string; power:string; body:string; color:string; colorName:string; colorBg:string; colorAccent:string }

const vehicleDb: Record<string, Vehicle> = {
  'WBA3B51090F000001': { vin:'WBA3B51090F000001', make:'BMW',        model:'5 Series 520d',  year:2009, engine:'2.0d',    power:'177 AG', body:'Sedanas',  color:'#8B9297', colorName:'Titansilber',    colorBg:'#F1F5F9', colorAccent:'#64748B' },
  'WAUZZZ8K9BA000001': { vin:'WAUZZZ8K9BA000001', make:'Audi',       model:'A4 2.0 TDI',     year:2014, engine:'2.0 TDI', power:'150 AG', body:'Sedanas',  color:'#111',    colorName:'Phantom Black',  colorBg:'#F1F5F9', colorAccent:'#1E293B' },
  'ABC123':            { vin:'ABC123',            make:'Volkswagen', model:'Golf VII 1.6 TDI',year:2016, engine:'1.6 TDI', power:'105 AG', body:'Hečbekas', color:'#fff',    colorName:'Pure White',     colorBg:'#F8FAFC', colorAccent:'#94A3B8' },
  'LTA123':            { vin:'LTA123',            make:'Toyota',     model:'Camry 2.5i',      year:2020, engine:'2.5i',    power:'178 AG', body:'Sedanas',  color:'#C0C0C0', colorName:'Silver Metallic', colorBg:'#F1F5F9', colorAccent:'#94A3B8' },
}
const vehicle = ref<Vehicle|null>(null)
const examples = [
  { label:'BMW 5 (E60)', vin:'WBA3B51090F000001' },
  { label:'Audi A4',     vin:'WAUZZZ8K9BA000001' },
  { label:'VW Golf VII', vin:'ABC123' },
  { label:'Toyota',      vin:'LTA123' },
]
async function decodeVehicle() {
  const raw = (lookupMode.value === 'vin' ? vinInput.value : plateInput.value).replace(/\s/g,'').toUpperCase()
  if (!raw) return
  decoding.value = true
  await new Promise(r => setTimeout(r, 900))
  vehicle.value = vehicleDb[raw] ?? { vin:raw, make:'Toyota', model:'Corolla 1.6i', year:2018, engine:'1.6i', power:'132 AG', body:'Sedanas', color:'#B0B0B0', colorName:'Silver', colorBg:'#F1F5F9', colorAccent:'#94A3B8' }
  decoding.value = false
}

// ── Step 2: Upload & AI ─────────────────────────────────────
const fileInput  = ref<HTMLInputElement>()
const isDragOver = ref(false)
interface UploadedImage { file: File; preview: string; name: string; base64: string }
const uploadedImages = ref<UploadedImage[]>([])

type AiState = 'idle'|'analysing'|'done'|'error'
const aiState  = ref<AiState>('idle')
const aiError  = ref('')
const aiResult = ref<{ damaged_parts: string[]; severity: string; confidence?: number; description: string; damage_notes?: Record<string,string> }|null>(null)
const aiIds    = computed(() => new Set(aiResult.value?.damaged_parts ?? []))

const analysisProgress  = ref(0)
const analysisStatusMsg = ref('Įkeliamos nuotraukos...')
const statusMessages    = ['Įkeliamos nuotraukos...', 'Analizuojami pažeidimai...', 'Aptinkamos pažeistos dalys...', 'Ruošiamas atsakymas...']

// Resize image to max 1200px on longest side, JPEG 85% — keeps payload well under server limits
async function resizeImage(file: File, maxPx = 1200, quality = 0.85): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = rej
    reader.onload = () => {
      const img = new Image()
      img.onerror = rej
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        res(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

async function addFiles(files: FileList | File[]) {
  const arr = Array.from(files).slice(0, 4 - uploadedImages.value.length)
  for (const file of arr) {
    if (!file.type.startsWith('image/')) continue
    const base64 = await resizeImage(file)
    uploadedImages.value.push({ file, preview: base64, name: file.name, base64 })
  }
}
function onFileChange(e: Event) { const t = e.target as HTMLInputElement; if (t.files) addFiles(t.files) }
function onDrop(e: DragEvent) { isDragOver.value = false; if (e.dataTransfer?.files) addFiles(e.dataTransfer.files) }
function removeImage(i: number) { uploadedImages.value.splice(i, 1) }

async function startAnalysis() {
  if (!uploadedImages.value.length) return
  aiState.value = 'analysing'
  analysisProgress.value = 0

  // Progress animation
  let msgIdx = 0
  const ticker = setInterval(() => {
    analysisProgress.value = Math.min(analysisProgress.value + 8, 90)
    if (analysisProgress.value % 25 === 0) {
      analysisStatusMsg.value = statusMessages[Math.min(msgIdx++, statusMessages.length - 1)]
    }
  }, 200)

  try {
    const images = uploadedImages.value.map(i => i.base64)
    const result = await $fetch('/api/analyze-damage', { method: 'POST', body: { images } })
    clearInterval(ticker)
    analysisProgress.value = 100
    analysisStatusMsg.value = 'Analizė baigta!'
    await new Promise(r => setTimeout(r, 400))
    aiResult.value = result as any
    aiState.value = 'done'
  } catch (e: any) {
    clearInterval(ticker)
    aiError.value = e?.data?.message ?? 'Nepavyko susisiekti su AI paslauga. Bandykite iš naujo.'
    aiState.value = 'error'
  }
}

function acceptAiAndContinue() {
  if (!aiResult.value) return
  // Pre-select AI-detected parts on the diagram
  selectedParts.value = allParts.value.filter(p => aiIds.value.has(p.id))
  step.value = 3
}

function skipToManual() {
  aiResult.value = null
  selectedParts.value = []
  step.value = 3
}

// ── Step 3: Diagram ─────────────────────────────────────────
const activeView  = ref<'top'|'front'|'rear'>('top')
const hoveredPart = ref<string|null>(null)

const diagramViews = [
  { key:'top',   label:'Viršus ↑' },
  { key:'front', label:'Priekis'  },
  { key:'rear',  label:'Galas'    },
]

interface DiagramPart { id:string; label:string; view:'top'|'front'|'rear'; path:string; labelX:number; labelY:number; showLabel:boolean; isGlass?:boolean }

const topViewParts: DiagramPart[] = [
  { id:'front_bumper', label:'Priek. buferis',    view:'top', path:'M92,28 C118,18 182,18 208,28 L214,56 C180,46 120,46 86,56 Z',           labelX:150, labelY:42,  showLabel:true  },
  { id:'hood',         label:'Variklio dangtis',  view:'top', path:'M84,56 L216,56 L218,158 L82,158 Z',                                      labelX:150, labelY:107, showLabel:true  },
  { id:'windshield',   label:'Priek. stiklas',    view:'top', path:'M82,160 L218,160 L214,218 L86,218 Z',                                    labelX:150, labelY:189, showLabel:true,  isGlass:true },
  { id:'roof',         label:'Stogas',            view:'top', path:'M84,220 L216,220 L216,330 L84,330 Z',                                    labelX:150, labelY:275, showLabel:true  },
  { id:'rear_window',  label:'Galin. stiklas',    view:'top', path:'M84,332 L216,332 L212,378 L88,378 Z',                                    labelX:150, labelY:355, showLabel:true,  isGlass:true },
  { id:'trunk',        label:'Bagažinė',          view:'top', path:'M84,380 L216,380 L214,428 L86,428 Z',                                    labelX:150, labelY:404, showLabel:true  },
  { id:'rear_bumper',  label:'Galin. buferis',    view:'top', path:'M88,430 C120,442 180,442 212,430 L210,462 C178,474 122,474 90,462 Z',    labelX:150, labelY:446, showLabel:true  },
  { id:'lf_fender',    label:'K. priek. sparnas', view:'top', path:'M44,46 L84,46 L84,168 L58,164 L40,126 L38,68 Z',                        labelX:58,  labelY:105, showLabel:false },
  { id:'rf_fender',    label:'D. priek. sparnas', view:'top', path:'M256,46 L216,46 L216,168 L242,164 L260,126 L262,68 Z',                  labelX:242, labelY:105, showLabel:false },
  { id:'left_mirror',  label:'K. veidrodis',      view:'top', path:'M22,108 L44,108 L44,136 L22,136 Z',                                     labelX:33,  labelY:122, showLabel:false },
  { id:'right_mirror', label:'D. veidrodis',      view:'top', path:'M278,108 L256,108 L256,136 L278,136 Z',                                 labelX:267, labelY:122, showLabel:false },
  { id:'lf_door',      label:'K. priek. durys',   view:'top', path:'M38,170 L82,170 L82,256 L40,253 Z',                                    labelX:58,  labelY:213, showLabel:false },
  { id:'rf_door',      label:'D. priek. durys',   view:'top', path:'M262,170 L218,170 L218,256 L260,253 Z',                                labelX:242, labelY:213, showLabel:false },
  { id:'lr_door',      label:'K. galin. durys',   view:'top', path:'M38,258 L82,258 L82,338 L40,335 Z',                                    labelX:58,  labelY:298, showLabel:false },
  { id:'rr_door',      label:'D. galin. durys',   view:'top', path:'M262,258 L218,258 L218,338 L260,335 Z',                                labelX:242, labelY:298, showLabel:false },
  { id:'lr_quarter',   label:'K. galin. sparnas', view:'top', path:'M38,340 L82,340 L82,432 L60,440 L38,415 Z',                            labelX:56,  labelY:385, showLabel:false },
  { id:'rr_quarter',   label:'D. galin. sparnas', view:'top', path:'M262,340 L218,340 L218,432 L240,440 L262,415 Z',                       labelX:244, labelY:385, showLabel:false },
]
const frontViewParts: DiagramPart[] = [
  { id:'hood_front',   label:'Variklio dangtis',  view:'front', path:'M36,62 L264,62 L258,74 L42,74 Z',            labelX:150, labelY:68,  showLabel:true },
  { id:'lh_light',     label:'K. žibintas',       view:'front', path:'M32,76 L108,81 L104,138 L26,132 Z',          labelX:65,  labelY:109, showLabel:true, isGlass:true },
  { id:'rh_light',     label:'D. žibintas',       view:'front', path:'M268,76 L192,81 L196,138 L274,132 Z',        labelX:235, labelY:109, showLabel:true, isGlass:true },
  { id:'front_grille', label:'Grotelės/Buferis',  view:'front', path:'M108,83 L192,83 L190,162 L110,162 Z',        labelX:150, labelY:123, showLabel:true },
  { id:'lf_wing',      label:'K. sparnas',        view:'front', path:'M22,140 L106,140 L106,198 L20,194 Z',        labelX:62,  labelY:169, showLabel:true },
  { id:'rf_wing',      label:'D. sparnas',        view:'front', path:'M278,140 L194,140 L194,198 L280,194 Z',      labelX:238, labelY:169, showLabel:true },
]
const rearViewParts: DiagramPart[] = [
  { id:'trunk_lid',    label:'Bagažinė',          view:'rear', path:'M38,58 L262,58 L258,70 L42,70 Z',            labelX:150, labelY:64,  showLabel:true  },
  { id:'lt_light',     label:'K. stop žibintas',  view:'rear', path:'M26,73 L104,78 L100,140 L22,134 Z',          labelX:60,  labelY:107, showLabel:true, isGlass:true },
  { id:'rt_light',     label:'D. stop žibintas',  view:'rear', path:'M274,73 L196,78 L200,140 L278,134 Z',        labelX:240, labelY:107, showLabel:true, isGlass:true },
  { id:'rear_b_panel', label:'Galin. buferis',    view:'rear', path:'M104,80 L196,80 L194,166 L106,166 Z',        labelX:150, labelY:123, showLabel:true },
  { id:'lr_wing',      label:'K. galin. sparnas', view:'rear', path:'M18,142 L102,142 L102,202 L16,198 Z',        labelX:58,  labelY:172, showLabel:true },
  { id:'rr_wing',      label:'D. galin. sparnas', view:'rear', path:'M282,142 L198,142 L198,202 L284,198 Z',      labelX:242, labelY:172, showLabel:true },
]

const allParts       = computed(() => [...topViewParts, ...frontViewParts, ...rearViewParts])
const selectedParts  = ref<DiagramPart[]>([])
const selectedIds    = computed(() => new Set(selectedParts.value.map(p => p.id)))

function togglePart(p: DiagramPart) {
  const idx = selectedParts.value.findIndex(s => s.id === p.id)
  if (idx >= 0) selectedParts.value.splice(idx, 1)
  else          selectedParts.value.push(p)
}

function zoneColor(id: string, type: 'fill'|'stroke') {
  const isSelected = selectedIds.value.has(id)
  const isAi       = aiIds.value.has(id)
  const isHovered  = hoveredPart.value === id
  const part       = allParts.value.find(p => p.id === id)

  if (type === 'fill') {
    if (isSelected && isAi)  return 'rgba(99,102,241,0.28)'
    if (isSelected)          return 'rgba(20,163,74,0.28)'
    if (isHovered)           return 'rgba(59,130,246,0.12)'
    if (part?.isGlass)       return 'rgba(186,230,253,0.45)'
    return 'rgba(255,255,255,0.01)'
  } else {
    if (isSelected && isAi)  return '#6366F1'
    if (isSelected)          return '#14A34A'
    if (isHovered)           return '#3B82F6'
    if (part?.isGlass)       return '#7DD3FC'
    return '#CBD5E1'
  }
}

function viewLabel(v: string) {
  if (v === 'top')   return 'Viršus'
  if (v === 'front') return 'Priekis'
  if (v === 'rear')  return 'Galas'
  return v
}

const PART_LABELS: Record<string,string> = {
  front_bumper:'Priekinis buferis', hood:'Variklio dangtis', windshield:'Priekinis stiklas',
  roof:'Stogas', rear_window:'Galinis stiklas', trunk:'Bagažinė', rear_bumper:'Galinis buferis',
  lf_fender:'K. priek. sparnas', rf_fender:'D. priek. sparnas', left_mirror:'K. veidrodis', right_mirror:'D. veidrodis',
  lf_door:'K. priek. durys', rf_door:'D. priek. durys', lr_door:'K. galin. durys', rr_door:'D. galin. durys',
  lr_quarter:'K. galin. sparnas', rr_quarter:'D. galin. sparnas',
  hood_front:'Variklio dangtis', lh_light:'K. žibintas', rh_light:'D. žibintas',
  front_grille:'Grotelės/Buferis', lf_wing:'K. sparnas', rf_wing:'D. sparnas',
  trunk_lid:'Bagažinė', lt_light:'K. stop žibintas', rt_light:'D. stop žibintas',
  rear_b_panel:'Galinis buferis', lr_wing:'K. galin. sparnas', rr_wing:'D. galin. sparnas',
}
function partLabel(id: string) { return PART_LABELS[id] ?? id }

// ── Step 4: Details ─────────────────────────────────────────
const priority   = ref<'normal'|'urgent'>('normal')
const notes      = ref('')
const severities = [
  { key:'minor',  label:'Smulkus',   icon:'🟢', bg:'#F0FDF4', color:'#14A34A', border:'#BBF7D0' },
  { key:'medium', label:'Vidutinis', icon:'🟡', bg:'#FFFBEB', color:'#D97706', border:'#FDE68A' },
  { key:'major',  label:'Didelis',   icon:'🔴', bg:'#FEF2F2', color:'#EF4444', border:'#FECACA' },
]

interface PartDetail { id:string; label:string; view:string; severity:string; description:string; placeholder:string }
const partDetails = ref<PartDetail[]>([])

function getPlaceholder(id: string) {
  if (id.includes('bumper'))                             return 'Įtrūkimas dešinėje pusėje, dažai nulupti ~20cm'
  if (id.includes('door'))                              return 'Įlanka iš išorės ~10cm'
  if (id.includes('fender')||id.includes('wing')||id.includes('quarter')) return 'Didelė įlanka po šoninio smūgio'
  if (id.includes('light'))                             return 'Įtrūkęs difuzorius, žibintas veikia'
  if (id.includes('hood')||id.includes('trunk'))        return 'Nedidelės krušos žymės'
  if (id.includes('glass')||id.includes('window')||id.includes('shield')) return 'Įtrūkimas, 18cm'
  if (id.includes('mirror'))                            return 'Palūžęs korpusas'
  return 'Aprašykite pažeidimą...'
}

function goToStep4() {
  const aiSeverity = aiResult.value?.severity ?? 'minor'
  partDetails.value = selectedParts.value.map(p => ({
    id: p.id, label: p.label, view: p.view,
    severity: aiIds.value.has(p.id) ? aiSeverity : 'minor',
    description: aiResult.value?.damage_notes?.[p.id] ?? '',
    placeholder: getPlaceholder(p.id),
  }))
  step.value = 4
}

function submit() { step.value = 5 }

function severityBadge(s: string) {
  if (s === 'major')  return 'background:rgba(239,68,68,0.2); color:#FCA5A5;'
  if (s === 'medium') return 'background:rgba(245,158,11,0.2); color:#FDE68A;'
  return 'background:rgba(20,163,74,0.2); color:#86EFAC;'
}
function severityLt(s: string) {
  if (s === 'major')  return 'Didelė žala'
  if (s === 'medium') return 'Vidutinė žala'
  return 'Smulki žala'
}

function resetWizard() {
  step.value = 1; vehicle.value = null; vinInput.value = ''; plateInput.value = ''
  uploadedImages.value = []; aiState.value = 'idle'; aiResult.value = null
  selectedParts.value = []; partDetails.value = []
  priority.value = 'normal'; notes.value = ''; activeView.value = 'top'
  analysisProgress.value = 0
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.25s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-10px); }
@keyframes spin-slow { to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 2s linear infinite; }
</style>
