export interface Speciality {
    speciality_id : number;
    speciality_name : string;
    description: string;
}

export interface SpecialitiesApiResponse {
    success : boolean;
    message : string;
    data : Speciality[];
}