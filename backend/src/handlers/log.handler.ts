import type { Request, Response } from "express";
import { getAllLogs, getLogsCount, type Log } from "../models/log.model.ts";


export const getLogsForPagination = async (req: Request, res: Response) => {
  const { count, offset } = req.query;
  try {
    const logs: Log[] = await getAllLogs(Number(count), Number(offset));
    if (logs.length < 1) {
      res.status(404).json({ error: "Logs not found" });
      return;
    }
    const logs_count: Number = await getLogsCount();
    if (logs_count == undefined) {
      console.log("error in finding the logs count, count = " + logs_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      logs_count: logs_count,
      logs: logs
    });
  } catch (error) {
    console.log("Error in getLogsForPagination handler: ", error)
    res.status(500).json({ error: "Internal Server Error" });
  };
};