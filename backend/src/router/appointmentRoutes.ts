import express from 'express';
import {
  getAllAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointmentStatus
} from '../handlers/appointmentHandlers.ts';

import { getAllDoctors } from '../handlers/doctorHandlers.ts';
import { getAvailableSlots } from '../handlers/availableSlotsHandlers.ts';

const router = express.Router();

// Appointment routes
router.get('/appointments', getAllAppointments);
router.post('/appointments', createAppointment);
router.delete('/appointments/:id', deleteAppointment);
router.patch('/appointments/:id/status', updateAppointmentStatus);

// Doctor routes
router.get('/doctors', getAllDoctors);

// Available slots routes
router.get('/available-slots', getAvailableSlots);

export default router;