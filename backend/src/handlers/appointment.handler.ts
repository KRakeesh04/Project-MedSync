import type { Request, Response } from "express";
import { getAppointmentsByDoctorId, getAppointmentsByDoctorIdCount, getAppointmentsbyPatientId, getDoctorsAppointments, getDoctorsAppointmentsCount, getMonthlyAppointmentCounts } from "../models/appointment.model.ts";
import { type DoctorAppointment } from "../models/appointment.model.ts";
import { AppointmentModel } from '../models/appointment.model.ts';


export const getAppointmentsbyPatientIdHandler = async (req: Request, res: Response) => {
    try {
        // /patients/appointments/:patientId
        const { patientId } = req.params;
        const appointments = await getAppointmentsbyPatientId(Number(patientId));
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error in getAppointmentsbyPatientIdHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAppointmentsCountByMonthHandler = async (req: Request, res: Response) => {
    try {
        const appointmentCounts = await getMonthlyAppointmentCounts('2025-01-01', '2025-12-31', 'null');
        res.status(200).json(appointmentCounts);
    } catch (error) {
        console.error("Error in getAppointmentsCountByMonthHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getDoctorsAppointmentsForPagination = async (req: Request, res: Response) => {
  const { count, offset } = req.query;

  try {
    const appointments: DoctorAppointment[] = await getDoctorsAppointments(Number(count), Number(offset));
    if (appointments.length < 1) {
      res.status(404).json({ error: "Appointments not found" });
      return;
    }

    const appointments_count: number = await getDoctorsAppointmentsCount();
    if (appointments_count == undefined) {
      console.log("error in finding the appointments count, count = " + appointments_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json({
      appointments_count: appointments_count,
      appointments: appointments,
    });
  } catch (error) {
    console.log("Error in getDoctorsAppointmentsForPagination handler: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAppointmentsByDoctorIdHandler = async (req: Request, res: Response) => {
  try {
        // /patients/appointments/:patientId
        const { doctorId } = req.params;
        const appointments = await getAppointmentsByDoctorId(Number(doctorId));
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error in getAppointmentsByDoctorIdHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAppointmentsByDoctorIdCountHandler = async (req: Request, res: Response) => {
  try {
    // /patients/appointments/:patientId
    const { doctorId } = req.params;
    const count = await getAppointmentsByDoctorIdCount(Number(doctorId));
    res.status(200).json(count);
  } catch (error) {
    console.error("Error in getAppointmentsByDoctorIdCountHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all appointments
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all appointments...');
    const appointments = await AppointmentModel.getAllAppointments();
    res.json(appointments);
  } catch (error: any) {
    console.error('Error in getAllAppointments handler:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Fetching appointment ID:', id);

    // Parse and validate appointment ID
    const appointmentId = Number(id);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await AppointmentModel.getAppointmentById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error: any) {
    console.error('Error in getAppointmentById handler:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patient_name, patient_contact, patient_age, doctor_id, date, time_slot, patient_note } = req.body;

    console.log('Received appointment data:', req.body);

    // Validate required fields
    if (!patient_name || !patient_contact || !patient_age || !doctor_id || !date || !time_slot) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['patient_name', 'patient_contact', 'patient_age', 'doctor_id', 'date', 'time_slot']
      });
    }

    // Parse and validate IDs
    const doctorId = Number(doctor_id);
    const patientAge = Number(patient_age);
    
    if (isNaN(doctorId) || isNaN(patientAge) || patientAge <= 0 || patientAge > 120) {
      return res.status(400).json({ message: 'Invalid doctor_id or patient_age' });
    }

    const appointmentId = await AppointmentModel.createAppointment(
      patient_name,
      patient_contact,
      patientAge,
      doctorId,
      date,
      time_slot,
      patient_note || ''
    );

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment_id: appointmentId 
    });

  } catch (error: any) {
    console.error('Error in createAppointment handler:', error);
    
    if (error.message.includes('Time slot is not available')) {
      return res.status(409).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Update appointment (comprehensive update)
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { patient_name, doctor_id, date, time_slot, patient_note, status } = req.body;

    console.log('Updating appointment ID:', id, 'with data:', req.body);

    // Parse and validate appointment ID
    const appointmentId = Number(id);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    // Validate that at least one field is provided
    if (!patient_name && !doctor_id && !date && !time_slot && !patient_note && !status) {
      return res.status(400).json({ 
        message: 'At least one field must be provided for update',
        fields: ['patient_name', 'doctor_id', 'date', 'time_slot', 'patient_note', 'status']
      });
    }

    // Validate status if provided
    if (status && !['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Parse doctor_id if provided
    const doctorId = doctor_id ? Number(doctor_id) : undefined;
    if (doctor_id && isNaN(doctorId!)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const updateData = {
      appointment_id: appointmentId,
      patient_name: patient_name || undefined,
      doctor_id: doctorId,
      date: date || undefined,
      time_slot: time_slot || undefined,
      patient_note: patient_note || undefined,
      status: status || undefined
    };

    const affectedRows = await AppointmentModel.updateAppointment(updateData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }

    res.json({ 
      message: 'Appointment updated successfully',
      affected_rows: affectedRows
    });

  } catch (error: any) {
    console.error('Error in updateAppointment handler:', error);
    
    if (error.message.includes('Time slot is not available')) {
      return res.status(409).json({ 
        message: error.message 
      });
    }
    
    if (error.message.includes('Appointment not found')) {
      return res.status(404).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Update appointment status only
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating appointment status:', { id, status });

    // Parse and validate appointment ID
    const appointmentId = Number(id);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    if (!status || !['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const affectedRows = await AppointmentModel.updateAppointmentStatus(appointmentId, status);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }

    res.json({ 
      message: 'Appointment status updated successfully',
      affected_rows: affectedRows
    });
  } catch (error: any) {
    console.error('Error in updateAppointmentStatus handler:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Deleting appointment ID:', id);

    // Parse and validate appointment ID
    const appointmentId = Number(id);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const affectedRows = await AppointmentModel.deleteAppointment(appointmentId);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ 
      message: 'Appointment deleted successfully',
      affected_rows: affectedRows
    });
  } catch (error: any) {
    console.error('Error in deleteAppointment handler:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Get available time slots
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { doctor_id, date } = req.query;
    console.log('Fetching available slots for:', { doctor_id, date });

    if (!doctor_id || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    // Parse and validate doctor ID
    const doctorId = Number(doctor_id);
    if (isNaN(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const availableSlots = await AppointmentModel.getAvailableSlots(doctorId, date as string);

    res.json(availableSlots);
  } catch (error: any) {
    console.error('Error in getAvailableSlots handler:', error);
    
    if (error.message.includes('Doctor not found')) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Get all doctors for appointments
export const getAllDoctorsForAppointments = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all doctors for appointments...');
    const doctors = await AppointmentModel.getAllDoctorsForAppointments();
    res.json(doctors);
  } catch (error: any) {
    console.error('Error in getAllDoctorsForAppointments handler:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};

// Create appointment using CreateAppointmentData interface (convenience endpoint)
export const createAppointmentFromData = async (req: Request, res: Response) => {
  try {
    const appointmentData = req.body;
    console.log('Received appointment data:', appointmentData);

    // Validate required fields
    const requiredFields = ['patient_name', 'patient_contact', 'patient_age', 'doctor_id', 'date', 'time_slot'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: missingFields
      });
    }

    // Parse and validate IDs
    const doctorId = Number(appointmentData.doctor_id);
    const patientAge = Number(appointmentData.patient_age);
    
    if (isNaN(doctorId) || isNaN(patientAge) || patientAge <= 0 || patientAge > 120) {
      return res.status(400).json({ message: 'Invalid doctor_id or patient_age' });
    }

    const appointmentId = await AppointmentModel.createAppointmentFromData(appointmentData);

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment_id: appointmentId 
    });

  } catch (error: any) {
    console.error('Error in createAppointmentFromData handler:', error);
    
    if (error.message.includes('Time slot is not available')) {
      return res.status(409).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    });
  }
};