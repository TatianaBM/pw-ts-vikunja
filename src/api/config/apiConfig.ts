import { API_URL } from './env'

export const apiConfig = {
  baseUrl: API_URL,
  endpoints: {
    login: '/login',
    register: '/register',
    newProject: 'projects',
    projectById: (id: string) => `projects/${id}`,
  },
}
