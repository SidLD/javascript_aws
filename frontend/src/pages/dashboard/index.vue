<template>
  <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="float-right">
      <button class="text-red-500 btn-secondary" v-on:click="handleLogout">Logout</button>
    </div>
    <div>
      <h1 class="mb-2 text-3xl font-bold text-gray-900">
        Welcome back, {{ auth.getUserInfo().username }}!
      </h1>
      <p class="text-gray-600">Manage your records and track your employee</p>
    </div>
    <Card>
      <CardHeader> </CardHeader>
      <CardContent>
        <Records />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import { auth } from '@/lib/auth'
  import Records from '@/components/Records.vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()

  const handleLogout = () => {
    auth.clear()
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
</script>
