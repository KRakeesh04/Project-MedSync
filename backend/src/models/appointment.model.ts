import pool from '../db/db.ts';

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  patient_note: string;
  date: string;
  time_slot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  time_stamp: string;
  patient_name?: string;
  doctor_name?: string;
}

export interface AvailableSlot {
  time_slot: string;
  date: string;
  doctor_id: number;
  doctor_name: string;
  specialty: string;
}

export interface Doctor {
  doctor_id: number;
  name: string;
  fee_per_patient: number;
  basic_monthly_salary: number;
  gender: string;
  specialties: string;
}

export interface CreateAppointmentData {
  patient_name: string;
  patient_contact: string;
  patient_age: number;
  doctor_id: number;
  date: string;
  time_slot: string;
  patient_note?: string;
}

export interface UpdateAppointmentData {
  appointment_id: number;
  patient_name?: string | undefined;
  doctor_id?: number | undefined;
  date?: string | undefined;
  time_slot?: string | undefined;
  patient_note?: string | undefined;
  status?: string | undefined;
}

export class AppointmentModel {
  // Get all appointments with details
  static async getAllAppointments(): Promise<Appointment[]> {
    try {
      const [rows] = await pool.execute('CALL get_all_appointments()');
      const result = (rows as any)[0];
      console.log('Fetched appointments:', result);
      return result || [];
    } catch (error) {
      console.error('Error in getAllAppointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  // Get appointment by ID
  static async getAppointmentById(appointmentId: number): Promise<Appointment | null> {
    try {
      const [rows] = await pool.execute(
        'CALL get_appointment_by_id(?)',
        [appointmentId]
      );
      const result = (rows as any)[0];
      console.log('Fetched appointment:', result);
      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error in getAppointmentById:', error);
      throw new Error('Failed to fetch appointment');
    }
  }

  // Create new appointment with patient information
  static async createAppointment(
    patientName: string,
    patientContact: string,
    patientAge: number,
    doctorId: number,
    date: string,
    timeSlot: string,
    patientNote: string = ''
  ): Promise<number> {
    try {
      console.log('Creating appointment with data:', {
        patientName, patientContact, patientAge, doctorId, date, timeSlot, patientNote
      });

      const [result] = await pool.execute(
        'CALL create_appointment(?, ?, ?, ?, ?, ?, ?)',
        [patientName, patientContact, patientAge, doctorId, date, timeSlot, patientNote]
      );
      
      const appointmentId = (result as any)[0][0].appointment_id;
      console.log('Created appointment with ID:', appointmentId);
      return appointmentId;
    } catch (error: any) {
      console.error('Error in createAppointment:', error);
      if (error.message.includes('Time slot is not available')) {
        throw new Error('Time slot is not available. Please choose a different time.');
      }
      throw new Error('Failed to create appointment');
    }
  }

  // Update appointment with comprehensive data
  static async updateAppointment(updateData: UpdateAppointmentData): Promise<number> {
    try {
      console.log('Updating appointment with data:', updateData);

      const [result] = await pool.execute(
        'CALL update_appointment(?, ?, ?, ?, ?, ?, ?)',
        [
          updateData.appointment_id,
          updateData.patient_name || null,
          updateData.doctor_id || null,
          updateData.date || null,
          updateData.time_slot || null,
          updateData.patient_note || null,
          updateData.status || null
        ]
      );
      
      // Fixed: Access the result properly
      const affectedRows = (result as any)[0][0]?.affected_rows;
      console.log('Update appointment affected rows:', affectedRows);
      return affectedRows || 0;
    } catch (error: any) {
      console.error('Error in updateAppointment:', error);
      if (error.message.includes('Time slot is not available') || 
          error.message.includes('Doctor is not available') ||
          error.message.includes('Patient already has another appointment')) {
        throw new Error(error.message);
      }
      if (error.message.includes('Appointment not found')) {
        throw new Error('Appointment not found');
      }
      throw new Error('Failed to update appointment');
    }
  }

  // Update appointment status only
  static async updateAppointmentStatus(
    appointmentId: number,
    status: string
  ): Promise<number> {
    try {
      const updateData: UpdateAppointmentData = {
        appointment_id: appointmentId,
        status: status
      };
      return await this.updateAppointment(updateData);
    } catch (error) {
      console.error('Error in updateAppointmentStatus:', error);
      throw new Error('Failed to update appointment status');
    }
  }

  // Delete appointment
  static async deleteAppointment(appointmentId: number): Promise<number> {
    try {
      const [result] = await pool.execute(
        'CALL delete_appointment(?)',
        [appointmentId]
      );
      
      const affectedRows = (result as any)[0][0].affected_rows;
      console.log('Delete appointment affected rows:', affectedRows);
      return affectedRows;
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
      throw new Error('Failed to delete appointment');
    }
  }

  // Get available slots
  static async getAvailableSlots(doctorId: number, date: string): Promise<AvailableSlot[]> {
    try {
      const [rows] = await pool.execute(
        'CALL get_available_slots(?, ?)',
        [doctorId, date]
      );
      const result = (rows as any)[0];
      console.log('Available slots:', result);
      return result || [];
    } catch (error: any) {
      console.error('Error in getAvailableSlots:', error);
      if (error.message.includes('Doctor not found')) {
        throw new Error('Doctor not found');
      }
      throw new Error('Failed to fetch available slots');
    }
  }

  // Get all doctors for appointments
  static async getAllDoctorsForAppointments(): Promise<Doctor[]> {
    try {
      const [rows] = await pool.execute('CALL get_all_doctors_for_appointments()');
      const result = (rows as any)[0];
      console.log('Fetched doctors:', result);
      return result || [];
    } catch (error) {
      console.error('Error in getAllDoctorsForAppointments:', error);
      throw new Error('Failed to fetch doctors');
    }
  }

  // Convenience method to create appointment using CreateAppointmentData interface
  static async createAppointmentFromData(data: CreateAppointmentData): Promise<number> {
    return await this.createAppointment(
      data.patient_name,
      data.patient_contact,
      data.patient_age,
      data.doctor_id,
      data.date,
      data.time_slot,
      data.patient_note || ''
    );
  }
}