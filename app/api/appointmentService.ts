import { get, post, put, del } from './client';
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto, AppointmentStatus } from '../types/appointment';

export const appointmentService = {
  // Appointment endpoints
  getAppointments: (status?: AppointmentStatus, startDate?: string, endDate?: string) => {
    let endpoint = '/api/appointments';
    const params = [];
    
    if (status) {
      params.push(`status=${status}`);
    }
    if (startDate) {
      params.push(`startDate=${startDate}`);
    }
    if (endDate) {
      params.push(`endDate=${endDate}`);
    }
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return get<Appointment[]>(endpoint);
  },
  
  getAppointmentById: (id: string) => get<Appointment>(`/api/appointments/${id}`),
  
  createAppointment: (appointment: CreateAppointmentDto) => 
    post<Appointment>('/api/appointments', appointment),
  
  updateAppointment: (id: string, appointment: UpdateAppointmentDto) => 
    put<Appointment>(`/api/appointments/${id}`, appointment),
  
  cancelAppointment: (id: string) => 
    put<Appointment>(`/api/appointments/${id}/cancel`, {}),
  
  // Doctor appointments
  getDoctorAppointments: (doctorId: string, status?: AppointmentStatus, date?: string) => {
    let endpoint = `/api/doctors/${doctorId}/appointments`;
    const params = [];
    
    if (status) {
      params.push(`status=${status}`);
    }
    if (date) {
      params.push(`date=${date}`);
    }
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return get<Appointment[]>(endpoint);
  },
  
  // Patient appointments
  getPatientAppointments: (patientId: string, status?: AppointmentStatus) => {
    let endpoint = `/api/patients/${patientId}/appointments`;
    
    if (status) {
      endpoint += `?status=${status}`;
    }
    
    return get<Appointment[]>(endpoint);
  },
  
  // My appointments (for logged-in user)
  getMyAppointments: (status?: AppointmentStatus) => {
    let endpoint = '/api/appointments/me';
    
    if (status) {
      endpoint += `?status=${status}`;
    }
    
    return get<Appointment[]>(endpoint);
  },
};
