<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Immobilien & Unternehmen Katalog</h1>
          <p class="text-xl text-blue-100">Entdecken Sie unsere Auswahl an Immobilien und Unternehmen</p>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
            <select 
              v-model="selectedCategory" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle anzeigen</option>
              <option value="properties">Nur Immobilien</option>
              <option value="companies">Nur Unternehmen</option>
            </select>
          </div>
          <div class="flex-1 min-w-64">
            <label class="block text-sm font-medium text-gray-700 mb-2">Suche</label>
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="Nach Titel oder Standort suchen..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Lade Katalog...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-gray-600">{{ error }}</p>
        <button 
          @click="loadData" 
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ properties.length }}</p>
                <p class="text-gray-600">Immobilien</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ companies.length }}</p>
                <p class="text-gray-600">Unternehmen</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ filteredItems.length }}</p>
                <p class="text-gray-600">Gefilterte Ergebnisse</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredItems.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Keine Ergebnisse gefunden</h3>
          <p class="text-gray-600">Versuchen Sie andere Suchbegriffe oder Filter.</p>
        </div>

        <!-- Items Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Properties -->
          <div 
            v-for="property in filteredProperties" 
            :key="`property-${property.id}`"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="openPropertyModal(property)"
          >
            <div class="relative h-48 bg-gray-200">
              <img 
                v-if="property.images && property.images.length > 0"
                :src="property.images[0]" 
                :alt="property.title"
                class="w-full h-full object-cover"
              >
              <div v-else class="flex items-center justify-center h-full text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                Immobilie
              </div>
              <div v-if="property.images && property.images.length > 1" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {{ property.images.length }} Bilder
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ property.title }}</h3>
              <p class="text-gray-600 mb-2">{{ property.type }}</p>
              <p class="text-gray-600 mb-4">📍 {{ property.location }}</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-blue-600">€{{ property.price }}</span>
                <span class="text-gray-600">{{ property.size }}m²</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>🛏️ {{ property.rooms }} Zimmer</span>
                <span v-if="property.details?.yearBuilt">🏗️ {{ property.details.yearBuilt }}</span>
              </div>
            </div>
          </div>

          <!-- Companies -->
          <div 
            v-for="company in filteredCompanies" 
            :key="`company-${company.id}`"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="openCompanyModal(company)"
          >
            <div class="relative h-48 bg-gray-200">
              <img 
                v-if="company.images && company.images.length > 0"
                :src="company.images[0]" 
                :alt="company.name"
                class="w-full h-full object-cover"
              >
              <div v-else class="flex items-center justify-center h-full text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                Unternehmen
              </div>
              <div v-if="company.images && company.images.length > 1" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {{ company.images.length }} Bilder
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ company.name }}</h3>
              <p class="text-gray-600 mb-2">{{ company.industry }}</p>
              <p class="text-gray-600 mb-4">📍 {{ company.location }}</p>
              <p class="text-gray-700 mb-4 line-clamp-3">{{ company.description }}</p>
              <div class="flex justify-between text-sm text-gray-600">
                <span v-if="company.employees">👥 {{ company.employees }} Mitarbeiter</span>
                <span v-if="company.founded">🏢 Gegründet {{ company.founded }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Property Detail Modal -->
    <div 
      v-if="selectedProperty" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Image Gallery -->
        <div class="relative h-80">
          <div v-if="selectedProperty.images && selectedProperty.images.length > 0" class="relative h-full">
            <img 
              :src="selectedProperty.images[currentImageIndex]" 
              :alt="selectedProperty.title"
              class="w-full h-full object-cover"
            />
            <!-- Navigation arrows -->
            <button 
              v-if="selectedProperty.images.length > 1"
              @click="previousImage"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="selectedProperty.images.length > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <!-- Image counter -->
            <div v-if="selectedProperty.images.length > 1" class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {{ currentImageIndex + 1 }} / {{ selectedProperty.images.length }}
            </div>
          </div>
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-8">
          <div class="mb-6">
            <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
              {{ selectedProperty.type }}
            </span>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ selectedProperty.title }}</h2>
            <p class="text-gray-600 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ selectedProperty.location }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Details</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Preis:</span>
                  <span class="font-semibold text-blue-600 text-xl">€{{ selectedProperty.price }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Größe:</span>
                  <span class="font-medium">{{ selectedProperty.size }}m²</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Zimmer:</span>
                  <span class="font-medium">{{ selectedProperty.rooms }}</span>
                </div>
                <div v-if="selectedProperty.details?.yearBuilt" class="flex justify-between">
                  <span class="text-gray-600">Baujahr:</span>
                  <span class="font-medium">{{ selectedProperty.details.yearBuilt }}</span>
                </div>
                <div v-if="selectedProperty.details?.condition" class="flex justify-between">
                  <span class="text-gray-600">Zustand:</span>
                  <span class="font-medium">{{ selectedProperty.details.condition }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Ausstattung</h3>
              <div class="space-y-2">
                <div v-for="feature in selectedProperty.features" :key="feature" class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Beschreibung</h3>
            <p class="text-gray-700 leading-relaxed">{{ selectedProperty.description }}</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="showContactForm = true"
              class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Interesse bekunden
            </button>
            <a 
              :href="`tel:${selectedProperty.contact.phone}`"
              class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              Anrufen
            </a>
            <a 
              :href="`mailto:${selectedProperty.contact.email}?subject=Interesse an ${selectedProperty.title}`"
              class="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
            >
              E-Mail senden
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Detail Modal -->
    <div 
      v-if="selectedCompany" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Image Gallery -->
        <div class="relative h-80">
          <div v-if="selectedCompany.images && selectedCompany.images.length > 0" class="relative h-full">
            <img 
              :src="selectedCompany.images[currentImageIndex]" 
              :alt="selectedCompany.name"
              class="w-full h-full object-cover"
            />
            <!-- Navigation arrows -->
            <button 
              v-if="selectedCompany.images.length > 1"
              @click="previousImage"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="selectedCompany.images.length > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <!-- Image counter -->
            <div v-if="selectedCompany.images.length > 1" class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {{ currentImageIndex + 1 }} / {{ selectedCompany.images.length }}
            </div>
          </div>
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-8">
          <div class="mb-6">
            <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
              {{ selectedCompany.industry }}
            </span>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ selectedCompany.name }}</h2>
            <p class="text-gray-600 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ selectedCompany.location }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Unternehmensdaten</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Mitarbeiter:</span>
                  <span class="font-medium">{{ selectedCompany.employees }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gegründet:</span>
                  <span class="font-medium">{{ selectedCompany.founded }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Umsatz:</span>
                  <span class="font-medium">€{{ selectedCompany.revenue }}</span>
                </div>
                <div v-if="selectedCompany.details?.legalForm" class="flex justify-between">
                  <span class="text-gray-600">Rechtsform:</span>
                  <span class="font-medium">{{ selectedCompany.details.legalForm }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Highlights</h3>
              <div class="space-y-2">
                <div v-for="highlight in selectedCompany.highlights" :key="highlight" class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-700">{{ highlight }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Beschreibung</h3>
            <p class="text-gray-700 leading-relaxed">{{ selectedCompany.description }}</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="showContactForm = true"
              class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Interesse bekunden
            </button>
            <a 
              :href="`tel:${selectedCompany.contact.phone}`"
              class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
            >
              Anrufen
            </a>
            <a 
              :href="`mailto:${selectedCompany.contact.email}?subject=Interesse an ${selectedCompany.name}`"
              class="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
            >
              E-Mail senden
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form Modal -->
    <div 
      v-if="showContactForm" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"
      @click="showContactForm = false"
    >
      <div 
        class="bg-white rounded-lg max-w-md w-full p-6"
        @click.stop
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Interesse bekunden</h3>
          <button 
            @click="showContactForm = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitContactForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input 
              v-model="contactForm.name"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ihr Name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
            <input 
              v-model="contactForm.email"
              type="email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ihre.email@beispiel.de"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input 
              v-model="contactForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ihre Telefonnummer"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nachricht</label>
            <textarea 
              v-model="contactForm.message"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="`Ich interessiere mich für ${selectedProperty?.title || selectedCompany?.name}`"
            ></textarea>
          </div>
          
          <div class="flex gap-3">
            <button 
              type="button"
              @click="showContactForm = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProperties, useCompanies } from '../composables/useData'

const { properties, loading: propertiesLoading, error: propertiesError } = useProperties()
const { companies, loading: companiesLoading, error: companiesError } = useCompanies()

const loading = computed(() => propertiesLoading.value || companiesLoading.value)
const error = computed(() => propertiesError.value || companiesError.value)

const selectedCategory = ref('all')
const searchTerm = ref('')
const selectedProperty = ref(null)
const selectedCompany = ref(null)
const currentImageIndex = ref(0)
const showContactForm = ref(false)

const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const filteredProperties = computed(() => {
  if (selectedCategory.value === 'companies') return []
  
  return properties.value.filter(property => {
    const matchesSearch = !searchTerm.value || 
      property.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    return matchesSearch
  })
})

const filteredCompanies = computed(() => {
  if (selectedCategory.value === 'properties') return []
  
  return companies.value.filter(company => {
    const matchesSearch = !searchTerm.value || 
      company.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    return matchesSearch
  })
})

const filteredItems = computed(() => {
  return [...filteredProperties.value, ...filteredCompanies.value]
})

const openPropertyModal = (property) => {
  selectedProperty.value = property
  currentImageIndex.value = 0
}

const openCompanyModal = (company) => {
  selectedCompany.value = company
  currentImageIndex.value = 0
}

const closeModal = () => {
  selectedProperty.value = null
  selectedCompany.value = null
  showContactForm.value = false
  currentImageIndex.value = 0
}

const nextImage = () => {
  const images = selectedProperty.value?.images || selectedCompany.value?.images || []
  if (images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }
}

const previousImage = () => {
  const images = selectedProperty.value?.images || selectedCompany.value?.images || []
  if (images.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0 ? images.length - 1 : currentImageIndex.value - 1
  }
}

const submitContactForm = () => {
  const subject = selectedProperty.value 
    ? `Interesse an ${selectedProperty.value.title}`
    : `Interesse an ${selectedCompany.value?.name}`
  
  console.log('Contact form submitted:', {
    ...contactForm.value,
    subject,
    item: selectedProperty.value || selectedCompany.value
  })
  
  alert('Vielen Dank für Ihr Interesse! Wir melden uns bald bei Ihnen.')
  
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }
  showContactForm.value = false
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (event) => {
    if (selectedProperty.value || selectedCompany.value) {
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowLeft') {
        previousImage()
      } else if (event.key === 'ArrowRight') {
        nextImage()
      }
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.z-60 {
  z-index: 60;
}
</style>