import { Router, Request, Response } from "express";
import pool from "../db/index.js";
import { GET_CATEGORIES } from "../db/SQL-queries/categories/get_categories.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(GET_CATEGORIES);

    res.json(rows.map((row) => row.category));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("GET allCategories error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch all categories",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

export const allCategoriesRouter = router;
