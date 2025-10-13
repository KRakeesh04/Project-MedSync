import type { Express } from "express";
import authorizeRoles from "../auth/auth.js";
import {getAllDoctors,getDoctorByID} from "../handlers/doctor.handler.js"
import { getAllDoctorAppointments } from "../handlers/doctor.appointment.handler.ts";
import { getAllDoctorPatientsHistory } from "../handlers/doctor.patients.history.handler.ts";
import { getAllDoctorSpecialities } from "../handlers/doctor.speciality.handler.ts";
import { deleteUser, getDeletedUsers, getUsers, restoreUser, updateUser } from "../handlers/user.handler.ts";
import { patientSignup, staffSignup, userLogin, validateUser } from "../handlers/auth.handler.ts";
import { getAllBranchNames, getBranches, updateBranchByID } from "../handlers/branch.handler.ts";
import { getLogsForPagination } from "../handlers/log.handler.ts";
import { dischargePatientByID, getPatients, updateCurrentPatientDetails } from "../handlers/patient.handler.ts";
import { getAllStaff, updateStaffByID } from "../handlers/staff.handler.ts";

import { addDoctor } from "../handlers/doctor.handler.js"; // add new doctor button
import { getAllBranches } from "../handlers/branch.handler.js";
// Add this import
import { getAllSpecialties, addSpecialty } from "../handlers/speciality.handler.ts";

export const HttpMethod = {
	GET    : "GET",
	POST   : "POST",
	PUT    : "PUT",
	DELETE : "DELETE",
};

export const Role = {
	SUPER_ADMIN: 			"Super_Admin",
	BRANCH_MANAGER: 	"Branch_Manager",
	DOCTOR: 					"Doctor",
	ADMIN_STAFF: 			"Admin_Staff",
	NURSE: 						"Nurse",
	RECEPTIONIST: 		"Receptionist",
	BILLING_STAFF: 		"Billing_Staff",
	INSURANCE_AGENT:	"Insurance_Agent",
	PATIENT: 					"Patient",
	PUBLIC: 					"Public",		// open access 
	// to group the user related roles those who have access to login to the system
	USER: 						"User",
	// to group the medical related staff
	MEDICAL_STAFF: 		"Medical_Staff",
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
	//doctors router
	{ path: "/doctors",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getAllDoctors },
	{ path: "/doctors/:id",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getDoctorByID},
	{ path: "/doctors-appointments",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getAllDoctorAppointments},
	{ path: "/doctors-patients-history",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getAllDoctorPatientsHistory},
	{ path: "/doctors-specialities",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getAllDoctorSpecialities},
	{ path: "/doctors",AccessibleBy: availableForRoles([Role.PUBLIC]),method: HttpMethod.POST,handler: addDoctor}, //add new doctor button
// 	{ path: "/branches",AccessibleBy: availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler: getAllBranches},
	{ path: "/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllSpecialties },
	{ path: "/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: addSpecialty },
	{ path: "/users/inactive", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDeletedUsers },
	{ path: "/user/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateUser },
	{ path: "/user/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.DELETE, handler: deleteUser },
	{ path: "/user/restore/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: restoreUser },

	// branches router
	{ path: "/all-branches", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllBranchNames },
	{ path: "/branches", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getBranches },
	{ path: "/branch/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getBranches },
	{ path: "/branch/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateBranchByID },

	// patients router
	{ path: "/patients", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatients },
	{ path: "/patient/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateCurrentPatientDetails },
	{ path: "/patient/discharge/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: dischargePatientByID },

	// staff router
	{ path: "/staff", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllStaff },
	{ path: "/staff/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateStaffByID },

	// logs router
	{ path: "/logs", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getLogsForPagination },	
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

