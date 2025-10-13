import type {Doctor,DoctorsApiResponse} from '../types/doctor.types';

const API_BASE_URL = 'http://localhost:8000';

export const doctorService = {
    getAllDoctors: async():Promise<Doctor[]>=>{
        try{
            const response = await fetch(`${API_BASE_URL}/doctors`,{
                method:'GET',
                headers:{
                    'content-Type':'application/json',

                },
            });

            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`);

            }
            const data:DoctorsApiResponse = await response.json();

            if(data.success){
                return data.data;
            }else{
                throw new Error(data.message || 'Failed to fetch doctors');
            }
       
        } catch(error){
            console.error('Error in getAllDoctors:',error);
            throw error;
        }
    },
        getDoctorByID:async(id:number): Promise<Doctor>=>{
            try{
                const response = await fetch(`${API_BASE_URL}/doctors/${id}`,{
                    method:'GET',
                    headers:{
                        'content-Type':'application/json',
                    },
                });

                if (!response.ok){
                    throw new Error(`Server responded with status:${response.status}`);
                }
                const data = await response.json();

                if(data.success){
                    return data.data;;
                }else{
                    throw new Error(data.message || 'Failed to fetch doctor');
            
                }
            }catch(error){
                console.error('Error in getDoctorByID:',error);
                throw error;
            }
        },
        // Add this method to your existing doctorService object
addDoctor: async (doctorData: {
  name: string;
  fee_per_patient: string;
  basic_monthly_salary: string;
  gender: string;
  branch_id: string;
  specialties?: number[];
}) => {
  const response = await fetch(`${API_BASE_URL}/doctors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: doctorData.name,
      fee_per_patient: parseFloat(doctorData.fee_per_patient),
      basic_monthly_salary: parseFloat(doctorData.basic_monthly_salary),
      gender: doctorData.gender,
      branch_id: doctorData.branch_id,
      specialties: doctorData.specialties || [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
    };
            