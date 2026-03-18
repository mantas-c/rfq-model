export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() { return {} },
    mounted(el, binding) {
      const opts = typeof binding.value === 'object' ? binding.value : {}
      const delay: number = opts.delay ?? 0
      const dir: string = opts.dir ?? 'up'
      const distance = opts.distance ?? 36

      el.style.opacity = '0'
      el.style.transition = `opacity 0.55s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.55s cubic-bezier(.4,0,.2,1) ${delay}ms`

      if (dir === 'up')    el.style.transform = `translateY(${distance}px)`
      if (dir === 'down')  el.style.transform = `translateY(-${distance}px)`
      if (dir === 'left')  el.style.transform = `translateX(${distance}px)`
      if (dir === 'right') el.style.transform = `translateX(-${distance}px)`
      if (dir === 'scale') { el.style.transform = 'scale(0.92)'; el.style.opacity = '0' }

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translate(0) scale(1)'
          observer.disconnect()
        }
      }, { threshold: 0.12 })

      observer.observe(el)
    },
  })
})
