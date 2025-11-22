import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { createHmac, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/",ensureAuthenticated, async (req, res) => {
    const user = req.user;
    return res.json({ user });
});

router.patch("/",ensureAuthenticated, async (req, res) => {

    const { name } = req.body;
    await db.update(usersTable).set({ name }).where(eq(usersTable.id, user.id));
    return res.json({ status: "success" });
});

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const [existingUser] = await db
        .select({ email: usersTable.email })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    if (existingUser) {
        return res.status(400).json({ error: `user with email ${email} already exists` });
    }

    const salt = randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

    const [user] = await db
        .insert(usersTable)
        .values({
            name,
            email,
            password: hashedPassword,
            salt,
        })
        .returning({
            id: usersTable.id,
        });

    return res.status(201).json({ status: `success`, data: { userID: user.id } });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [existingUser] = await db
        .select({
            id: usersTable.id,
            email: usersTable.email,
            name: usersTable.name,
            salt: usersTable.salt,
            role: usersTable.role,
            password: usersTable.password,
        })
        .from(usersTable)
        .where((table) => eq(table.email, email)); //table refers from .from()

    if (!existingUser) {
        return res.status(404).json({ error: `user with email ${email} does not exists` });
    }

    const salt = existingUser.salt;
    const existingHash = existingUser.password;

    const newHash = createHmac("sha256", salt).update(password).digest("hex");

    if (newHash !== existingHash) {
        return res.status(400).json({ error: `Incorrect password!` });
    }

    //Generate a token using jwt
    const payload = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : '1m'})
    return res.json({ status: 'success', token: `${token}` })
});

export default router;
