import pool from '../db/db.js';
import type { Request,Response} from 'express';

export const getAllDoctorAppointments = async (req:Request,res:Response) =>{
    try {
        const query = `
        SELECT appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp
        FROM appointment
        ORDER BY appointment_id ASC
        `
        ;

        const [rows] = await pool.execute(query) ;

    
        res.status(200).json({
            success:true,
            message:'Doctor appointments found',
            data:rows
        });
    }catch(error){
        console.error('Database error:',error);
        res.status(500).json({
            success:false,
            message: 'Failed to fetch doctor appointments',
            data :[]
        });
    }

};