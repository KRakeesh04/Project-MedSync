import sql from "../db/db.ts";

export const Actions = [
  {
    action_id: 1,
    action: "CREATE",
  },
  {
    action_id: 2,
    action: "UPDATE",
  },
  {
    action_id: 3,
    action: "DELETE",
  },
  {
    action_id: 4,
    action: "VIEW",
  },
]

export const createLog = async (
  usr_id: number,
  usr_role: string,
  action_id: number,
  table_name: string,
  record_id: string,
  details: string,
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_log(?, ?, ?, ?, ?, ?)",
      [usr_id, usr_role, action_id, table_name, record_id, details]
    );
  } catch (error) {
    console.error("Error creating user contact:", error);
    throw error;
  }
};