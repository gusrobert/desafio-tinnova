import { endpoints } from './api-config';
import { Student } from './types';
import { ApiClient } from './api-client';

// Mapear do formato do backend para o formato do frontend
const mapStudentFromBackend = (data: any): Student => {
  const fullName = data.name ? data.name.split(' ') : ['', ''];
  
  return {
    id: data.id.toString(),
    firstName: fullName[0],
    lastName: fullName.slice(1).join(' '),
    cpf: data.cpf,
    dob: data.birthDate,
    address: {
      cep: data.zipCode,
      street: data.street,
      number: data.houseNumber,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    },
    contacts: {
      phone: data.phoneNumber,
      whatsapp: data.whastappPhone,
      email: data.email,
    },
    registrationDate: data.createdAt,
  };
};

// Mapear do formato do frontend para o formato do backend
const mapStudentToBackend = (student: Student): any => {
  return {
    id: student.id !== 'new' ? student.id : undefined,
    name: `${student.firstName} ${student.lastName}`.trim(),
    cpf: student.cpf,
    birthDate: student.dob,
    zipCode: student.address?.cep,
    street: student.address?.street,
    houseNumber: student.address?.number,
    neighborhood: student.address?.neighborhood,
    city: student.address?.city,
    state: student.address?.state,
    phoneNumber: student.contacts.phone,
    whastappPhone: student.contacts.whatsapp,
    email: student.contacts.email,
  };
};

export const studentService = {
  async getAll(): Promise<Student[]> {
    try {
      const data = await ApiClient.get<any[]>(endpoints.students.base);
      return data.map(mapStudentFromBackend);
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Student> {
    try {
      const data = await ApiClient.get<any>(endpoints.students.byId(id));
      return mapStudentFromBackend(data);
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
  },

  async create(student: Student): Promise<Student> {
    try {
      const data = await ApiClient.post<any>(
        `${endpoints.students.base}`,
        mapStudentToBackend(student)
      );
      return mapStudentFromBackend(data);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  async update(id: string, student: Student): Promise<Student> {
    try {
      const data = await ApiClient.put<any>(
        endpoints.students.byId(id),
        mapStudentToBackend(student)
      );
      return mapStudentFromBackend(data);
    } catch (error) {
      console.error(`Error updating student with ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await ApiClient.delete(endpoints.students.byId(id));
    } catch (error) {
      console.error(`Error deleting student with ID ${id}:`, error);
      throw error;
    }
  },
};
