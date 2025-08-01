// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const endpoints = {
  students: {
    base: `${API_URL}/api/students`,
    byId: (id: string) => `${API_URL}/api/students/${id}`,
  },
  teachers: {
    base: `${API_URL}/api/teachers`,
    byId: (id: string) => `${API_URL}/api/teachers/${id}`,
  },
  appointments: {
    base: `${API_URL}/api/appointments`,
    byId: (id: string) => `${API_URL}/api/appointments/${id}`,
  },
  exercises: {
    electionPercentages: `${API_URL}/api/exercises/election-percentages`,
    bubbleSort: `${API_URL}/api/exercises/bubble-sort`,
  },
};

