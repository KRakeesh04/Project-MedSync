import pool from '../db/db.js';
import type { Request,Response} from 'express';

export const getAllDoctorPatientsHistory = async (req:Request,res:Response) =>{
    try {
        const query = `
        SELECT medical_history_id, appointment_id, visit_date, diagnosis, symptoms, allergies, notes, follow_up_date, created_at, updated_at
        FROM medical_history
        ORDER BY medical_history_id ASC
        `
        ;

        const [rows] = await pool.execute(query) ;


        res.status(200).json({
            success:true,
            message:'Doctor patients history found',
            data:rows
        });
    }catch(error){
        console.error('Database error:',error);
        res.status(500).json({
            success:false,
            message: 'Failed to fetch doctor patients history',
            data :[]
        });
    }

};
