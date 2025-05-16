'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import { Doctor } from '../types/doctor';
import { Patient } from '../types/patient';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { doctorService } from '../api/doctorService';
import { patientService } from '../api/patientService';
import { appointmentService } from '../api/appointmentService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Doctor | Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch profile data based on user role
        if (user.role === UserRole.DOCTOR) {
          const profileResponse = await doctorService.getMyProfile();
          if (profileResponse.error) {
            setError(profileResponse.error);
          } else if (profileResponse.data) {
            setProfile(profileResponse.data);
          }
        } else if (user.role === UserRole.PATIENT) {
          const profileResponse = await patientService.getMyProfile();
          if (profileResponse.error) {
            setError(profileResponse.error);
          } else if (profileResponse.data) {
            setProfile(profileResponse.data);
          }
        }

        // Fetch appointments
        const appointmentsResponse = await appointmentService.getMyAppointments();
        if (appointmentsResponse.error) {
          setError(appointmentsResponse.error);
        } else if (appointmentsResponse.data) {
          setAppointments(appointmentsResponse.data);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.role === UserRole.DOCTOR ? 'Dr.' : ''} {profile ? (profile as any).firstName : ''} {profile ? (profile as any).lastName : ''}</h2>
            <p className="text-gray-600 mb-4">
              Role: <span className="font-medium">{user.role}</span>
            </p>
            <div className="flex space-x-4">
              <Link
                href="/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Profile
              </Link>
              {user.role === UserRole.DOCTOR && (
                <Link
                  href="/schedules/me"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Manage Schedule
                </Link>
              )}
              {user.role === UserRole.PATIENT && (
                <Link
                  href="/appointments/book"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Book Appointment
                </Link>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          
          {appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    {user?.role === UserRole.DOCTOR ? (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                    ) : (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.startTime} - {appointment.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* This would be populated with actual data in a real app */}
                        {user?.role === UserRole.DOCTOR ? 'Patient Name' : 'Dr. Name'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === AppointmentStatus.SCHEDULED
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === AppointmentStatus.CONFIRMED
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === AppointmentStatus.CANCELLED
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        {appointment.status === AppointmentStatus.SCHEDULED && (
                          <Link
                            href={`/appointments/${appointment.id}/cancel`}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6">
            <Link
              href="/appointments"
              className="text-blue-600 hover:underline"
            >
              View All Appointments
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
