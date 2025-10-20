import sql from "../db/db.ts";

export interface InsuranceTypes {
  insurance_id: number,
  insurance_type: string,
  insurance_period: string,
  claim_percentage: number,
  created_at: string
}


export const createInsuranceType = async (
  insurance_type: string,
  insurance_period: string,
  claim_percentage: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_insurance_type(?, ?, ?)",
      [insurance_type, insurance_period, claim_percentage]
    );
  } catch (error) {
    console.error("Error creating insurance type:", error);
    throw error;
  }
};

export const updateInsuranceType = async (
  insurance_id: number,
  insurance_type: string,
  insurance_period: string,
  claim_percentage: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL update_insurance_type(?, ?, ?, ?)",
      [insurance_id, insurance_type, insurance_period, claim_percentage]
    );
  } catch (error) {
    console.error("Error updating insurance type:", error);
    throw error;
  }
};

export const getInsuranceTypesForPagination = async (
  count: number,
  offset: number
): Promise<InsuranceTypes[]> => {
  try {
    const [rows] = await sql.query("CALL get_insurance_types_for_pagination(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as InsuranceTypes[];
  } catch (error) {
    console.error("Error in get all insurance types for pagination:", error);
    throw error;
  }
};

export const getAllInsuranceTypes = async (): Promise<InsuranceTypes[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_insurance_types()");
    return (rows as any)[0] as InsuranceTypes[];
  } catch (error) {
    console.error("Error in get all insurance types:", error);
    throw error;
  }
};


export const getInsuranceTypeCount = async (): Promise<number> => {
  try {
    const [rows]: any = await sql.query("CALL get_insurance_type_count()");
    return rows[0][0].insurance_count;
  } catch (error) {
    console.error("Error fetching insurance type count:", error);
    throw error;
  }
};
