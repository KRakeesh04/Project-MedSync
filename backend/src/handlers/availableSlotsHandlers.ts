import type { Request, Response } from 'express';
import pool from '../db/db.ts';

// Get available time slots for a doctor on a specific date
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    // Common time slots
    const allTimeSlots = [
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00'
    ];

    // Get booked slots for the doctor on the specified date
    const [bookedSlots] = await pool.execute(
      `SELECT time_slot FROM appointment 
       WHERE doctor_id = ? AND date = ? AND status != 'Cancelled'`,
      [doctor_id, date]
    );

    const bookedSlotsArray = Array.isArray(bookedSlots) 
      ? bookedSlots.map((slot: any) => slot.time_slot)
      : [];

    // Get doctor details
    const [doctors] = await pool.execute(
      `SELECT d.*, GROUP_CONCAT(DISTINCT s.speciality_name) as specialty
       FROM doctor d
       LEFT JOIN doctor_speciality ds ON d.doctor_id = ds.doctor_id
       LEFT JOIN speciality s ON ds.specialiy_id = s.speciality_id
       WHERE d.doctor_id = ?
       GROUP BY d.doctor_id`,
      [doctor_id]
    );

    const doctor = Array.isArray(doctors) && doctors.length > 0 ? doctors[0] : null;

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create available slots array
    const availableSlots = allTimeSlots
      .filter(slot => !bookedSlotsArray.includes(slot))
      .map(slot => ({
        doctor_id: parseInt(doctor_id as string),
        doctor_name: (doctor as any).name,
        specialty: (doctor as any).specialty,
        date: date as string,
        time_slot: slot
      }));

    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};