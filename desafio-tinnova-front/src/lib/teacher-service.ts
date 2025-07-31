import { endpoints } from './api-config';
import { Teacher } from './types';
import { ApiClient } from './api-client';

// Mapear do formato do backend para o formato do frontend
const mapTeacherFromBackend = (data: any): Teacher => {
  const fullName = data.name ? data.name.split(' ') : ['', ''];
  
  return {
    id: data.id.toString(),
    firstName: fullName[0],
    lastName: fullName.slice(1).join(' '),
    cpf: data.cpf,
    dob: data.birthDate,
    specialty: data.speciality,
    status: data.status?.toLowerCase() === 'active' ? 'active' : 'inactive',
    hireDate: data.createdAt,
  };
};

// Mapear do formato do frontend para o formato do backend
const mapTeacherToBackend = (teacher: Teacher): any => {
  return {
    id: teacher.id !== 'new' ? teacher.id : undefined,
    name: `${teacher.firstName} ${teacher.lastName}`.trim(),
    cpf: teacher.cpf,
    birthDate: teacher.dob,
    speciality: teacher.specialty,
    status: teacher.status.toUpperCase(),
  };
};

export const teacherService = {
  async getAll(): Promise<Teacher[]> {
    try {
      const data = await ApiClient.get<any[]>(endpoints.teachers.base);
      return data.map(mapTeacherFromBackend);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Teacher> {
    try {
      const data = await ApiClient.get<any>(endpoints.teachers.byId(id));
      return mapTeacherFromBackend(data);
    } catch (error) {
      console.error(`Error fetching teacher with ID ${id}:`, error);
      throw error;
    }
  },

  async create(teacher: Teacher): Promise<Teacher> {
    try {
      const data = await ApiClient.post<any>(
        `${endpoints.teachers.base}`,
        mapTeacherToBackend(teacher)
      );
      return mapTeacherFromBackend(data);
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  },

  async update(id: string, teacher: Teacher): Promise<Teacher> {
    try {
      const data = await ApiClient.put<any>(
        endpoints.teachers.byId(id),
        mapTeacherToBackend(teacher)
      );
      return mapTeacherFromBackend(data);
    } catch (error) {
      console.error(`Error updating teacher with ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await ApiClient.delete(endpoints.teachers.byId(id));
    } catch (error) {
      console.error(`Error deleting teacher with ID ${id}:`, error);
      throw error;
    }
  },
};
