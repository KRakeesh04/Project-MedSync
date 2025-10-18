import axiosInstance from "../axiosConfig";

export interface appointment{
    appointment_id:number;
    patient_id:number;
    doctor_id:number;
    patient_note:string;
    date:string;
    time_slot:string;
    status:string;
    name?:string; // doctor's name
}

export const getAppointmentsByPatientId = async (patientId: number): Promise<appointment[]> => {
  const resp = await axiosInstance.get(`/patient/appointments/${patientId}`);
  const data = resp.data;
  // Normalize: accept either an array or { appointments: [...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.appointments)) return data.appointments;
  return [];
};