import { defineStore } from 'pinia'
import { getEmployees } from '@/api'

export const useRecordStore = defineStore('records', {
  state: () => ({
    records: [] as any[],
    totalPages: 1,
    loading: false,
    error: '' as string | null,
  }),
  actions: {
    async fetchRecords(page, pageSize, searchTerm) {
      this.loading = true
      this.error = null
      try {
        const res = await getEmployees(page, pageSize)
        const term = searchTerm.toLowerCase().trim()
        this.records = term
          ? res.data.filter(
              (r: any) =>
                r.name.toLowerCase().includes(term) ||
                r.username.toLowerCase().includes(term) ||
                r.country.toLowerCase().includes(term) ||
                r.email.toLowerCase().includes(term) ||
                r.accountType.toLowerCase().includes(term),
            )
          : res.data
        this.totalPages = res.pagination.pages
      } catch (err) {
        this.error = 'Failed to load employees'
      } finally {
        this.loading = false
      }
    }
  },
})
