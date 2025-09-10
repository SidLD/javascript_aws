<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">Create your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="error" class="px-4 py-3 text-red-700 border border-red-200 rounded bg-red-50">
          {{ error }}
        </div>
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"> Full Name </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Username </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? 'Creating account...' : 'Sign up' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { registerUser } from '@/api'

  const router = useRouter()

  const loading = ref(false)
  const error = ref('')
  const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleRegister = async () => {
    loading.value = true
    error.value = ''

    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match'
      loading.value = false
      return
    }

    try {
      await registerUser({
        username: form.value.name,
        email: form.value.email,
        password: form.value.password,
      })
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err?.response.data.message || 'Registration failed'
    } finally {
      loading.value = false
    }
  }
</script>
