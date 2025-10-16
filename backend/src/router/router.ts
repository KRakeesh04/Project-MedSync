import type { Express } from "express";
import authorizeRoles from "../auth/auth.js";
import { addNewDoctor, getAllDoctorsForPagination, getAllDoctorSpecialities, getDoctorDetailsByID } from "../handlers/doctor.handler.js"
import { deleteUser, getDeletedUsers, getUsers, restoreUser, updateUser } from "../handlers/user.handler.ts";
import { patientSignup, staffSignup, userLogin, validateUser } from "../handlers/auth.handler.ts";
import { createNewBranch, getAllBranchNames, getBranches, updateBranchByID } from "../handlers/branch.handler.ts";
import { getLogsForPagination } from "../handlers/log.handler.ts";
import { dischargePatientByID, getPatients, updateCurrentPatientDetails } from "../handlers/patient.handler.ts";
import { getAllStaff, updateStaffByID } from "../handlers/staff.handler.ts";
import { addNewSpecialty, getAllSpecialties } from "../handlers/speciality.handler.ts";

import { checkServiceCodeHandler, createTreatmentHandler, getAllTreatmentsHandler } from "../handlers/treatment.handler.ts";
import { getMedicalHistoryHandler } from "../handlers/medicalhistory.handler.ts";
import { getAllMedicationsHandler, getMedicationsByPatientHandler } from "../handlers/medication.handlers.ts";
import { createNewInsuranceType, getAllInsuranceTypeNames, getInsuranceTypes, updateInsuranceTypeByID } from "../handlers/insurance.handler.ts";

export const HttpMethod = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
};

export const Role = {
	SUPER_ADMIN: "Super_Admin",
	BRANCH_MANAGER: "Branch_Manager",
	DOCTOR: "Doctor",
	ADMIN_STAFF: "Admin_Staff",
	NURSE: "Nurse",
	RECEPTIONIST: "Receptionist",
	BILLING_STAFF: "Billing_Staff",
	INSURANCE_AGENT: "Insurance_Agent",
	PATIENT: "Patient",
	PUBLIC: "Public",

	// special roles to group the common roles
	USER: "User",
	MEDICAL_STAFF: "Medical_Staff",
};

interface Route {
	path: string;
	AccessibleBy: string[];
	method: string;
	handler: Function;
}

var routes: Route[] = [
	// authentication router
	{ path: "/auth/sign-in", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: userLogin },
	{ path: "/auth/sign-up/staff", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: staffSignup },
	{ path: "/auth/sign-up/patient", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: patientSignup },
	{ path: "/auth/validate", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: validateUser },

	// users router
	{ path: "/users/active", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getUsers },
	{ path: "/users/inactive", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDeletedUsers },
	{ path: "/user/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateUser },
	{ path: "/user/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.DELETE, handler: deleteUser },
	{ path: "/user/restore/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: restoreUser },

	//doctors router
	{ path: "/doctors", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllDoctorsForPagination },
	{ path: "/doctors/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDoctorDetailsByID },
	{ path: "/doctors/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: addNewDoctor },
	{ path: "/doctors/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllDoctorSpecialities },

	// speciality router
	{ path: "/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllSpecialties },
	{ path: "/specialities/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: addNewSpecialty },

	// branches router
	{ path: "/all-branches", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllBranchNames },
	{ path: "/branches", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getBranches },
	{ path: "/branchs/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: createNewBranch },
	{ path: "/branchs/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateBranchByID },

	// patients router
	{ path: "/patients", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatients },
	{ path: "/patient/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateCurrentPatientDetails },
	{ path: "/patient/discharge/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: dischargePatientByID },

	// staff router
	{ path: "/staff", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllStaff },
	{ path: "/staff/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateStaffByID },

	// logs router
	{ path: "/logs", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getLogsForPagination },
	
	//treatments router
	{path: "/treatments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler:getAllTreatmentsHandler },
	{path: "/treatments/check-service-code", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler:checkServiceCodeHandler },
	{path: "/treatments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler:createTreatmentHandler },

	//medical history router
	{path: "/medical-histories", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler:getMedicalHistoryHandler },
	
	//medication router
	{ path: "/medications", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllMedicationsHandler },
	{ path: "/medications/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicationsByPatientHandler },

	//insurance router
	{ path: "/all-insurance-types", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllInsuranceTypeNames },
	{ path: "/insurance-types", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getInsuranceTypes },
	{ path: "/insurance-types/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: createNewInsuranceType },
	{ path: "/insurance-types/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: updateInsuranceTypeByID }

];


export const MapRouters = (app: Express) => {
	for (const route of routes) {
		switch (route.method) {
			case HttpMethod.GET:
				app.get(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
			case HttpMethod.POST:
				app.post(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
			case HttpMethod.PUT:
				app.put(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
			case HttpMethod.DELETE:
				app.delete(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
		}
	}
};


function availableForRoles(roles: string[]): string[] {
	const allRoles = Object.values(Role);
	let result: Set<string> = new Set();

	for (const role of roles) {
		if (role === Role.USER) {
			for (const r of allRoles) {
				if (r !== Role.USER || r !== Role.PUBLIC || r !== Role.MEDICAL_STAFF) {
					result.add(r);
				}
			}
			break;
		} else if (role === Role.MEDICAL_STAFF) {
			[
				Role.RECEPTIONIST,
				Role.NURSE,
				Role.DOCTOR,
				Role.ADMIN_STAFF,
				Role.BRANCH_MANAGER,
				Role.SUPER_ADMIN
			].forEach(r => result.add(r));
		} else if (role === Role.RECEPTIONIST) {
			[
				Role.RECEPTIONIST,
				Role.ADMIN_STAFF,
				Role.BRANCH_MANAGER,
				Role.SUPER_ADMIN
			].forEach(r => result.add(r));
		} else if (
			role === Role.ADMIN_STAFF ||
			role === Role.DOCTOR ||
			role === Role.NURSE ||
			role === Role.BILLING_STAFF ||
			role === Role.INSURANCE_AGENT
		) {
			[
				role,
				Role.BRANCH_MANAGER,
				Role.SUPER_ADMIN
			].forEach(r => result.add(r));
		} else {
			result.add(role);
		}
	}

	result.add(Role.SUPER_ADMIN);

	return Array.from(result);
}

