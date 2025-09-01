import type { Express, Request, Response } from "express";
import authorizeRoles from "../auth/auth.js";


export const HttpMethod = {
	GET    : "GET",
	POST   : "POST",
	PUT    : "PUT",
	DELETE : "DELETE",
};

export const Role = {
	SUPER_ADMIN		: "SUPER_ADMIN",
	BRANCH_MANAGER	: "BRANCH_MANAGER",
	DOCTOR			: "DOCTOR",
	ADMIN_STAFF		: "ADMIN_STAFF",
	NURSE			: "NURSE",
	RECEPTIONIST	: "RECEPTIONIST",
	BILLING_STAFF	: "BILLING_STAFF",
	INSURANCE_AGENT	: "INSURANCE_AGENT",
	PATIENT			: "PATIENT",
	PUBLIC			: "PUBLIC",		// open access 
	// to group the user related roles those who have access to login to the system
	USER			: "USER",
	// to group the medical related staff
	MEDICAL_STAFF	: "MEDICAL_STAFF",
};

interface Route {
	path: string;
	AccessibleBy: string[];
	method: string;
	handler: Function;
}

var routes: Route[] = [
	// example for adding a new route
	{ path: "/users", AccessibleBy: availableForRoles([]), method: HttpMethod.GET, handler: () => {} },

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

