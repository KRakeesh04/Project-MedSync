import type { Request, Response } from 'express';
import { getDoctorsPatientsOverview } from '../models/doctorPatients.model.ts';

export const getDoctorsPatientsOverviewHandler = async (req: Request, res: Response) => {
  try {
    const data = await getDoctorsPatientsOverview();
    res.json({ doctor_count: data.length, doctors: data });
  } catch (err) {
    console.error('Failed to get doctors patients overview', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
