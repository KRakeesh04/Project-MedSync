import type {DoctorAppointment,DoctorAppointmentsApiResponse} from '../types/doctor.appointments.types';

const API_BASE_URL = 'http://localhost:8000';

export const doctorAppointmentService = {
    getAllDoctorAppointments: async ():Promise<DoctorAppointment[]> =>{
        try {
            const response = await fetch(`${API_BASE_URL}/doctors-appointments`,
                {
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch doctor appointments');
            }
            const data: DoctorAppointmentsApiResponse = await response.json();

            if(data.success){
                console.log('Fetched doctor appointments:', data.data);
                return data.data;
            }else{
                throw new Error(data.message || 'Failed to fetch doctor appointments');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};