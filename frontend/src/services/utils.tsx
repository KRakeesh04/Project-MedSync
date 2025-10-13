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