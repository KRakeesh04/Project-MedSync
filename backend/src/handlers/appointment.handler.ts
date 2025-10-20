import type { Request, Response } from "express";
import { getAppointmentsByDoctorId, getAppointmentsByDoctorIdCount, getAppointmentsbyPatientId, getDoctorsAppointments, getDoctorsAppointmentsCount, getMonthlyAppointmentCounts } from "../models/appointment.model.ts";
import { type DoctorAppointment } from "../models/appointment.model.ts";
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