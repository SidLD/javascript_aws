<template>
  <div class="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
        <button
          @click="openCreateModal"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      <div class="flex items-center justify-between mb-4">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search by name, username, country..."
          @input="onSearch"
          class="w-64 px-2 py-1 text-sm border rounded"
        />
        <div class="flex items-center gap-2">
          <label for="pageSize" class="text-sm text-gray-700">Rows per page:</label>
          <select id="pageSize" v-model.number="pageSize" class="px-2 py-1 text-sm border rounded">
            <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="py-8 text-center">
        <div class="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p class="mt-2 text-gray-600">Loading records...</p>
      </div>

      <div v-else-if="error" class="px-4 py-3 mb-6 text-red-700 border border-red-200 rounded bg-red-50">
        {{ error }}
      </div>

      <div v-else-if="recordStore.records.length === 0" class="py-12 text-center">
        <p class="text-lg text-gray-500">No records found</p>
        <button
          @click="openCreateModal"
          class="px-6 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create your first record
        </button>
      </div>

      <div v-else class="overflow-auto bg-white shadow sm:rounded-md max-h-[70vh]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Photo</th>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Username</th>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Country</th>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Account Type</th>
              <th class="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in recordStore.records" :key="record.id">
              <td class="px-4 py-2 whitespace-nowrap">
                <img v-if="record.photo" :src="record.photo" :alt="record.name" class="object-cover w-10 h-10 rounded-lg" />
                <div v-else class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg">
                  <span class="text-xs text-gray-400">No Image</span>
                </div>
              </td>
              <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ record.name }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ record.username }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ record.country }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ record.email }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ record.accountType }}</td>
              <td class="flex gap-2 px-4 py-2 text-sm text-gray-700">
                <button
                  class="p-1 text-orange-600 rounded hover:bg-orange-100"
                  @click="openUpdateModal(record)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-7l7 7-7-7z" />
                  </svg>
                </button>
                <button
                  class="p-1 text-red-600 rounded hover:bg-red-100"
                  @click="handleDelete(record._id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex items-center justify-between px-6 py-3 bg-gray-50">
          <button class="px-3 py-1 text-sm border rounded disabled:opacity-50" :disabled="page === 1" @click="changePage(page - 1)">
            Previous
          </button>
          <div class="text-sm text-gray-600">Page {{ page }} of {{ totalPages }}</div>
          <button class="px-3 py-1 text-sm border rounded disabled:opacity-50" :disabled="page === totalPages" @click="changePage(page + 1)">
            Next
          </button>
        </div>
      </div>
    </div>

    <RecordModal v-if="showModal" @close="closeModal" @refetch="fetchEmployees" @save="handleSave" :record="selectedRecord" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRecordStore } from '@/stores/records'
import { createEmployee, deleteEmployee , updateEmployee} from '@/api'
import RecordModal from '@/components/RecordModal.vue'
import { IEmployee } from '@/types/employee.type'

function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const recordStore = useRecordStore()
const showModal = ref(false)
const selectedRecord = ref<IEmployee | null>(null)
const page = ref(1)
const pageSizeOptions = [5, 10, 20, 50]
const pageSize = ref(10)
const searchTerm = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const totalPages = ref(1)

const fetchEmployees = async () => {
  loading.value = true
  error.value = null
  try {
    await recordStore.fetchRecords(page.value, pageSize.value, searchTerm.value)
    totalPages.value = recordStore.totalPages
  } catch (err: any) {
    error.value = 'Failed to load employees'
  } finally {
    loading.value = false
  }
}

const changePage = (newPage: number) => {
  page.value = newPage
  fetchEmployees()
}

const onSearch = debounce(() => {
  page.value = 1
  fetchEmployees()
}, 300)

const openCreateModal = () => {
  selectedRecord.value = null
  showModal.value = true
}

const openUpdateModal = (record: any) => {
  selectedRecord.value = {...record}
  showModal.value = true
}

const closeModal = () => {
  selectedRecord.value = null
  showModal.value = false
}


const handleSave = async (recordData: any) => {
  loading.value = true
  error.value = null
  try {
    if (selectedRecord.value?._id) {
      await updateEmployee(selectedRecord.value._id, recordData)
      console.log(`Employee ${selectedRecord.value._id} updated successfully`)
    } else {
      await createEmployee(recordData)
    }
    await fetchEmployees()
  } catch (err: any) {
    error.value = 'Failed to save employee'
  } finally {
    loading.value = false
    closeModal()
  }
}


const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this employee?')) return
  loading.value = true
  error.value = null
  try {
    deleteEmployee(id).then(async(data) => {
      page.value = 1;
      await fetchEmployees()
    })
  } catch (err: any) {
    error.value = 'Failed to delete employee'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEmployees()
})

watch(pageSize, () => {
  page.value = 1
  fetchEmployees()
})
</script>
