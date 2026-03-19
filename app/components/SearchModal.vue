<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Blur overlay -->
        <div class="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>

        <!-- Modal: bottom sheet on mobile, centered dialog on sm+ -->
        <div class="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 z-10 max-h-[92vh] overflow-y-auto">
          <!-- Drag handle (mobile) -->
          <div class="flex justify-center sm:hidden mb-1">
            <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-gray-950">Ieškoti dalies</h2>
            <button
              @click="$emit('update:modelValue', false)"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Text search -->
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder='Pvz. "BMW E60 kapotas" arba OEM kodas...'
              class="w-full pl-12 pr-4 py-4 text-base text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
              @keydown.enter="search"
            >
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-gray-100"></div>
            <span class="text-xs text-gray-400 font-medium">arba filtruok pagal automobilį</span>
            <div class="flex-1 h-px bg-gray-100"></div>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-2 gap-3">
            <div class="relative">
              <select class="w-full px-4 py-3.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-8">
                <option value="">Markė...</option>
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>Audi</option>
                <option>Volkswagen</option>
                <option>Volvo</option>
                <option>Opel</option>
                <option>Toyota</option>
                <option>Honda</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="relative">
              <select class="w-full px-4 py-3.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-8">
                <option value="">Modelis...</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="relative">
              <select class="w-full px-4 py-3.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-8">
                <option value="">Generacija...</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="relative">
              <select class="w-full px-4 py-3.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all appearance-none cursor-pointer pr-8">
                <option value="">Kategorija...</option>
                <option>Variklio dalys</option>
                <option>Transmisija</option>
                <option>Stabdžiai</option>
                <option>Žibintai</option>
                <option>Kėbulo dalys</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Search button -->
          <button
            @click="search"
            class="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0 text-base"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            IEŠKOTI DALIES
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; initialQuery?: string }>()
const emit = defineEmits(['update:modelValue'])

const query = ref('')
const inputRef = ref<HTMLInputElement>()

watch(() => props.modelValue, (val) => {
  if (val) {
    query.value = props.initialQuery ?? ''
    nextTick(() => inputRef.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function search() {
  emit('update:modelValue', false)
  navigateTo({ path: '/catalog', query: query.value ? { q: query.value } : {} })
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
