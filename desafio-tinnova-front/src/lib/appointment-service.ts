import { endpoints } from './api-config';
import { ClassSession } from './types';
import { ApiClient } from './api-client';

// Mapear do formato do backend para o formato do frontend
const mapAppointmentFromBackend = (data: any): ClassSession => {
  return {
    id: data.id.toString(),
    studentId: data.student?.id.toString(),
    studentName: data.student?.name,
    teacherId: data.teacher?.id.toString(),
    teacherName: data.teacher?.name,
    dateTime: data.appointmentDatetime,
    content: data.content,
    status: mapStatusFromBackend(data.status),
  };
};

// Mapear status do backend para o frontend
const mapStatusFromBackend = (status: string): ClassSession['status'] => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'completed';
    case 'CANCELED':
      return 'canceled';
    case 'PENDING':
    case 'SCHEDULED':
    default:
      return 'scheduled';
  }
};

// Mapear status do frontend para o backend
const mapStatusToBackend = (status: ClassSession['status']): string => {
  switch (status) {
    case 'completed':
      return 'COMPLETED';
    case 'canceled':
      return 'CANCELED';
    case 'scheduled':
    default:
      return 'PENDING';
  }
};

// Mapear do formato do frontend para o formato do backend
const mapAppointmentToBackend = (appointment: ClassSession): any => {
  // Garantir que a data está em formato ISO 8601 (compatível com LocalDateTime do Java)
  const formattedDateTime = typeof appointment.dateTime === 'string' 
    ? appointment.dateTime
    : new Date(appointment.dateTime).toISOString();

  return {
    content: appointment.content,
    appointmentDatetime: formattedDateTime,
    status: mapStatusToBackend(appointment.status),
    studentId: appointment.studentId,
    teacherId: appointment.teacherId,
    requiresConsentForm: false
  };
};

export const appointmentService = {
  async getAll(): Promise<ClassSession[]> {
    try {
      const data = await ApiClient.get<any[]>(endpoints.appointments.base);
      return data.map(mapAppointmentFromBackend);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<ClassSession> {
    try {
      const data = await ApiClient.get<any>(endpoints.appointments.byId(id));
      return mapAppointmentFromBackend(data);
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  },

  async create(appointment: ClassSession): Promise<ClassSession> {
    try {
      const data = await ApiClient.post<any>(
        endpoints.appointments.base,
        mapAppointmentToBackend(appointment)
      );
      return mapAppointmentFromBackend(data);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async update(id: string, appointment: ClassSession): Promise<ClassSession> {
    try {
      const data = await ApiClient.put<any>(
        endpoints.appointments.byId(id),
        mapAppointmentToBackend(appointment)
      );
      return mapAppointmentFromBackend(data);
    } catch (error) {
      console.error(`Error updating appointment with ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await ApiClient.delete(endpoints.appointments.byId(id));
    } catch (error) {
      console.error(`Error deleting appointment with ID ${id}:`, error);
      throw error;
    }
  },
};
