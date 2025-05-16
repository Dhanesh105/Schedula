import { get, post, put, del } from './client';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../types/patient';

export const patientService = {
  // Patient endpoints
  getPatients: () => get<Patient[]>('/api/patients'),
  getPatientById: (id: string) => get<Patient>(`/api/patients/${id}`),
  createPatient: (patient: CreatePatientDto) => post<Patient>('/api/patients', patient),
  updatePatient: (id: string, patient: UpdatePatientDto) => put<Patient>(`/api/patients/${id}`, patient),
  deletePatient: (id: string) => del(`/api/patients/${id}`),
  
  // Current patient profile
  getMyProfile: () => get<Patient>('/api/patients/me'),
  updateMyProfile: (patient: UpdatePatientDto) => put<Patient>('/api/patients/me', patient),
};
