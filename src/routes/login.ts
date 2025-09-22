import { Router, Request, Response } from "express";
import pool from "../db/index.js";
import { POST_LOGIN } from "../db/SQL-queries/login/post_login.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const { sign } = jwt;

router.get("/", async (req: Request, res: Response) => {
  try {
    
  } catch(err) {

  }
})

router.post("/", async (req: Request, res: Response) => {
  try {
    console.log('Request:', req.body)
    
    const { email, password } = req.body;
    
    console.log('email and password:', email, password)

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    const { rows } = await pool.query(POST_LOGIN, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Incorrent email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrent email or password" });
    }

    const token = sign(
      { userId: user.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "3d", }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 259200000
    })

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      tokenSucces: true 
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("POST login error: ", err.message);
      res.status(500).json({
        error: "Failed to log in",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

export const loginRouter = router;
