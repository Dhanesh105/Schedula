import { get, post, put, del } from './client';
import { Doctor, CreateDoctorDto, UpdateDoctorDto, Specialization, Capability } from '../types/doctor';

export const doctorService = {
  // Doctor endpoints
  getDoctors: () => get<Doctor[]>('/api/doctors'),
  getDoctorById: (id: string) => get<Doctor>(`/api/doctors/${id}`),
  createDoctor: (doctor: CreateDoctorDto) => post<Doctor>('/api/doctors', doctor),
  updateDoctor: (id: string, doctor: UpdateDoctorDto) => put<Doctor>(`/api/doctors/${id}`, doctor),

  // Specialization endpoints
  getSpecializations: () => get<Specialization[]>('/api/specializations'),
  getSpecializationById: (id: string) => get<Specialization>(`/api/specializations/${id}`),
  createSpecialization: (specialization: { name: string; description?: string; icon?: string }) => 
    post<Specialization>('/api/specializations', specialization),
  updateSpecialization: (id: string, specialization: { name?: string; description?: string; icon?: string }) => 
    put<Specialization>(`/api/specializations/${id}`, specialization),
  deleteSpecialization: (id: string) => del(`/api/specializations/${id}`),
  addSpecializationToDoctor: (doctorId: string, specializationId: string) => 
    post(`/api/doctors/${doctorId}/specializations`, { specializationId }),
  removeSpecializationFromDoctor: (doctorId: string, specializationId: string) => 
    del(`/api/doctors/${doctorId}/specializations/${specializationId}`),

  // Capability endpoints
  getCapabilities: () => get<Capability[]>('/api/capabilities'),
  getCapabilityById: (id: string) => get<Capability>(`/api/capabilities/${id}`),
  createCapability: (capability: { name: string; description?: string }) => 
    post<Capability>('/api/capabilities', capability),
  updateCapability: (id: string, capability: { name?: string; description?: string }) => 
    put<Capability>(`/api/capabilities/${id}`, capability),
  deleteCapability: (id: string) => del(`/api/capabilities/${id}`),
  addCapabilityToDoctor: (doctorId: string, capabilityId: string) => 
    post(`/api/doctors/${doctorId}/capabilities`, { capabilityId }),
  removeCapabilityFromDoctor: (doctorId: string, capabilityId: string) => 
    del(`/api/doctors/${doctorId}/capabilities/${capabilityId}`),
};
