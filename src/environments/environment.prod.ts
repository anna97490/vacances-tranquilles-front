export const environment = {
  production: true,
  apiUrl: (import.meta as any).env?.URL_API || 'https://votre-api-production.com/api'
}; 
