export interface DoctorPatientsHistory {
    medical_history_id: number;
    appointment_id: number;
    visit_date: string;
    diagnosis: string;
    symptoms: string;
    allergies: string;
    notes: string;
    follow_up_date: string;
    created_at: string;
    updated_at: string;
}

export interface DoctorPatientsHistoryApiResponse {
    success: boolean;
    message : string ;
    data : DoctorPatientsHistory[];

}