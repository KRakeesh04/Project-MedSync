import e from "express";
import sql from "../db/db.ts";

export interface appointment {
    appointment_id: number;
    patient_id: number;
    doctor_id: number;
    date: string;
    time_slot: string;
    name: string;
    status: string;
}

export interface DoctorAppointment {
    appointment_id: number;
    doctor_id: number;
    name: string;           // doctor name
    date: string;
    time_slot: string;
    status: string;
}

export interface getAppointmentsByDoctorId {
    appointment_id: number;
    name: number;
    patient_note: string;
    date: string;
    time_slot: string;
    status: string;
}

export interface getAppointmentsByDoctorIdCount {
    total_appointments: number;
}

export const getAppointmentsbyPatientId = async (patientId: number): Promise<appointment[]> => {
    try {
        const [rows] = await sql.query("CALL get_appointments_by_patient_id(?)", [patientId]);
        return (rows as any)[0] as appointment[];
    } catch (error) {
        console.error("Error fetching appointments by patient id:", error);
        throw error;
    }
};

export const getMonthlyAppointmentCounts = async (startDate: string, endDate: string, status: string): Promise<{ month: string; count: number }[]> => {
    try {
        const [rows] = await sql.query("CALL get_monthly_appointment_counts(?, ?, ?)", ['2025-01-01', '2025-12-31', null]);
        return (rows as any)[0] as { month: string; count: number }[];
    } catch (error) {
        console.error("Error fetching monthly appointment counts:", error);
        throw error;
    }
};

export const getDoctorsAppointments = async (count: number,
    offset: number): Promise<DoctorAppointment[]> => {
    try {
        const [rows] = await sql.query("CALL get_doctors_appointments(?, ?)", [count, offset]);
        return (rows as any)[0] as DoctorAppointment[];
    } catch (error) {
        console.error("Error fetching doctor's appointments:", error);
        throw error;
    }

};

export const getDoctorsAppointmentsCount = async (): Promise<number> => {
    try {
        const [rows]: any = await sql.query("CALL get_appointments_count()");
        return rows[0][0].total_count;
    } catch (error) {
        console.error("Error fetching doctor's appointments count:", error);
        throw error;
    }
};

export const getAppointmentsByDoctorId = async (doctorId: number): Promise<[getAppointmentsByDoctorId]> => {
    try {
        const [rows] = await sql.query("CALL get_appointments_by_doctor_id(?)", [doctorId]);
        return (rows as any)[0] as [getAppointmentsByDoctorId];
    } catch (error) {
        console.error("Error fetching doctor's appointments:", error);
        throw error;
    }
};

export const getAppointmentsByDoctorIdCount = async (doctorId: number): Promise<number> => {
    try {
        const [rows]: any = await sql.query("CALL get_appointments_by_doctor_id_count(?)", [doctorId]);
        return rows[0][0].total_appointments;
    } catch (error) {
        console.error("Error fetching doctor's appointments count:", error);
        throw error;
    }
};