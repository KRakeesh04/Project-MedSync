export interface Doctor {
    doctor_id : number;
    name : string;
    fee_per_patient:number;
    basic_monthly_salary : number;
    gender:string;
}

export interface DoctorsApiResponse {
    success : boolean;
    message : string;
    data : Doctor[];
}