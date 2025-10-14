import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const LOCAL_STORAGE__TOKEN = "token";
export const LOCAL_STORAGE__USER = "user";
export const LOCAL_STORAGE__USERNAME = "username";
export const LOCAL_STORAGE__ROLE = "role";
export const LOCAL_STORAGE__USER_ID = "user_id";

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
  date_of_birth: string
  gender: string
  bloodType: string
  branch: number
  address: string
}

export const signin = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/sign-in", {
      username,
      password,
    })
    const token = response.data.token
    const user = response.data.user
    localStorage.setItem(LOCAL_STORAGE__TOKEN, token)
    localStorage.setItem(LOCAL_STORAGE__USER, JSON.stringify(user))
    localStorage.setItem(LOCAL_STORAGE__USERNAME, user.username)
    localStorage.setItem(LOCAL_STORAGE__ROLE, user.role)
    localStorage.setItem(LOCAL_STORAGE__USER_ID, user.user_id)
    return true
  } catch (error: unknown) {
    console.error("Error logging in:", error)
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error
      }
      throw error.message
    }
    throw "Unknown error occurred"
  }
};

export const staffSignup = async (data: StaffData) => {
  try {
    const response = await axiosInstance.post("/auth/sign-up/staff", data)
    const message = response.data.message
    return message
  } catch (error: unknown) {
    console.error("Error in creating account:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
}

export const patientSignup = async (data: PatientData) => {
  try {
    const response = await axiosInstance.post("/auth/sign-up/patient", data)
    const message = response.data.message
    return message
  } catch (error: unknown) {
    console.error("Error in creating account:", error)
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error
      }
      throw error.message
    }
    throw "Unknown error occurred"
  }
}

export const validateToken = async () => {
  const response = await axiosInstance.get("/auth/validate")
  return response.data.message
}
