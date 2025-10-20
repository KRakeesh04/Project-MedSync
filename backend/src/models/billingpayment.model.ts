import sql from "../db/db.ts";

export const getMonthlyRevenue = async (startDate: string, endDate: string): Promise<{ month: string; revenue: number }[]> => {
    try {
        const [rows] = await sql.query("CALL get_monthly_revenue(?, ?)", ['2025-01-01', '2025-12-31']);
        return (rows as any)[0] as { month: string; revenue: number }[];
    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        throw error;
    }
};