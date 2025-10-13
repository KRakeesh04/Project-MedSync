import type { Request, Response } from "express";
import { createUser, getUserByUsername, type User } from "../models/user.model.ts";
import { comparePasswords, hashPassword } from "../auth/hash.ts";
import { generateToken } from "../auth/token.ts";
import { Role } from "../router/router.ts";
import { createManager } from "../models/branch_manager.model.ts";
import { createDoctor } from "../models/doctor.model.ts";
import { createStaff } from "../models/staff.model.ts";
import { createPatient } from "../models/patient.model.ts";


export interface StaffData {
    fullname: string
    username: string
    email: string
    password: string
    phoneNo: string
    gender: string
    role: string
    branch: number
}

export interface PatientData {
    fullname: string
    nic: string
    username: string
    email: string
    password: string
    phoneNo: string
    emergencyContactNo: string
    DOB: string
    gender: string
    bloodType: string
    branch: number
    address: string
}


export const userLogin = async (req: Request, res: Response) => {
    let { username, password } = req.body;
    try {
        const user_DB: User | null = await getUserByUsername(String(username).trim());
        if (!user_DB) {
            return res.status(404).json({ error: "User not found" });
        }
        if (username !== user_DB.username) {
            res.status(401).json({ error: "Wrong username or password" });
        }else if (await comparePasswords(String(password), user_DB.password_hash)) {
            var token_string: string = generateToken({
                userId: String(user_DB.user_id),
                username: user_DB.username,
                role: user_DB.role
            });
            res.status(200).json({
                message: "Login Successfully",
                user: user_DB,
                token: token_string
            })
        } else {
            res.status(401).json({ error: "Wrong username or password" })
        }
    } catch (error) {
        console.error("Error in userLogin handler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const staffSignup = async (req: Request, res: Response) => {
    const data: StaffData = req.body;
    if (
        ![
            Role.ADMIN_STAFF,
            Role.BILLING_STAFF,
            Role.BRANCH_MANAGER,
            Role.DOCTOR,
            Role.INSURANCE_AGENT,
            Role.NURSE,
            Role.RECEPTIONIST,
            Role.SUPER_ADMIN,
        ].includes(data.role)) {
        res.status(400).json({ error: "Undefined staff role" });
        return;
    }
    const hashed_password: string = await hashPassword(data.password);
    const usr = await createUser(
        data.username,
        hashed_password,
        data.role,
        data.branch,
        false
    );
    if (!usr) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
    try {
        if (data.role === Role.SUPER_ADMIN) {
            // TODO: need to do something
        } else if (data.role === Role.BRANCH_MANAGER) {
            await createManager(
                usr.user_id,
                data.fullname,
                50000,
                data.gender
            );
        } else if (data.role === Role.DOCTOR) {
            await createDoctor(
                usr.user_id,
                data.fullname,
                data.gender,
                0,
                50000
            );
        } else if (
            data.role === Role.NURSE ||
            data.role === Role.ADMIN_STAFF ||
            data.role === Role.BILLING_STAFF ||
            data.role === Role.INSURANCE_AGENT ||
            data.role === Role.RECEPTIONIST
        ) {
            await createStaff(
                usr.user_id,
                data.fullname,
                data.role,
                data.gender,
                30000
            );
            // } else {
            //     res.status(400).json({ error: "Undefined staff role" })
        }

    } catch (error) {
        console.error("Error in staff create handler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const patientSignup = async (req: Request, res: Response) => {
    const data: PatientData = req.body;
    const hashed_password: string = await hashPassword(data.password);
    const usr = await createUser(
        data.username,
        hashed_password,
        Role.PATIENT,
        data.branch,
        true
    );
    if (!usr) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
    try {
        await createPatient(
            usr.user_id,
            data.fullname,
            data.gender,
            data.emergencyContactNo,
            data.nic,
            data.address,
            data.DOB,
            data.bloodType
        );
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const validateUser = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Success" })
}