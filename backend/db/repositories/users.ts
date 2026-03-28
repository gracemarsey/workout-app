import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { InsertUser } from "../schema/users";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const getUsers = () => db.select().from(users).all();

export const getUser = async (username: string) => {
  const resp = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .execute();
  return resp.length ? resp[0] : null;
};

export const insertUser = async (user: InsertUser) => {
  // hash password
  const password = await bcrypt.hash(user.password, saltRounds);

  return db
    .insert(users)
    .values({ ...user, password })
    .execute();
};
