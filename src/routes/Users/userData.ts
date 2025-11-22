import { Router, Request, Response } from "express";
import { hash } from "bcrypt";
import validator from "validator";
import { User } from "../../entity/User.entity.js";
import { myDataSource } from "../../data-source.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = Router();
const usersRepository = myDataSource.getRepository(User);
const { isEmail } = validator

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await usersRepository.findOne({
      where: {id: req.user?.userId}
    })

    if (!user) {
      return res.status(401).json({error: 'User not found or not registered'})
    }

    res.json({
      user: {
        id: user?.id,
        email: user?.email,
        userName: user?.username
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("GET users error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch users",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, username, password, } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password and email are required" });
    }

    const password_hash = await hash(password, 10);

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    if (password.length > 100) {
      return res.status(400).json({
        error: "Password must be less than 100 characters",
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ error: "Invalid format email" });
    }

    const existingUser = await usersRepository.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exist" });
    }

    const user = new User();
    user.username = username;
    user.passwordHash = password_hash;
    user.email = email;
    await usersRepository.save(user);

    res.status(201).json({
      username: user.username,
      email: user.email,
    });

    console.log(`New user registered: ${email}`)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Database error";

    console.error("POST users error: ", errorMessage);

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }
    res.status(500).json({
      error: "Failed to add user",
      details: process.env.NODE_ENV === "development" ? errorMessage : null,
    });
  }
});

export const  userDataRouter  = router;
