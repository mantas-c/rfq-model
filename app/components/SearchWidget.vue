<template>
  <div class="w-full relative z-10">
    <!-- ═══ SEARCH CARD ═══ -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100">

      <!-- Top bar: input + action buttons -->
      <div class="p-4 sm:p-5 space-y-3">

        <!-- Search input row -->
        <div class="relative">
          <!-- Search icon -->
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>

          <!-- Smart label badge -->
          <Transition name="label-fade">
            <span
              v-if="searchQuery"
              :key="smartLabel.text"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide"
              :class="smartLabel.classes"
            >{{ smartLabel.text }}</span>
          </Transition>

          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="currentPlaceholder"
            class="w-full pl-11 pr-24 py-3.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
            @keydown.enter="handleSearch"
            @focus="searchFocused = true"
          />

          <!-- Suggestions dropdown -->
          <Transition name="dropdown">
            <div
              v-if="searchFocused"
              class="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[200] overflow-hidden"
              style="max-height: 340px; overflow-y: auto;"
            >
              <!-- Empty state: recent + popular -->
              <template v-if="!searchQuery">
                <div class="px-4 pt-3 pb-1">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paskutinės paieškos</p>
                </div>
                <div
                  v-for="r in recentSearches" :key="r.text"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                  @mousedown.prevent="selectSuggestion(r.text)"
                >
                  <div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <span class="text-sm text-gray-700">{{ r.text }}</span>
                  <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md" :class="r.typeClass">{{ r.type }}</span>
                </div>
                <div class="px-4 pt-3 pb-1 border-t border-gray-50 mt-1">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Populiarios paieškos</p>
                </div>
                <div
                  v-for="p in popularSuggestions" :key="p.text"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                  @mousedown.prevent="selectSuggestion(p.text)"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" :class="p.iconBg">
                    <svg class="w-3.5 h-3.5" :class="p.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z"/></svg>
                  </div>
                  <span class="text-sm text-gray-700">{{ p.text }}</span>
                  <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md" :class="p.typeClass">{{ p.type }}</span>
                </div>
              </template>

              <!-- Typed: filtered suggestions -->
              <template v-else>
                <div v-if="typedSuggestions.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">
                  Rezultatų nerasta
                </div>
                <div
                  v-for="s in typedSuggestions" :key="s.text"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                  @mousedown.prevent="selectSuggestion(s.text)"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" :class="s.iconBg">
                    <svg class="w-3.5 h-3.5" :class="s.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="s.iconPath"/></svg>
                  </div>
                  <span class="text-sm text-gray-700" v-html="highlightQuery(s.text)"></span>
                  <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" :class="s.typeClass">{{ s.type }}</span>
                </div>
              </template>
            </div>
          </Transition>
        </div>

        <!-- Action row: toggle + buttons -->
        <div class="flex items-center gap-2">

          <!-- "Pats pasirinksiu" toggle -->
          <label class="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <span class="relative inline-flex items-center">
              <input type="checkbox" v-model="filtersOpen" class="sr-only peer" />
              <div class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand-green transition-colors duration-200"></div>
              <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4"></div>
            </span>
            <span class="text-xs font-medium text-gray-600 whitespace-nowrap">Pats pasirinksiu</span>
          </label>

          <div class="flex-1"></div>

          <!-- Main search button -->
          <button
            @click="handleSearch"
            class="flex items-center gap-1.5 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
            style="background-color: #14A34A;"
            @mouseover="(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0f7c38'"
            @mouseleave="(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#14A34A'"
          >
            Rasti dalis
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ═══ EXPANDABLE FILTERS ═══ -->
      <Transition name="filters-expand">
        <div v-if="filtersOpen" class="border-t border-gray-100">

          <!-- Selection summary bar -->
          <Transition name="summary-fade">
            <div v-if="selectedBrand || selectedCategories.length" class="flex flex-wrap items-center gap-1.5 px-4 sm:px-5 pt-3 pb-0">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mr-1">Pasirinkta:</span>
              <span v-if="selectedBrand" class="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {{ selectedBrand }}
                <button @click="clearBrand" class="hover:text-green-900 ml-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </span>
              <svg v-if="selectedBrand && selectedModel" class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <span v-if="selectedModel" class="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {{ selectedModel }}
                <button @click="clearModel" class="hover:text-green-900 ml-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </span>
              <svg v-if="selectedModel && selectedGeneration" class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <span v-if="selectedGeneration" class="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {{ selectedGeneration }}
                <button @click="selectedGeneration = ''" class="hover:text-gray-900 ml-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </span>
              <span
                v-for="cat in selectedCategories"
                :key="cat"
                class="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                {{ cat }}
                <button @click="toggleCategory(cat)" class="hover:text-indigo-900 ml-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </span>
            </div>
          </Transition>

          <!-- 4 dropdowns grid -->
          <div class="grid grid-cols-2 gap-2 sm:gap-3 p-4 sm:p-5 pt-3">

            <!-- Markė -->
            <div class="relative">
              <select
                v-model="selectedBrand"
                @change="selectedModel = ''; selectedGeneration = ''"
                class="w-full px-3 py-2.5 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-7"
              >
                <option value="">Markė...</option>
                <option v-for="brand in Object.keys(carData)" :key="brand" :value="brand">{{ brand }}</option>
              </select>
              <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>

            <!-- Modelis -->
            <div class="relative">
              <select
                v-model="selectedModel"
                :disabled="!selectedBrand"
                @change="selectedGeneration = ''"
                class="w-full px-3 py-2.5 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-7 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Modelis...</option>
                <option v-for="m in availableModels" :key="m" :value="m">{{ m }}</option>
              </select>
              <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>

            <!-- Generacija -->
            <div class="relative">
              <select
                v-model="selectedGeneration"
                :disabled="!selectedModel"
                class="w-full px-3 py-2.5 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-7 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Generacija...</option>
                <option v-for="g in availableGenerations" :key="g" :value="g">{{ g }}</option>
              </select>
              <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>

            <!-- Kategorija (multi-select dropdown) -->
            <div class="relative" ref="categoryDropdownRef">
              <button
                @click="categoryOpen = !categoryOpen"
                type="button"
                class="w-full px-3 py-2.5 text-xs sm:text-sm text-left bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all cursor-pointer pr-7 truncate"
                :class="selectedCategories.length ? 'text-gray-900 font-medium' : 'text-gray-500'"
              >
                {{ selectedCategories.length ? `${selectedCategories.length} pasirinkta` : 'Kategorija...' }}
              </button>
              <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform duration-200" :class="categoryOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>

              <!-- Category dropdown panel -->
              <Transition name="dropdown">
                <div v-if="categoryOpen" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <!-- Filter input -->
                  <div class="p-2 border-b border-gray-100">
                    <div class="relative">
                      <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      <input v-model="categoryFilter" type="text" placeholder="Filtruoti..." class="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green" />
                    </div>
                  </div>
                  <div class="max-h-44 overflow-y-auto py-1">
                    <label
                      v-for="cat in filteredCategories"
                      :key="cat"
                      class="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedCategories.includes(cat)"
                        @change="toggleCategory(cat)"
                        class="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span class="text-xs text-gray-700">{{ cat }}</span>
                    </label>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Popular search chips -->
          <div class="px-4 sm:px-5 pb-4 sm:pb-5">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Populiarios paieškos</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="chip in popularChips"
                :key="chip"
                @click="searchQuery = chip"
                class="text-xs text-gray-600 border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 px-2.5 py-1 rounded-full transition-all duration-150"
              >
                {{ chip }}
              </button>
            </div>
          </div>

        </div>
      </Transition>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// ─── Car Data ───────────────────────────────────────────────────────────────
type EngineList = string[]
type ChassisMap = Record<string, EngineList>
type CarData = Record<string, Record<string, ChassisMap>>

const carData: CarData = {
  'BMW': {
    '3 Serija': {
      'E46': ['1.8i 85kw', '2.0i 110kw', '2.5i 141kw', '2.0d 100kw', '3.0d 135kw', '3.0d 150kw'],
      'E90': ['2.0i 110kw', '2.5i 130kw', '3.0i 190kw', '2.0d 120kw', '3.0d 155kw', '3.5i 225kw'],
      'F30': ['2.0i 135kw', '3.0i 190kw', '2.0d 135kw', '3.0d 190kw', '3.5i 240kw'],
    },
    '5 Serija': {
      'E39': ['2.0i 110kw', '2.5i 141kw', '2.8i 142kw', '2.0d 100kw', '2.5d 120kw', '3.0d 135kw'],
      'E60': ['2.0i 125kw', '2.5i 130kw', '3.0i 190kw', '2.0d 120kw', '2.5d 130kw', '3.0d 160kw'],
      'F10': ['2.0i 135kw', '3.0i 190kw', '2.0d 135kw', '3.0d 190kw', '4.4i 330kw'],
      'G30': ['2.0i 135kw', '3.0i 195kw', '2.0d 140kw', '3.0d 195kw', '4.4i 390kw'],
    },
    'X5': {
      'E53': ['3.0i 170kw', '4.4i 210kw', '3.0d 135kw', '4.6is 255kw'],
      'E70': ['3.0i 200kw', '4.8i 261kw', '3.0d 173kw', '3.0d 210kw', '4.0d 230kw'],
      'F15': ['2.0d 140kw', '3.0d 190kw', '3.0d 230kw', '3.0i 240kw', '4.4i 330kw'],
    },
  },
  'Audi': {
    'A4': {
      'B6': ['1.8T 120kw', '1.8T 110kw', '2.0i 96kw', '1.9 TDI 96kw', '2.5 TDI 120kw', '3.0 TDI 150kw'],
      'B7': ['2.0T 147kw', '2.0T 120kw', '2.0 TDI 103kw', '2.0 TDI 125kw', '3.0 TDI 171kw'],
      'B8': ['1.8 TFSI 118kw', '2.0 TFSI 155kw', '2.0 TDI 105kw', '2.0 TDI 125kw', '3.0 TDI 176kw'],
      'B9': ['1.4 TFSI 110kw', '2.0 TFSI 140kw', '2.0 TDI 110kw', '2.0 TDI 140kw', '3.0 TDI 200kw'],
    },
    'A6': {
      'C5': ['1.8T 110kw', '2.4i 121kw', '2.7T 184kw', '1.9 TDI 85kw', '2.5 TDI 120kw'],
      'C6': ['2.0 TFSI 125kw', '2.8 FSI 154kw', '2.0 TDI 103kw', '2.0 TDI 125kw', '3.0 TDI 171kw'],
      'C7': ['1.8 TFSI 141kw', '2.0 TFSI 155kw', '2.0 TDI 130kw', '3.0 TDI 150kw', '3.0 TDI 200kw'],
    },
    'Q7': {
      '4L': ['3.6 FSI 206kw', '4.2 FSI 257kw', '3.0 TDI 171kw', '4.2 TDI 240kw', '6.0 TDI 368kw'],
      '4M': ['2.0 TFSI 185kw', '3.0 TFSI 250kw', '2.0 TDI 140kw', '3.0 TDI 170kw', '3.0 TDI 200kw'],
    },
  },
  'Volkswagen': {
    'Golf': {
      'Golf 4': ['1.4i 55kw', '1.6i 74kw', '1.8T 110kw', '1.9 TDI 66kw', '1.9 TDI 85kw', '1.9 TDI 96kw'],
      'Golf 5': ['1.4i 55kw', '1.6i 75kw', '2.0 GTI 147kw', '1.9 TDI 77kw', '2.0 TDI 103kw', '2.0 TDI 125kw'],
      'Golf 6': ['1.2 TSI 77kw', '1.4 TSI 90kw', '2.0 GTI 155kw', '1.6 TDI 77kw', '2.0 TDI 103kw'],
      'Golf 7': ['1.0 TSI 85kw', '1.4 TSI 103kw', '2.0 GTI 169kw', '1.6 TDI 81kw', '2.0 TDI 110kw'],
    },
    'Passat': {
      'B5': ['1.6i 74kw', '1.8T 110kw', '2.8i 142kw', '1.9 TDI 85kw', '1.9 TDI 96kw', '2.5 TDI 110kw'],
      'B6': ['1.4 TSI 90kw', '1.8 TSI 118kw', '2.0 TSI 147kw', '1.6 TDI 77kw', '2.0 TDI 103kw', '2.0 TDI 125kw'],
      'B7': ['1.4 TSI 90kw', '1.8 TSI 118kw', '2.0 TSI 147kw', '1.6 TDI 77kw', '2.0 TDI 103kw', '2.0 TDI 125kw'],
      'B8': ['1.4 TSI 110kw', '1.8 TSI 132kw', '2.0 TSI 162kw', '1.6 TDI 88kw', '2.0 TDI 110kw', '2.0 TDI 140kw'],
    },
  },
  'Mercedes-Benz': {
    'E-Klasė': {
      'W211': ['E200 100kw', 'E220 120kw', 'E280 150kw', 'E320 165kw', 'E200 CDI 90kw', 'E220 CDI 110kw', 'E270 CDI 130kw', 'E320 CDI 150kw'],
      'W212': ['E200 135kw', 'E250 150kw', 'E350 225kw', 'E200 CDI 100kw', 'E220 CDI 120kw', 'E250 CDI 150kw', 'E350 CDI 170kw'],
      'W213': ['E200 135kw', 'E250 155kw', 'E350 215kw', 'E200d 110kw', 'E220d 143kw', 'E350d 190kw'],
    },
    'C-Klasė': {
      'W203': ['C180 95kw', 'C200 120kw', 'C230 141kw', 'C200 CDI 85kw', 'C220 CDI 105kw', 'C270 CDI 125kw'],
      'W204': ['C180 115kw', 'C200 135kw', 'C250 150kw', 'C200 CDI 100kw', 'C220 CDI 120kw', 'C250 CDI 150kw'],
      'W205': ['C180 115kw', 'C200 135kw', 'C300 180kw', 'C200d 110kw', 'C220d 143kw', 'C300d 170kw'],
    },
  },
  'Toyota': {
    'Avensis': {
      'T22': ['1.6i 77kw', '1.8i 89kw', '2.0i 108kw', '2.0 D-4D 81kw', '2.0 D-4D 85kw'],
      'T25': ['1.6i 81kw', '1.8i 95kw', '2.0i 108kw', '2.0 D-4D 93kw', '2.2 D-4D 110kw', '2.2 D-4D 130kw'],
      'T27': ['1.6i 97kw', '1.8i 108kw', '2.0 D-4D 93kw', '2.0 D-4D 110kw', '2.2 D-4D 130kw'],
    },
    'Corolla': {
      'E12': ['1.4i 71kw', '1.6i 81kw', '1.8i 99kw', '2.0 D-4D 85kw'],
      'E15': ['1.3i 64kw', '1.4i 71kw', '1.6i 97kw', '1.4 D-4D 66kw', '2.0 D-4D 93kw'],
      'E21': ['1.2T 85kw', '1.8 Hybrid 90kw', '2.0 Hybrid 135kw'],
    },
  },
  'Volvo': {
    'XC60': {
      'I': ['T5 180kw', 'T6 224kw', 'D3 100kw', 'D4 120kw', 'D5 151kw', 'D5 169kw'],
      'II': ['T5 187kw', 'T6 235kw', 'T8 288kw', 'D3 110kw', 'D4 140kw', 'D5 165kw'],
    },
    'S60': {
      'I':   ['2.0T 132kw', '2.4i 103kw', '2.4T 147kw', '2.4 D5 120kw', '2.4 D5 136kw'],
      'II':  ['T3 110kw', 'T4 132kw', 'T5 180kw', 'T6 224kw', 'D2 88kw', 'D3 100kw', 'D4 120kw', 'D5 158kw'],
      'III': ['T4 140kw', 'T5 184kw', 'T6 228kw', 'T8 287kw', 'D3 110kw', 'D4 140kw'],
    },
  },
}

const categories = [
  'Variklio dalys', 'Transmisija', 'Stabdžiai', 'Žibintai', 'Bamperiai',
  'Dangčiai', 'Durys', 'Sparnai', 'Elektros sistema', 'Vairų sistema',
  'Pakaba', 'Išmetimo sistema', 'Aušinimo sistema', 'Tepimo sistema',
  'Kėbulo dalys', 'Stiklai', 'Salonų dalys', 'Radiatoriaus grotelės',
  'Oro kondicionierius', 'Turbokompresoriai', 'Sankabos sistema',
  'Generatoriai', 'Starteriai', 'Alternatoriai', 'Amortizatoriai',
  'Spyruoklės', 'Variklio dangtis', 'Katalizatoriai', 'Lambda zondai',
  'Diferencialo dalys',
]

const popularChips = [
  'BMW E60 bamperis', 'Audi A4 generatorius', 'VW Golf 5 kapotas',
  'Mercedes W211 žibintas', 'Volvo XC60 stabdžiai', 'Toyota Avensis durys',
]

const carBrands = ['BMW', 'Audi', 'Volkswagen', 'Mercedes', 'Mercedes-Benz', 'Toyota', 'Volvo', 'Opel', 'Honda', 'Renault', 'Peugeot', 'Ford', 'Skoda', 'Seat', 'Subaru', 'Dacia']

// Placeholders ──────────────────────────────────────────────
interface PlaceholderItem { text: string; label: string }
const placeholders: PlaceholderItem[] = [
  { text: '4F055322AB', label: 'OEM KODAS' },
  { text: 'Generatorius', label: 'KATEGORIJA' },
  { text: 'VW Passat Bamperis', label: 'AUTOMOBILIS + KATEGORIJA' },
  { text: 'BMW 5 Serija', label: 'AUTOMOBILIS' },
]

const currentPlaceholder = ref('')
const placeholderIdx = ref(0)
const charIdx = ref(0)
const erasing = ref(false)
let twTimer: ReturnType<typeof setTimeout> | null = null

function typewriterStep() {
  const current = placeholders[placeholderIdx.value]
  if (!erasing.value) {
    if (charIdx.value < current.text.length) {
      currentPlaceholder.value = current.text.slice(0, charIdx.value + 1)
      charIdx.value++
      twTimer = setTimeout(typewriterStep, 80)
    } else {
      twTimer = setTimeout(() => {
        erasing.value = true
        typewriterStep()
      }, 2200)
    }
  } else {
    if (charIdx.value > 0) {
      charIdx.value--
      currentPlaceholder.value = current.text.slice(0, charIdx.value)
      twTimer = setTimeout(typewriterStep, 45)
    } else {
      erasing.value = false
      placeholderIdx.value = (placeholderIdx.value + 1) % placeholders.length
      twTimer = setTimeout(typewriterStep, 400)
    }
  }
}

// ─── Suggestion data ────────────────────────────────────────────────────────
const recentSearches = [
  { text: 'BMW E60 generatorius',        type: 'AUTOMOBILIS',  typeClass: 'bg-green-50 text-green-700' },
  { text: '8K0 941 004',                 type: 'OEM KODAS',    typeClass: 'bg-indigo-50 text-indigo-700' },
  { text: 'Audi A6 bamperis',            type: 'AUTOMOBILIS',  typeClass: 'bg-green-50 text-green-700' },
]
const popularSuggestions = [
  { text: 'BMW',            type: 'GAMINTOJAS', typeClass: 'bg-blue-50 text-blue-700',   iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',  iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z' },
  { text: 'Audi',           type: 'GAMINTOJAS', typeClass: 'bg-blue-50 text-blue-700',   iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',  iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z' },
  { text: 'Generatorius',   type: 'DALIS',      typeClass: 'bg-orange-50 text-orange-700', iconBg: 'bg-orange-50', iconColor: 'text-orange-400', iconPath: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
  { text: 'VW Passat B6 žibintai', type: 'AUTOMOBILIS', typeClass: 'bg-green-50 text-green-700', iconBg: 'bg-green-50', iconColor: 'text-green-500', iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z' },
]

const allSuggestionItems = [
  ...carBrands.map(b => ({ text: b, type: 'GAMINTOJAS', typeClass: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z' })),
  ...categories.map(c => ({ text: c, type: 'DALIS', typeClass: 'bg-orange-50 text-orange-700', iconBg: 'bg-orange-50', iconColor: 'text-orange-400', iconPath: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' })),
  ...popularChips.map(p => ({ text: p, type: 'AUTOMOBILIS', typeClass: 'bg-green-50 text-green-700', iconBg: 'bg-green-50', iconColor: 'text-green-500', iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z' })),
]

const typedSuggestions = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  // OEM code pattern
  if (/^[a-z0-9\s]{4,}$/i.test(searchQuery.value) && /\d/.test(searchQuery.value)) {
    return [{ text: searchQuery.value.toUpperCase(), type: 'OEM KODAS', typeClass: 'bg-indigo-50 text-indigo-700', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' }]
  }
  return allSuggestionItems.filter(s => s.text.toLowerCase().includes(q)).slice(0, 8)
})

function highlightQuery(text: string): string {
  if (!searchQuery.value) return text
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<strong>$1</strong>')
}

function selectSuggestion(text: string) {
  searchQuery.value = text
  searchFocused.value = false
}

// ─── Search card state ─────────────────────────────────────────────────────
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const searchFocused = ref(false)
const filtersOpen = ref(false)
const selectedBrand = ref('')
const selectedModel = ref('')
const selectedGeneration = ref('')
const selectedCategories = ref<string[]>([])
const categoryOpen = ref(false)
const categoryFilter = ref('')
const categoryDropdownRef = ref<HTMLElement | null>(null)

const availableModels = computed(() =>
  selectedBrand.value && carData[selectedBrand.value]
    ? Object.keys(carData[selectedBrand.value])
    : []
)

const availableGenerations = computed(() =>
  selectedBrand.value && selectedModel.value && carData[selectedBrand.value]?.[selectedModel.value]
    ? Object.keys(carData[selectedBrand.value][selectedModel.value])
    : []
)

const filteredCategories = computed(() =>
  categories.filter(c => c.toLowerCase().includes(categoryFilter.value.toLowerCase()))
)

function toggleCategory(cat: string) {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx === -1) selectedCategories.value.push(cat)
  else selectedCategories.value.splice(idx, 1)
}

function clearBrand() {
  selectedBrand.value = ''
  selectedModel.value = ''
  selectedGeneration.value = ''
}

function clearModel() {
  selectedModel.value = ''
  selectedGeneration.value = ''
}

// Smart label
const smartLabel = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return { text: 'PAIEŠKA', classes: 'bg-green-50 text-green-700' }
  if (/\d/.test(q)) return { text: 'OEM KODAS', classes: 'bg-indigo-50 text-indigo-700' }
  const hasBrand = carBrands.some(b => q.toLowerCase().includes(b.toLowerCase()))
  const hasCategory = categories.some(c => q.toLowerCase().includes(c.toLowerCase().split(' ')[0]))
  if (hasBrand && hasCategory) return { text: 'AUTOMOBILIS + KATEGORIJA', classes: 'bg-green-50 text-green-700' }
  if (hasBrand) return { text: 'AUTOMOBILIS', classes: 'bg-green-50 text-green-700' }
  if (hasCategory) return { text: 'KATEGORIJA', classes: 'bg-green-50 text-green-700' }
  return { text: 'PAIEŠKA', classes: 'bg-gray-100 text-gray-500' }
})

function handleSearch() {
  searchFocused.value = false
  const query: Record<string, string> = {}
  if (searchQuery.value.trim())           query.q        = searchQuery.value.trim()
  if (selectedBrand.value)                query.make     = selectedBrand.value
  if (selectedModel.value)                query.model    = selectedModel.value
  if (selectedGeneration.value)           query.gen      = selectedGeneration.value
  if (selectedCategories.value.length)    query.category = selectedCategories.value.join(',')
  navigateTo({ path: '/catalog', query })
}


// Close dropdowns on outside click
function handleOutsideClick(e: MouseEvent) {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target as Node)) {
    categoryOpen.value = false
  }
  if (searchInputRef.value && !searchInputRef.value.closest('.relative')?.contains(e.target as Node)) {
    searchFocused.value = false
  }
}

function getModelsForBrand(brand: string): string[] {
  const key = brand === 'Mercedes' ? 'Mercedes-Benz' : brand
  return carData[key] ? Object.keys(carData[key]) : []
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  twTimer = setTimeout(typewriterStep, 600)
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  if (twTimer) clearTimeout(twTimer)
  document.removeEventListener('click', handleOutsideClick)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Filters expand/collapse */
.filters-expand-enter-active,
.filters-expand-leave-active {
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  overflow: hidden;
}
.filters-expand-enter-from,
.filters-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.filters-expand-enter-to,
.filters-expand-leave-from {
  max-height: 600px;
  opacity: 1;
}

/* Summary bar fade */
.summary-fade-enter-active,
.summary-fade-leave-active {
  transition: opacity 0.2s ease;
}
.summary-fade-enter-from,
.summary-fade-leave-to {
  opacity: 0;
}

/* Category dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* Smart label badge */
.label-fade-enter-active,
.label-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.label-fade-enter-from,
.label-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Modal overlay */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Modal panel */
.modal-panel-enter-active,
.modal-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}
@media (max-width: 640px) {
  .modal-panel-enter-from,
  .modal-panel-leave-to {
    transform: translateY(100%);
  }
}
</style>
