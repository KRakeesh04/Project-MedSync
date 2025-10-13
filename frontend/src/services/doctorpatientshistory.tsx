import type { DoctorPatientsHistory, DoctorPatientsHistoryApiResponse } from "../types/doctor.patients.history.types";

const API_BASE_URL = 'http://localhost:8000';

export const doctorPatientsHistoryService = {
    getAllDoctorPatientsHistory: async ():Promise<DoctorPatientsHistory[]> =>{
        try {
            const response = await fetch(`${API_BASE_URL}/doctors-patients-history`,
                {
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch doctor patients history');
            }
            const data: DoctorPatientsHistoryApiResponse = await response.json();

            if(data.success){
                console.log('Fetched doctor patients history:', data.data);
                return data.data;
            }else{
                throw new Error(data.message || 'Failed to fetch doctor patients history');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};