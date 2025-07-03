export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP Error: ${response.status}`)
  }
  return response
}

export const api = {
  extensions: {
    async getAll() {
      const response = await fetch('/api/extensions')
      await handleApiError(response)
      return response.json()
    },

    async updateFixed(data: { name: string; blocked: boolean }) {
      const response = await fetch('/api/extensions/fixed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await handleApiError(response)
      return response.json()
    },

    async createCustom(data: { name: string }) {
      const response = await fetch('/api/extensions/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await handleApiError(response)
      return response.json()
    },

    async deleteCustom(data: { name: string }) {
      const response = await fetch('/api/extensions/custom', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await handleApiError(response)
      return response.json()
    },
  },

  health: {
    async check() {
      const response = await fetch('/api/health')
      await handleApiError(response)
      return response.json()
    },
  },
}
