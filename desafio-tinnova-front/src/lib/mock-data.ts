import type { Student, Teacher, ClassSession } from './types';

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    cpf: '111.111.111-11',
    firstName: 'Ana',
    lastName: 'Silva',
    dob: '1995-05-15',
    address: {
      cep: '01001-000',
      street: 'Praça da Sé',
      number: '100',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    },
    contacts: {
      whatsapp: '5511987654321',
      email: 'ana.silva@email.com',
    },
    registrationDate: new Date().toISOString(),
  },
  {
    id: 'student-2',
    cpf: '222.222.222-22',
    firstName: 'Bruno',
    lastName: 'Costa',
    dob: '2008-10-20',
    contacts: {
      whatsapp: '5521912345678',
      email: 'bruno.costa@email.com',
    },
    registrationDate: new Date().toISOString(),
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    cpf: '333.333.333-33',
    firstName: 'Carlos',
    lastName: 'Andrade',
    specialty: 'Inglês Avançado',
    status: 'active',
    hireDate: new Date().toISOString(),
  },
  {
    id: 'teacher-2',
    cpf: '444.444.444-44',
    firstName: 'Daniela',
    lastName: 'Martins',
    specialty: 'Espanhol Básico',
    status: 'inactive',
    hireDate: new Date().toISOString(),
  },
];

export const mockClassSessions: ClassSession[] = [
  {
    id: 'class-1',
    studentId: 'student-1',
    studentName: 'Ana Silva',
    teacherId: 'teacher-1',
    teacherName: 'Carlos Andrade',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    content: 'Conversation Practice - Travel',
    status: 'scheduled',
  },
  {
    id: 'class-2',
    studentId: 'student-2',
    studentName: 'Bruno Costa',
    teacherId: 'teacher-1',
    teacherName: 'Carlos Andrade',
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    content: 'Grammar Review - Past Tense',
    status: 'completed',
  },
   {
    id: 'class-3',
    studentId: 'student-1',
    studentName: 'Ana Silva',
    teacherId: 'teacher-1',
    teacherName: 'Carlos Andrade',
    dateTime: new Date().toISOString(), // Today
    content: 'Vocabulary Building - Business English',
    status: 'scheduled',
  },
];
