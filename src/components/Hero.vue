<script setup lang="ts">
import { ArrowRightIcon, BuildingOfficeIcon, HomeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

const features = [
  {
    icon: HomeIcon,
    title: 'Immobilienvermittlung',
    description: 'Professionelle Vermittlung von Wohn- und Gewerbeimmobilien'
  },
  {
    icon: BuildingOfficeIcon,
    title: 'Firmenvermittlung',
    description: 'Spezialisiert auf Unternehmensverkäufe und Nachfolgeregelungen'
  },
  {
    icon: UserGroupIcon,
    title: 'Persönliche Betreuung',
    description: 'Individuelle Beratung von der ersten Idee bis zum Abschluss'
  }
]
</script>

<template>
  <section id="home" class="relative bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden min-h-screen flex items-center">
    <div class="absolute inset-0 bg-white/20"></div>
    
    <div class="relative mx-auto max-w-6xl px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-left" :class="{ 'animate-slide-in-left': isLoaded }">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight transform transition-all duration-1000" :class="{ 'translate-x-0 opacity-100': isLoaded, '-translate-x-10 opacity-0': !isLoaded }">
            Ihr Partner für
            <span class="text-primary-600 block animate-gradient-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text">Immobilien & Firmen</span>
          </h1>
          <p class="mt-6 text-lg text-gray-600 leading-relaxed transform transition-all duration-1000 delay-300" :class="{ 'translate-x-0 opacity-100': isLoaded, '-translate-x-10 opacity-0': !isLoaded }">
            Professionelle Vermittlung von Immobilien und Unternehmen mit umfassendem Service. 
            Von der Bewertung bis zum Notarvertrag - wir begleiten Sie durch den gesamten Prozess.
          </p>
          
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform transition-all duration-1000 delay-500" :class="{ 'translate-x-0 opacity-100': isLoaded, '-translate-x-10 opacity-0': !isLoaded }">
            <router-link to="/dienstleistungen" class="btn-primary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300 hover:shadow-lg">
              Unsere Services
              <ArrowRightIcon class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </router-link>
            <router-link to="/katalog" class="btn-secondary hover:scale-105 transition-all duration-300 hover:shadow-lg">
              Firmenkatalog ansehen
            </router-link>
          </div>
          
          <!-- Quick Features -->
          <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 transform transition-all duration-1000 delay-700" :class="{ 'translate-x-0 opacity-100': isLoaded, '-translate-x-10 opacity-0': !isLoaded }">
            <div 
              v-for="feature in features" 
              :key="feature.title"
              class="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <component :is="feature.icon" class="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
              <h3 class="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors duration-300">{{ feature.title }}</h3>
              <p class="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{{ feature.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="relative" :class="{ 'animate-slide-in-right': isLoaded }">
          <div class="grid grid-cols-2 gap-4 transform transition-all duration-1000 delay-200" :class="{ 'translate-x-0 opacity-100': isLoaded, 'translate-x-10 opacity-0': !isLoaded }">
            <div class="space-y-4 animate-float">
              <div class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                <img 
                  src="/WhatsApp Image 2025-09-01 at 21.35.38 (1).jpeg" 
                  alt="Moderne Immobilie" 
                  class="w-full h-32 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                <img 
                  src="/WhatsApp Image 2025-09-01 at 21.33.23.jpeg" 
                  alt="Geschäftsgebäude" 
                  class="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
            <div class="space-y-4 mt-8 animate-float-delayed">
              <div class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                <img 
                  src="/WhatsApp Image 2025-09-01 at 21.28.14.jpeg" 
                  alt="Beratungsgespräch" 
                  class="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                <img 
                  src="/WhatsApp Image 2025-09-01 at 21.35.38.jpeg" 
                  alt="Bürogebäude" 
                  class="w-full h-32 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
          
          <!-- Floating Stats -->
          <div class="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 hidden lg:block hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-bounce-slow">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600 animate-pulse">Rund um die Uhr</div>
              <div class="text-sm text-gray-600">Vermittlungen</div>
            </div>
          </div>
          
          <div class="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-4 hidden lg:block hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-bounce-slow" style="animation-delay: 1s;">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600 animate-pulse">15+</div>
              <div class="text-sm text-gray-600">Jahre Erfahrung</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes floatDelayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes gradientText {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: floatDelayed 6s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-slide-in-left {
  animation: slideInLeft 1s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 1s ease-out;
}

.animate-gradient-text {
  background-size: 200% 200%;
  animation: gradientText 3s ease infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}
</style>