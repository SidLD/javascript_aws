export const auth = {
  isAuthenticated() {
    const user = this.getUserInfo()
    if (!user) return false

    const exp = user.exp
    if (!exp) return false

    const now = Math.floor(Date.now() / 1000)
    return exp > now
  },

  storeToken(token: string) {
    this.clear(false) 
    localStorage.setItem('token', token)
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getUserInfo(): any | null {
    const token = this.getToken()
    if (!token) return null
    return this.decode(token)
  },

  getExpiration(): number {
    const user = this.getUserInfo()
    return user?.exp ?? 0
  },

  getRole(): string | null {
    const user = this.getUserInfo()
    return user?.role ?? null
  },

  decode(token: string) {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) return null

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      )

      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error('Invalid token', e)
      return null
    }
  },

  clear(reload = true) {
    localStorage.removeItem('token')
    if (reload) window.location.reload()
  },
}
