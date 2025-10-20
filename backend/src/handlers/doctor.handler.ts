import type { Request, Response } from 'express';
import { createDoctorByAdmin, getAllDoctors, getAllDoctorsCount, getDoctorById } from "../models/doctor.model.ts";
import { getAllDoctorsNames } from "../models/doctor.model.ts";
import { getAllDoctorSpeciality, addDoctorSpeciality } from '../models/doctor_speciality.model.ts';

export const getAllDoctorsForPagination = async (req: Request, res: Response) => {
  try {
    const { count, offset, branch } = req.query;
    if (!count || isNaN(Number(count)) || !offset || isNaN(Number(offset)) || !branch || isNaN(Number(branch))) {
      return res.status(400).json({ error: 'Please provide valid count, offset, and branch parameters' });
    }
    const data = await getAllDoctors(Number(count), Number(offset), Number(branch));
    if (data.length === 0) {
      return res.status(404).json({ error: 'No doctors found' });
    }
    const totalDoctors = await getAllDoctorsCount(Number(branch));
    if (totalDoctors === 0) {
      return res.status(404).json({ error: 'No doctors found' });
    }
    return res.status(200).json({
      doctor_count: totalDoctors,
      doctors: data,
    });
  }
  catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

export const getDoctorDetailsByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Please provide a valid doctor ID' });
    }
    const data = await getDoctorById(Number(id));
    if (!data) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    return res.status(200).json({ doctor: data });
  }
  catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

export const addNewDoctor = async (req: Request, res: Response) => {
  try {
    const { name, fee_per_patient, basic_monthly_salary, gender, branch_id, specialties } = req.body;

    if (!name || !fee_per_patient || !basic_monthly_salary || !gender || !branch_id) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    await createDoctorByAdmin(
      String(name),
      String(gender),
      Number(fee_per_patient),
      Number(basic_monthly_salary),
      Number(branch_id),
      Array.isArray(specialties) ? specialties : []
    );
    return res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    return res.status(500).json({ error: 'Failed to add doctor' });
  }
};

export const getAllDoctorSpecialities = async (req: Request, res: Response) => {
  try {
    const data = await getAllDoctorSpeciality();
    if (data.length === 0) {
      return res.status(404).json({ error: 'No doctor specialities found' });
    }
    return res.status(200).json({
      doc_speciality_count: data.length,
      doc_specialities: data,
    });
  } catch (error) {
    console.error('Error fetching doctor specialities:', error);
    return res.status(500).json({ error: 'Failed to fetch doctor specialities' });
  }
};

export const getDoctorsWithSpecialities = async (req: Request, res: Response) => {
  try {
    const rows = await getAllDoctorSpeciality();

    if (!rows || rows.length === 0) {
      return res.status(200).json({ doctor_count: 0, doctors: [] });
    }

    // Group rows by doctor_id
    const map = new Map<number, any>();
    for (const r of rows) {
      const docId = Number(r.doctor_id);
      if (!map.has(docId)) {
        map.set(docId, {
          doctor_id: docId,
          name: r.doctor_name,
          specialties: [],
          added_at: r.added_at ?? null,
          branch: null,
        });
      }

      const doc = map.get(docId);
      doc.specialties.push({ name: r.speciality_name, added_at: r.added_at });
    }

    const doctors = Array.from(map.values());

    // Enrich with branch information by fetching doctor details
    for (const doc of doctors) {
      try {
        const details = await getDoctorById(Number(doc.doctor_id));
        doc.branch = details.branch_name ?? null;
      } catch (err) {
        // If fetching details fails, leave branch null and continue
        console.warn(`Failed to fetch details for doctor ${doc.doctor_id}:`, err);
        doc.branch = null;
      }
    }

    return res.status(200).json({ doctor_count: doctors.length, doctors });
  } catch (error) {
    console.error('Error grouping doctor specialties:', error);
    return res.status(500).json({ error: 'Failed to fetch grouped doctor specialties' });
  }
};

export const assignDoctorSpeciality = async (req: Request, res: Response) => {
  try {
    const { doctor_id, speciality_id } = req.body;
    if (!doctor_id || isNaN(Number(doctor_id)) || !speciality_id || isNaN(Number(speciality_id))) {
      return res.status(400).json({ error: 'doctor_id and speciality_id must be provided and be integers' });
    }

    await addDoctorSpeciality(Number(doctor_id), Number(speciality_id));
    return res.status(201).json({ message: 'Speciality assigned to doctor successfully' });
  } catch (error) {
    console.error('Error assigning speciality to doctor:', error);
    return res.status(500).json({ error: 'Failed to assign speciality to doctor' });
  }
};

export const getAllDoctorsNamesHandler = async (req: Request, res: Response) => {
  try {
    const rows = await getAllDoctorsNames();
    return res.status(200).json({ doctor_count: rows.length, doctors: rows });
  } catch (error) {
    console.error('Error fetching doctor names:', error);
    return res.status(500).json({ error: 'Failed to fetch doctor names' });
  }
};