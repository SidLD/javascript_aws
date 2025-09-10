<template>
  <div class="relative overflow-hidden">
    <div class="bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div class="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            <span class="block">Modern</span>
            <span class="block text-blue-600">Vue Record App</span>
          </h1>
          <p class="max-w-2xl mx-auto mt-6 text-xl leading-relaxed text-gray-600">
            Vue Node MongoDB CRUD APP with JWT authentication
          </p>
          <div class="flex flex-col justify-center gap-4 mt-10 sm:flex-row">
            <router-link
              v-if="false"
              to="/login"
              class="px-8 py-4 text-lg font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </router-link>
            <router-link
              v-else
              to="/dashboard"
              class="px-8 py-4 text-lg font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
