export interface DoctorSpeciality {
    doctor_id : number;
    speciality_id :number;
    name :string;
    speciality_name :string;
    added_at : string;
}

export interface DoctorSpecialityApiResponse {
    success: boolean;
    message : string ;
    data : DoctorSpeciality[];

}