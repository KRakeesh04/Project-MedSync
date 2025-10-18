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
};

export function createTimer(ms: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

export function toNormalTimestamp(isoString: string): string {
	if (!isoString) return "";
	const date = new Date(isoString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatRole(role: string): string {
	if (!role) return "";

	return role
		.toLowerCase()
		.replace(/_/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toMySQLDate(dateStr: string): string {
	if (!dateStr) return "";

	const [day, month, year] = dateStr.split("/");
	const d = day.padStart(2, "0");
	const m = month.padStart(2, "0");

	return `${year}-${m}-${d}`; // YYYY-MM-DD
}

export function formatSalary(amount: number): string {
	return amount.toLocaleString("en-LK", {
		style: "currency",
		currency: "LKR",
		minimumFractionDigits: 2,
	});
}

export function formatDate(dateString: string): string {
	if (!dateString) return "";
	const date = new Date(dateString);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function calculateAge(nic: string | null, dob: string | null): string | null {
	if (!nic && !dob) return null;

	const today = new Date();

	// If DOB is provided, calculate directly from it
	if (dob) {
		const birth = new Date(dob);
		let years = today.getFullYear() - birth.getFullYear();
		let months = today.getMonth() - birth.getMonth();
		let days = today.getDate() - birth.getDate();

		if (days < 0) {
			months -= 1;
			const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
			days += prevMonth.getDate();
		}
		if (months < 0) {
			years -= 1;
			months += 12;
		}

		return `${years} years, ${months} months, ${days} days`;
	}

	// Else, calculate using NIC
	if (!nic) return null;
	nic = nic?.toUpperCase().trim();
	let year: number, dayOfYear: number;

	if (/^\d{12}$/.test(nic)) {
		// New NIC (12-digit): YYYYDDD...
		year = parseInt(nic.substring(0, 4), 10);
		dayOfYear = parseInt(nic.substring(4, 7), 10);
	} else if (/^\d{9}[VX]?$/.test(nic)) {
		// Old NIC (9-digit): YYDDDXXX[V/X]
		year = 1900 + parseInt(nic.substring(0, 2), 10);
		if (year + 100 <= today.getFullYear()) year += 100; // Adjust for 2000s births
		dayOfYear = parseInt(nic.substring(2, 5), 10);
	} else {
		return null;
	}

	if (dayOfYear > 500) dayOfYear -= 500;
	const birthDate = new Date(year, 0);
	birthDate.setDate(dayOfYear);

	let years = today.getFullYear() - birthDate.getFullYear();
	let months = today.getMonth() - birthDate.getMonth();
	let days = today.getDate() - birthDate.getDate();
	if (days < 0) {
		months -= 1;
		const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
		days += prevMonth.getDate();
	}
	if (months < 0) {
		years -= 1;
		months += 12;
	}
	return `${years} years, ${months} months, ${days} days`;
}



export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

