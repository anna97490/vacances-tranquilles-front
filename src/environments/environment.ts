export const environment = {
  production: false,
  apiUrl: (import.meta as any).env?.URL_API || 'http://localhost:8080/api'
}; 