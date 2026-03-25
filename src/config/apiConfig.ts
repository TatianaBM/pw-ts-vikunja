import { API_URL } from 'config/env'

export const apiConfig = {
  baseUrl:
    // Guarantee type safety for API_URL in case it is undefined
    API_URL ||
    (() => {
      throw new Error('API_URL is required')
    })(),
  endpoints: {
    login: '/login',
    register: '/register',
    newProject: 'projects',
    projectById: (id: string) => `projects/${id}`,
  },
}
