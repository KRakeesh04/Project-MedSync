import pool from '../db/db.js';
import type { Request,Response} from 'express';

export const getAllDoctorSpecialities = async (req:Request,res:Response) =>{
    try {
        const query = `
        SELECT doctor.doctor_id,doctor_speciality.speciality_id, name, speciality_name, added_at
        FROM doctor_speciality , speciality ,doctor
        WHERE doctor_speciality.speciality_id = speciality.speciality_id AND doctor.doctor_id = doctor_speciality.doctor_id
        ORDER BY doctor_id ASC
        `
        ;

        const [rows] = await pool.execute(query) ;


        res.status(200).json({
            success:true,
            message:'Doctor specialities found',
            data:rows
        });
    }catch(error){
        console.error('Database error:',error);
        res.status(500).json({
            success:false,
            message: 'Failed to fetch doctor specialities',
            data :[]
        });
    }

};
