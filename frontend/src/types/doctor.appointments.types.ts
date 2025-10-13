export interface DoctorAppointment {
    appointment_id : number;
    patient_id :number;
    doctor_id :number;
    patient_note :string;
    date: string;
    time_slot:string;
    status:string;
    time_stamp:string;
}

export interface DoctorAppointmentsApiResponse {
    success: boolean;
    message : string ;
    data : DoctorAppointment[];

}