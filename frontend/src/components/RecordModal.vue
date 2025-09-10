<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-y-auto bg-gray-900 bg-opacity-50"
    @click.self="emitClose"
  >
    <div
      class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit Employee' : 'Add Employee' }}
        </h3>
        <button
          @click="emitClose"
          class="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-gray-600 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div v-if="formError" class="px-4 py-2 text-sm text-red-700 bg-red-100 rounded">
            {{ formError }}
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block mb-2 text-sm font-semibold">Country *</label>
              <select v-model="form.country" required class="input-field">
                <option value="">---</option>
                <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Account Type *</label>
              <select v-model="form.accountType" required class="input-field">
                <option value="">---</option>
                <option value="Team Member">Team Member</option>
                <option value="System Administrator">System Administrator</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Username *</label>
              <input v-model="form.username" type="text" required class="input-field" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Last Name *</label>
              <input v-model="form.lastName" type="text" required class="input-field" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">First Name *</label>
              <input v-model="form.firstName" type="text" required class="input-field" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Email *</label>
              <input v-model="form.email" type="email" required class="input-field" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Contact Number</label>
              <input v-model="form.contact" type="text" class="input-field" />
            </div>

            <div class="sm:col-span-2">
              <label class="block mb-2 text-sm font-semibold">photo</label>
              <div
                class="p-6 text-center border-2 border-dashed cursor-pointer rounded-xl hover:border-blue-400 hover:bg-blue-50"
                @click="$refs.fileInput?.click()"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleFileUpload"
                />
                <p class="text-sm text-gray-600">Click to upload</p>
              </div>
              <div v-if="form.photo" class="relative inline-block mt-4">
                <img
                  :src="form.photo"
                  alt="Preview"
                  class="object-cover w-40 h-40 border rounded-xl"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute flex items-center justify-center text-white bg-red-500 rounded-full -top-2 -right-2 w-7 h-7"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="flex justify-end p-6 space-x-3 border-t border-gray-200 bg-gray-50">
        <button type="button" @click="emitClose" class="btn-secondary">Cancel</button>
        <button type="button" @click="submitForm" class="btn-primary">
          {{ isEditing ? 'Update Employee' : 'Create Employee' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { countries, validateEmail } from '@/lib/utils'
  import { ref, computed, watch } from 'vue'

  interface Props {
    record?: any | null
  }
  const props = defineProps<Props>()
  const emit = defineEmits(['close', 'save'])

  const formError = ref<string | null>(null)

  const form = ref({
    country: '',
    accountType: '',
    username: '',
    lastName: '',
    firstName: '',
    email: '',
    contact: '',
    photo: '',
  })

  const isEditing = computed(() => !!props.record)
  const resetForm = () => {
    form.value = {
      country: '',
      accountType: '',
      username: '',
      lastName: '',
      firstName: '',
      email: '',
      contact: '',
      photo: '',
    }
  }

  watch(
    () => props.record,
    (newRecord) => {
      if (newRecord) {
        form.value = {
          country: newRecord.country || '',
          accountType: newRecord.accountType || '',
          username: newRecord.username || '',
          lastName: newRecord.name?.split(' ')?.slice(1).join(' ') || '',
          firstName: newRecord.name?.split(' ')?.[0] || '',
          email: newRecord.email || '',
          contact: newRecord.contact || '',
          photo: newRecord.photo || '',
        }
      } else {
        resetForm()
      }
    },
    { immediate: true },
  )

  const emitClose = () => {
    emit('close')
  }

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const photo = target.files?.[0]
    if (photo) {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.value.photo = e.target?.result as string
      }
      reader.readAsDataURL(photo)
    }
  }
  const removeImage = () => {
    form.value.photo = ''
  }
  const validateForm = () => {
    formError.value = null
    if (
      !form.value.country ||
      !form.value.accountType ||
      !form.value.username ||
      !form.value.firstName ||
      !form.value.lastName ||
      !form.value.email
    ) {
      formError.value = 'Please fill all required fields.'
      return false
    }
    if (!validateEmail(form.value.email)) {
      formError.value = 'Please enter a valid email.'
      return false
    }
    return true
  }

  const submitForm = () => {
    if (!validateForm()) return
    emit('save', {
      ...form.value,
    })
    resetForm()
  }
</script>
