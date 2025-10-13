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
    action: "LOGIN",
  },
  {
    action_id: 5,
    action: "VIEW",
  },
]

export interface Log {
  log_id: number,
  user_id: number,
  user_role: string,
  action: string,
  table_name: string,
  record_id: number,
  time_stamp: string,
  details: string,
};

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
    console.error("Error creating new log:", error);
    throw error;
  }
};

export const getAllLogs = async (
  count: number,
  offset: number
): Promise<Log[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_logs(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as Log[];
  } catch (error) {
    console.error("Error fetching all logs:", error);
    throw error;
  }
};

export const getLogsCount = async (): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_logs_count()");
    return rows[0][0].log_count;
  } catch (error) {
    console.error("Error fetching count of logs:", error);
    throw error;
  }
};