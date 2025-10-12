import type { Request, Response } from 'express';
import pool from '../db/db.ts';

// Get all doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        d.*,
        GROUP_CONCAT(DISTINCT s.speciality_name) as specialties
      FROM doctor d
      LEFT JOIN doctor_speciality ds ON d.doctor_id = ds.doctor_id
      LEFT JOIN speciality s ON ds.specialiy_id = s.speciality_id
      GROUP BY d.doctor_id
      ORDER BY d.name
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};