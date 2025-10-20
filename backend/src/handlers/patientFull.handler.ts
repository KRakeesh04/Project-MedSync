import type { Request, Response } from 'express';
import { getPatientByID } from '../models/patient.model.ts';
import { getAppointmentsbyPatientId } from '../models/appointment.model.ts';
import { getMedicationsByPatientId } from '../models/medication.model.ts';
import { getMedicalHistoriesByPatientId } from '../models/medicalhistory.model.ts';

export const getFullPatientDetailsHandler = async (req: Request, res: Response) => {
  try {
    const raw = (req.params.id ?? req.query.id) as string | undefined;
    const patientId = Number(raw);
    if (!raw || !Number.isInteger(patientId)) {
      return res.status(400).json({ error: 'patient id must be an integer' });
    }

    const patient = await getPatientByID(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const [appointments, medications, medicalHistories] = await Promise.all([
      getAppointmentsbyPatientId(patientId),
      getMedicationsByPatientId(patientId),
      getMedicalHistoriesByPatientId(patientId),
    ]);

    return res.status(200).json({
      patient,
      appointments,
      medications,
      medicalHistories,
    });
  } catch (err) {
    console.error('Failed to fetch full patient details:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
