import type { Request, Response } from 'express';
import { addSpeciality, getAllSpecialities, type Speciality } from '../models/speciality.model.ts';

export const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const rows: Speciality[] = await getAllSpecialities();
    if (rows.length < 1) {
      res.status(404).json({ error: "Specialties not found" });
      return;
    }
    res.status(200).json({
      speciality_count: rows.length,
      specialities: rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addNewSpecialty = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body);
    const { speciality_name, description } = req.body;

    if (!speciality_name || !description) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ success: false, message: 'Specialty name and description are required' });
    }

    console.log('Inserting specialty:', { speciality_name, description });
    await addSpeciality(speciality_name, description);

    res.status(200).json({ message: 'Specialty added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSpecialityNames = async (req: Request, res: Response) => {
  try {
    const rows: Speciality[] = await getAllSpecialities();
    if (!rows || rows.length === 0) {
      return res.status(200).json({ speciality_count: 0, specialities: [] });
    }

    const list = rows.map((s) => ({ speciality_id: s.speciality_id, speciality_name: s.speciality_name }));
    return res.status(200).json({ speciality_count: list.length, specialities: list });
  } catch (error) {
    console.error('Database error (speciality names):', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

