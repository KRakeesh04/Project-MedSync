import type { Request, Response } from "express";
import { deleteUserById, getActiveUserCount, getAllDeletedUser, getAllUser, getInActiveUserCount, getUserById, restoreUserById, updateUserById } from "../models/user.model.ts";
import type { User } from "../models/user.model.ts";



export const getUsers = async (req: Request, res: Response) => {
  const { count, offset } = req.query;
  try {
    const users: User[] = await getAllUser(Number(count) || 100, Number(offset) || 0);
    if (users.length < 1) {
      res.status(404).json({ error: "Users not found" });
    }
    const user_count: Number = await getActiveUserCount();
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
  const { role, branch_id, is_approved } = req.body;
  const { id } = req.params;
  try {
    const usr = await getUserById(Number(id));
    if (!usr) {
      res.status(404).json({ error: "Users not found" });
    } else {
      await updateUserById(
        usr.user_id,
        usr.username,
        usr.password_hash,
        String(role),
        Number(branch_id),
        Boolean(is_approved));
    }
    return res.json({ message: "User updated successfully" });
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