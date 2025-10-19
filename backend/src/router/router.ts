import type { Express } from "express";
import authorizeRoles from "../auth/auth.js";
import { addNewDoctor, getAllDoctorsForPagination, getAllDoctorSpecialities, getDoctorDetailsByID, getDoctorsWithSpecialities, assignDoctorSpeciality, getAllDoctorsNamesHandler } from "../handlers/doctor.handler.js"
import { deleteUser, getDeletedUsers, getUsers, restoreUser, updateUser } from "../handlers/user.handler.ts";
import { patientSignup, staffSignup, userLogin, validateUser } from "../handlers/auth.handler.ts";
import { createNewBranch, getAllBranchNames, getBranches, updateBranchByID } from "../handlers/branch.handler.ts";
import { getLogsForPagination } from "../handlers/log.handler.ts";
import { dischargePatientByID, getPatientDetailsByID, getPatients, updateCurrentPatientDetails } from "../handlers/patient.handler.ts";
import { getAllStaff, updateStaffByID } from "../handlers/staff.handler.ts";
import { addNewSpecialty, getAllSpecialties } from "../handlers/speciality.handler.ts";
import { getSpecialityNames } from "../handlers/speciality.handler.ts";

import { checkServiceCodeHandler, createTreatmentHandler, getTreatmentsHandler } from "../handlers/treatment.handler.ts";
import { getMedicalHistoriesByPatientHandler, getMedicalHistoriesHandler } from "../handlers/medicalhistory.handler.ts";
import { getMedicationsByPatientHandler, getMedicationsHandler } from "../handlers/medication.handlers.ts";

import {
	createNewBillingPayment,
	updateCurrentBillingPayment,
	deleteBillingPaymentById,
	getBillingPayment,
	getAllBillingPaymentsHandler,
	getBillingPaymentsByInvoice
} from "../handlers/billing_payment.handler.ts";

import {
	createNewBillingInvoice,
	updateCurrentBillingInvoiceByPayment,
	deleteBillingInvoiceById,
	getAllBillingInvoicesHandler,
	getAllOutstandingBillsHandler
} from "../handlers/billing_invoice.handler.ts";
import { getAppointmentsbyPatientIdHandler } from "../handlers/appointment.handler.ts";


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
	{ path: "/doctors/specialities/overview", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDoctorsWithSpecialities },
	{ path: "/doctors/specialities/assign", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: assignDoctorSpeciality },
	{ path: "/doctors/names", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllDoctorsNamesHandler },

	// speciality router
	{ path: "/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllSpecialties },
	{ path: "/specialities/names", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getSpecialityNames },
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
	{ path: "/patient/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatientDetailsByID },

	// staff router
	{ path: "/staff", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllStaff },
	{ path: "/staff/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateStaffByID },

	// logs router
	{ path: "/logs", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getLogsForPagination },

	//treatments router
	{ path: "/treatments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getTreatmentsHandler },
	{ path: "/treatments/check-service-code", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: checkServiceCodeHandler },
	{ path: "/treatments/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: createTreatmentHandler },

	//medical history router
	{ path: "/medical-histories", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicalHistoriesHandler },
	{ path: "/medical-histories/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicalHistoriesByPatientHandler },

	//medication router
	{ path: "/medications", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicationsHandler },
	{ path: "/medications/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicationsByPatientHandler },

	// billing payment router
	{ path: "/billing-payment", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: createNewBillingPayment },
	{ path: "/billing-payment/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateCurrentBillingPayment },
	{ path: "/billing-payment/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.DELETE, handler: deleteBillingPaymentById },
	{ path: "/billing-payment/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getBillingPayment },
	{ path: "/billing-payments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllBillingPaymentsHandler },
	{ path: "/billing-payments/invoice/:invoice_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getBillingPaymentsByInvoice },

	// billing invoice router
	{ path: "/billing-invoice", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: createNewBillingInvoice },
	{ path: "/billing-invoice/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateCurrentBillingInvoiceByPayment },
	{ path: "/billing-invoice/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.DELETE, handler: deleteBillingInvoiceById },
	{ path: "/outstanding-bills", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllOutstandingBillsHandler },
	{ path: "/billing-invoices", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllBillingInvoicesHandler },

	//appointment router
	{ path: "/patient/appointments/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAppointmentsbyPatientIdHandler }
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

