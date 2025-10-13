import type {Speciality,SpecialitiesApiResponse} from '../types/speciality.types';

const API_BASE_URL = 'http://localhost:8000';

export const specialityService = {
    getAllSpecialities: async ():Promise<Speciality[]> =>{
        try {
            const response = await fetch(`${API_BASE_URL}/specialities`,
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
            const data: SpecialitiesApiResponse = await response.json();

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
    },
    addSpeciality: async (specialityData: {
  speciality_id: string;
  speciality_name: string;
  description: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/specialities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      speciality_id: specialityData.speciality_id,
      speciality_name: specialityData.speciality_name,
      description: specialityData.description,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
};

       