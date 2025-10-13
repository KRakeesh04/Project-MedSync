import type { Request, Response } from "express";
import { deleteUserById, getActiveUserCount, getAllDeletedUser, getAllUser, getInActiveUserCount, getUserById, restoreUserById, updateUserById } from "../models/user.model.ts";
import type { User } from "../models/user.model.ts";



export const getUsers = async (req: Request, res: Response) => {
  const { count, offset, role, branch } = req.query;
  try {
    if (!count || !offset || !role || !branch) {
      res.status(400).json({ error: "Params count, offset, role or branch undefined" });
      return;
    }
    const users: User[] = await getAllUser(Number(count), Number(offset), String(role), String(branch));
    if (users.length < 1) {
      res.status(404).json({ error: "Users not found" });
      return;
    }
    const user_count: Number = await getActiveUserCount(String(role), String(branch));
    if (user_count == undefined) {
      console.log("error in finding the user count, count = " + user_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      user_count: user_count,
      users: users
    });
  } catch (error) {
    console.error("Error in getUsers handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getDeletedUsers = async (req: Request, res: Response) => {
  const { count, offset } = req.query;
  try {
    const users: User[] = await getAllDeletedUser(Number(count) || 100, Number(offset) || 0);
    if (users.length < 1) {
      res.status(404).json({ error: "Users not found" });
      return;
    }
    const user_count: Number = await getInActiveUserCount();
    if (user_count == undefined) {
      console.log("error in finding the user count, count = " + user_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      user_count: user_count,
      users: users
    });
  } catch (error) {
    console.error("Error in getDeletedUsers handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  }
  const { role, branch_id, is_approved } = req.body;
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: "Param id undefined" });
      return;
    }
    const usr = await getUserById(Number(id));
    if (!usr) {
      res.status(404).json({ error: "Users not found" });
      return;
    } else {
      await updateUserById(
        usr.user_id,
        usr.username,
        usr.password_hash,
        String(role),
        Number(branch_id),
        Boolean(is_approved));
    }
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error in update user handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUserById(Number(id));
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in delete user handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const restoreUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await restoreUserById(Number(id));
    return res.json({ message: "User restored successfully" });
  } catch (error) {
    console.error("Error in restore user handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};