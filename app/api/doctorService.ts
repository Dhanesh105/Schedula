import { get, post, put, del, ApiResponse } from './client';
import { Doctor, CreateDoctorDto, UpdateDoctorDto, Specialization, Capability } from '../types/doctor';
import { mockDoctors } from './mockData';

// Helper function to handle API calls with mock data fallback
const withMockFallback = async <T>(
  apiCall: Promise<ApiResponse<T>>,
  mockData: T,
  errorMessage: string
): Promise<T> => {
  const response = await apiCall;

  if (response.error || !response.data) {
    console.log(errorMessage, response.error);
    return mockData;
  }

  return response.data;
};

export const doctorService = {
  // Doctor endpoints
  getDoctors: async (): Promise<Doctor[]> => {
    return withMockFallback(
      get<Doctor[]>('/api/doctors'),
      mockDoctors,
      'Using mock data for doctors:'
    );
  },
  getDoctorById: async (id: string): Promise<Doctor> => {
    const doctor = mockDoctors.find(d => d.id === id);
    if (!doctor) {
      throw new Error(`Doctor with ID ${id} not found`);
    }

    return withMockFallback(
      get<Doctor>(`/api/doctors/${id}`),
      doctor,
      `Using mock data for doctor ${id}:`
    );
  },
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
