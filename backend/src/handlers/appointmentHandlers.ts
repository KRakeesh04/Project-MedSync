import type { Request, Response } from 'express';
import pool from '../db/db.ts';

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name
      FROM appointment a
      LEFT JOIN patient p ON a.patient_id = p.patient_id
      LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
      ORDER BY a.date DESC, a.time_slot ASC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patient_name, patient_contact, doctor_id, date, time_slot, patient_note, patient_age } = req.body;

    // Validate required fields
    if (!patient_name || !patient_contact || !doctor_id || !date || !time_slot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for overlapping appointments
    const [existingAppointments] = await pool.execute(
      `SELECT * FROM appointment 
       WHERE doctor_id = ? AND date = ? AND time_slot = ? AND status != 'Cancelled'`,
      [doctor_id, date, time_slot]
    );

    if (Array.isArray(existingAppointments) && existingAppointments.length > 0) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }

    // First, create a user for the patient if they don't exist
    // For simplicity, we'll assume patient_id is provided or create logic to handle new patients
    // For now, let's use a temporary approach - you might want to modify this based on your patient management
    
    // Get the next appointment ID
    const [maxIdResult] = await pool.execute('SELECT MAX(appointment_id) as maxId FROM appointment');
    const maxId = Array.isArray(maxIdResult) && maxIdResult[0] ? (maxIdResult[0] as any).maxId : 0;
    const newAppointmentId = maxId + 1;

    // For demo purposes, we'll use patient_id = 3 (from your init.sql)
    // In production, you'd have proper patient creation/selection logic
    const patient_id = 3;

    // Create the appointment
    await pool.execute(
      `INSERT INTO appointment 
       (appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
      [newAppointmentId, patient_id, doctor_id, patient_note || '', date, time_slot]
    );

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment_id: newAppointmentId 
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM appointment WHERE appointment_id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [result] = await pool.execute(
      'UPDATE appointment SET status = ? WHERE appointment_id = ?',
      [status, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

