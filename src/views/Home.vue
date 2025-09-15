<script setup lang="ts">
import Hero from '../components/Hero.vue'
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const cardRefs = ref([])

onMounted(() => {
  // Trigger animations after component mount
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    },
    { threshold: 0.1 }
  )
  
  // Observe all animated elements
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<template>
  <div>
    <Hero />
    
    <!-- Quick Overview Section -->
    <section class="py-12 bg-white overflow-hidden">
      <div class="mx-auto max-w-6xl px-4">
        <div class="text-center mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up">
            Willkommen bei ImmobilienMakler
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Ihr vertrauensvoller Partner für professionelle Immobilienvermittlung und umfassende Beratung 
            in München und Umgebung. Wir begleiten Sie von der ersten Idee bis zum erfolgreichen Abschluss.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-on-scroll opacity-0">
          <router-link 
            to="/dienstleistungen" 
            class="card p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl animate-fade-in-up animation-delay-300 cursor-pointer transform-gpu"
          >
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
              <svg class="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">Dienstleistungen</h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">Umfassende Services von der Bewertung bis zum Notarvertrag</p>
            <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </router-link>
          
          <router-link 
            to="/katalog" 
            class="card p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl animate-fade-in-up animation-delay-500 cursor-pointer transform-gpu"
          >
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
              <svg class="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">Firmenkatalog</h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">Aktuelle Gewerbeimmobilien und Firmenstandorte</p>
            <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </router-link>
          
          <router-link 
            to="/kontakt" 
            class="card p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl animate-fade-in-up animation-delay-700 cursor-pointer transform-gpu"
          >
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
              <svg class="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">Kontakt</h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">Kostenlose Beratung und persönliche Betreuung</p>
            <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div class="w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Card hover effects */
.card {
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.card:hover::before {
  left: 100%;
}
</style>