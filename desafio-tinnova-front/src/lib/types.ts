export interface Student {
  id: string;
  cpf: string;
  firstName: string;
  lastName: string;
  dob?: string; // Date of Birth
  address?: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  contacts: {
    phone?: string;
    whatsapp: string;
    email?: string;
  };
  registrationDate: string;
}

export interface Teacher {
  id: string;
  cpf: string;
  firstName: string;
  lastName: string;
  dob?: string;
  specialty?: string;
  status: "active" | "inactive";
  hireDate: string;
}

export interface ClassSession {
  id: string;
  studentId: string;
  studentName?: string; // Denormalized for easy display
  teacherId: string;
  teacherName?: string; // Denormalized
  dateTime: string; // ISO string for date and time
  content: string;
  status: "scheduled" | "completed" | "canceled";
}
