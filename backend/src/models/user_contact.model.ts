import sql from "../db/db.ts";


export const createUserContact = async (
  usr_contact: string,
  contact_type: string,
  is_default: boolean,
  usr_id: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_user_contact(?, ?, ?, ?)",
      [usr_contact, contact_type, is_default, usr_id]
    );
  } catch (error) {
    console.error("Error creating user contact:", error);
    throw error;
  }
};