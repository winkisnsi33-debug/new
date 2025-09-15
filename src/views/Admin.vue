<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p class="text-gray-600 mt-2">Melden Sie sich an, um das Admin-Portal zu nutzen</p>
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Benutzername</label>
            <input 
              v-model="loginForm.username"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
            <input 
              v-model="loginForm.password"
              type="password" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password"
            />
          </div>
          
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ isLoading ? 'Anmelden...' : 'Anmelden' }}
          </button>
          
          <div v-if="loginError" class="text-red-600 text-sm text-center">
            {{ loginError }}
          </div>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="min-h-screen">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">Willkommen, Admin</span>
              <button 
                @click="logout"
                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8">
            <button 
              @click="activeTab = 'properties'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'properties' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Immobilien ({{ properties.length }})
            </button>
            <button 
              @click="activeTab = 'companies'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'companies' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Unternehmen ({{ companies.length }})
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Properties Tab -->
        <div v-if="activeTab === 'properties'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Immobilien verwalten</h2>
            <button 
              @click="openPropertyForm()"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Neue Immobilie hinzufügen
            </button>
          </div>

          <!-- Properties List -->
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li v-for="property in properties" :key="property.id" class="px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0 h-16 w-16">
                      <img 
                        v-if="property.images && property.images.length > 0"
                        :src="property.images[0]" 
                        :alt="property.title"
                        class="h-16 w-16 rounded-lg object-cover"
                      />
                      <div v-else class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ property.title }}</h3>
                      <p class="text-sm text-gray-500">{{ property.type }} • {{ property.location }}</p>
                      <p class="text-sm font-medium text-blue-600">€{{ property.price }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="openPropertyForm(property)"
                      class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button 
                      @click="deleteProperty(property.id)"
                      class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Companies Tab -->
        <div v-if="activeTab === 'companies'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Unternehmen verwalten</h2>
            <button 
              @click="openCompanyForm()"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Neues Unternehmen hinzufügen
            </button>
          </div>

          <!-- Companies List -->
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li v-for="company in companies" :key="company.id" class="px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0 h-16 w-16">
                      <img 
                        v-if="company.images && company.images.length > 0"
                        :src="company.images[0]" 
                        :alt="company.name"
                        class="h-16 w-16 rounded-lg object-cover"
                      />
                      <div v-else class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ company.name }}</h3>
                      <p class="text-sm text-gray-500">{{ company.industry }} • {{ company.location }}</p>
                      <p class="text-sm font-medium text-green-600">{{ company.employees }} Mitarbeiter</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="openCompanyForm(company)"
                      class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button 
                      @click="deleteCompany(company.id)"
                      class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>

    <!-- Property Form Modal -->
    <div 
      v-if="showPropertyForm" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      @click="closePropertyForm"
    >
      <div 
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingProperty ? 'Immobilie bearbeiten' : 'Neue Immobilie hinzufügen' }}
          </h3>
          <button 
            @click="closePropertyForm"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveProperty" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
              <input 
                v-model="propertyForm.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Typ *</label>
              <select 
                v-model="propertyForm.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Typ auswählen</option>
                <option value="Eigentumswohnung">Eigentumswohnung</option>
                <option value="Einfamilienhaus">Einfamilienhaus</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Gewerbeimmobilie">Gewerbeimmobilie</option>
                <option value="Altbauwohnung">Altbauwohnung</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Standort *</label>
              <input 
                v-model="propertyForm.location"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preis (€) *</label>
              <input 
                v-model="propertyForm.price"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Größe (m²) *</label>
              <input 
                v-model="propertyForm.size"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Zimmer *</label>
              <input 
                v-model="propertyForm.rooms"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Beschreibung *</label>
            <textarea 
              v-model="propertyForm.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <!-- Image Management -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bilder</label>
            <MultiImageUpload v-model="propertyForm.images" />
            
            <!-- Main Image Selection -->
            <div v-if="propertyForm.images.length > 1" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Hauptbild auswählen</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="(image, index) in propertyForm.images" 
                  :key="index"
                  class="relative cursor-pointer"
                  @click="setMainImage(index, 'property')"
                >
                  <img 
                    :src="image" 
                    :alt="`Bild ${index + 1}`"
                    class="w-full h-24 object-cover rounded-lg border-2"
                    :class="index === 0 ? 'border-blue-500' : 'border-gray-200'"
                  />
                  <div v-if="index === 0" class="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Hauptbild
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Features -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ausstattung</label>
            <div class="space-y-2">
              <div v-for="(feature, index) in propertyForm.features" :key="index" class="flex items-center space-x-2">
                <input 
                  v-model="propertyForm.features[index]"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ausstattungsmerkmal"
                />
                <button 
                  type="button"
                  @click="removeFeature(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button 
                type="button"
                @click="addFeature"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Ausstattung hinzufügen
              </button>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kontakt E-Mail</label>
              <input 
                v-model="propertyForm.contact.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kontakt Telefon</label>
              <input 
                v-model="propertyForm.contact.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button"
              @click="closePropertyForm"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button 
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ isLoading ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Company Form Modal -->
    <div 
      v-if="showCompanyForm" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      @click="closeCompanyForm"
    >
      <div 
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingCompany ? 'Unternehmen bearbeiten' : 'Neues Unternehmen hinzufügen' }}
          </h3>
          <button 
            @click="closeCompanyForm"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveCompany" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Firmenname *</label>
              <input 
                v-model="companyForm.name"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Branche *</label>
              <input 
                v-model="companyForm.industry"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Standort *</label>
              <input 
                v-model="companyForm.location"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mitarbeiter *</label>
              <input 
                v-model="companyForm.employees"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gegründet *</label>
              <input 
                v-model="companyForm.founded"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Umsatz *</label>
              <input 
                v-model="companyForm.revenue"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Beschreibung *</label>
            <textarea 
              v-model="companyForm.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          
          <!-- Image Management -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bilder</label>
            <MultiImageUpload v-model="companyForm.images" />
            
            <!-- Main Image Selection -->
            <div v-if="companyForm.images.length > 1" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Hauptbild auswählen</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="(image, index) in companyForm.images" 
                  :key="index"
                  class="relative cursor-pointer"
                  @click="setMainImage(index, 'company')"
                >
                  <img 
                    :src="image" 
                    :alt="`Bild ${index + 1}`"
                    class="w-full h-24 object-cover rounded-lg border-2"
                    :class="index === 0 ? 'border-green-500' : 'border-gray-200'"
                  />
                  <div v-if="index === 0" class="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Hauptbild
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Highlights -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
            <div class="space-y-2">
              <div v-for="(highlight, index) in companyForm.highlights" :key="index" class="flex items-center space-x-2">
                <input 
                  v-model="companyForm.highlights[index]"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Highlight"
                />
                <button 
                  type="button"
                  @click="removeHighlight(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button 
                type="button"
                @click="addHighlight"
                class="text-green-600 hover:text-green-800 text-sm"
              >
                + Highlight hinzufügen
              </button>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kontakt E-Mail</label>
              <input 
                v-model="companyForm.contact.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kontakt Telefon</label>
              <input 
                v-model="companyForm.contact.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button"
              @click="closeCompanyForm"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button 
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {{ isLoading ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from '../services/auth'
import { useProperties, useCompanies } from '../composables/useData'
import MultiImageUpload from '../components/MultiImageUpload.vue'

// Authentication
const isAuthenticated = ref(false)
const isLoading = ref(false)
const loginError = ref('')
const loginForm = ref({
  username: '',
  password: ''
})

// Data
const { properties, addProperty, updateProperty, deleteProperty: deletePropertyData } = useProperties()
const { companies, addCompany, updateCompany, deleteCompany: deleteCompanyData } = useCompanies()

// UI State
const activeTab = ref('properties')
const showPropertyForm = ref(false)
const showCompanyForm = ref(false)
const editingProperty = ref(null)
const editingCompany = ref(null)

// Forms
const propertyForm = ref({
  title: '',
  type: '',
  location: '',
  price: '',
  size: '',
  rooms: '',
  images: [],
  description: '',
  features: [''],
  contact: {
    email: 'info@immobilienmakler.de',
    phone: '+49 89 123 456'
  },
  details: {}
})

const companyForm = ref({
  name: '',
  industry: '',
  location: '',
  employees: '',
  founded: '',
  revenue: '',
  images: [],
  description: '',
  highlights: [''],
  contact: {
    email: 'info@immobilienmakler.de',
    phone: '+49 89 123 456'
  },
  details: {}
})

// Authentication Methods
const login = async () => {
  isLoading.value = true
  loginError.value = ''
  
  try {
    await authService.login(loginForm.value)
    isAuthenticated.value = true
  } catch (error) {
    loginError.value = error.message || 'Login fehlgeschlagen'
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  authService.logout()
  isAuthenticated.value = false
  loginForm.value = { username: '', password: '' }
}

const checkAuth = async () => {
  const isValid = await authService.verifyToken()
  isAuthenticated.value = isValid
}

// Property Methods
const openPropertyForm = (property = null) => {
  editingProperty.value = property
  if (property) {
    propertyForm.value = {
      ...property,
      features: [...property.features],
      contact: { ...property.contact },
      details: { ...property.details }
    }
  } else {
    resetPropertyForm()
  }
  showPropertyForm.value = true
}

const closePropertyForm = () => {
  showPropertyForm.value = false
  editingProperty.value = null
  resetPropertyForm()
}

const resetPropertyForm = () => {
  propertyForm.value = {
    title: '',
    type: '',
    location: '',
    price: '',
    size: '',
    rooms: '',
    images: [],
    description: '',
    features: [''],
    contact: {
      email: 'info@immobilienmakler.de',
      phone: '+49 89 123 456'
    },
    details: {}
  }
}

const saveProperty = async () => {
  isLoading.value = true
  
  try {
    // Filter out empty features
    const cleanedFeatures = propertyForm.value.features.filter(f => f.trim() !== '')
    const propertyData = {
      ...propertyForm.value,
      features: cleanedFeatures
    }
    
    if (editingProperty.value) {
      await updateProperty(editingProperty.value.id, propertyData)
    } else {
      await addProperty(propertyData)
    }
    
    closePropertyForm()
  } catch (error) {
    alert('Fehler beim Speichern: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const deleteProperty = async (id) => {
  if (confirm('Sind Sie sicher, dass Sie diese Immobilie löschen möchten?')) {
    try {
      await deletePropertyData(id)
    } catch (error) {
      alert('Fehler beim Löschen: ' + error.message)
    }
  }
}

// Company Methods
const openCompanyForm = (company = null) => {
  editingCompany.value = company
  if (company) {
    companyForm.value = {
      ...company,
      highlights: [...company.highlights],
      contact: { ...company.contact },
      details: { ...company.details }
    }
  } else {
    resetCompanyForm()
  }
  showCompanyForm.value = true
}

const closeCompanyForm = () => {
  showCompanyForm.value = false
  editingCompany.value = null
  resetCompanyForm()
}

const resetCompanyForm = () => {
  companyForm.value = {
    name: '',
    industry: '',
    location: '',
    employees: '',
    founded: '',
    revenue: '',
    images: [],
    description: '',
    highlights: [''],
    contact: {
      email: 'info@immobilienmakler.de',
      phone: '+49 89 123 456'
    },
    details: {}
  }
}

const saveCompany = async () => {
  isLoading.value = true
  
  try {
    // Filter out empty highlights
    const cleanedHighlights = companyForm.value.highlights.filter(h => h.trim() !== '')
    const companyData = {
      ...companyForm.value,
      highlights: cleanedHighlights
    }
    
    if (editingCompany.value) {
      await updateCompany(editingCompany.value.id, companyData)
    } else {
      await addCompany(companyData)
    }
    
    closeCompanyForm()
  } catch (error) {
    alert('Fehler beim Speichern: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const deleteCompany = async (id) => {
  if (confirm('Sind Sie sicher, dass Sie dieses Unternehmen löschen möchten?')) {
    try {
      await deleteCompanyData(id)
    } catch (error) {
      alert('Fehler beim Löschen: ' + error.message)
    }
  }
}

// Helper Methods
const addFeature = () => {
  propertyForm.value.features.push('')
}

const removeFeature = (index) => {
  propertyForm.value.features.splice(index, 1)
}

const addHighlight = () => {
  companyForm.value.highlights.push('')
}

const removeHighlight = (index) => {
  companyForm.value.highlights.splice(index, 1)
}

const setMainImage = (index, type) => {
  if (type === 'property') {
    const images = [...propertyForm.value.images]
    const mainImage = images.splice(index, 1)[0]
    propertyForm.value.images = [mainImage, ...images]
  } else if (type === 'company') {
    const images = [...companyForm.value.images]
    const mainImage = images.splice(index, 1)[0]
    companyForm.value.images = [mainImage, ...images]
  }
}

// Lifecycle
onMounted(() => {
  checkAuth()
})
</script>