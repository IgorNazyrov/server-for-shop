import { Router, Request, Response } from "express";
import pool from "../../db/index.js";
import { GET_REVIEW } from "../../db/SQL-queries/reviews/get_reviews.js";
import { POST_REVIEW } from "../../db/SQL-queries/reviews/post_review.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { myDataSource } from "../../data-source.js";
import { Review } from "../../entity/Review.entity.js";

const router = Router();
const reviewsRepository = myDataSource.getRepository(Review)

router.get("/", async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;

    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const reviews = await reviewsRepository.find({
      where: productId,
      // order: by created
    } as any)
    // const { rows } = await pool.query(GET_REVIEW, [productId]);

    // if (rows.length === 0) {
    //   res.json([]);
    // }

    // res.json(rows);
    res.json(reviews);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("GET rewiews error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch reviews",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user?.userId

    if (!product_id || !user_id || !rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are requierd" });
    }

    if (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (!user_id) {
      return res.status(403).json({error: "Authentication required"})
    }

    await reviewsRepository.create()

    const { rows } = await pool.query(POST_REVIEW, [
      product_id,
      user_id,
      rating,
      comment,
    ]);

    res.status(201).json(rows);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Database error";

    console.error("POST review error: ", errorMessage);
    res.status(500).json({
      error: "Failed to add review",
      details: process.env.NODE_ENV === "development" ? errorMessage : null,
    });
  }
});

export const productReviewsRouter = router;
