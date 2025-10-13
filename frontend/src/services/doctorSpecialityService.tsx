import type { DoctorSpeciality,DoctorSpecialityApiResponse } from "@/types/doctor.specialities.types";

const API_BASE_URL = 'http://localhost:8000';

export const doctorSpecialityService = {
    getAllDoctorSpecialities: async ():Promise<DoctorSpeciality[]> =>{
        try {
            const response = await fetch(`${API_BASE_URL}/doctors-specialities`,
                {
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch doctor specialities');
            }
            const data: DoctorSpecialityApiResponse = await response.json();

            if(data.success){
                console.log('Fetched doctor specialities:', data.data);
                return data.data;
            }else{
                throw new Error(data.message || 'Failed to fetch doctor specialities');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};