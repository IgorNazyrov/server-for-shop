import { Router, Request, Response } from "express";
import pool from "../../db/index.js";
import {
  GET_ORDERS,
  GET_ORDERS_WITH_ITEMS,
} from "../../db/SQL-queries/orders/get_orders.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;

    if (!user_id || isNaN(Number(user_id))) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orderResult = await pool.query(GET_ORDERS, [user_id]);

    const orderWithItems = await Promise.all(
      orderResult.rows.map(async (order) => {
        const itemsResult = await pool.query(GET_ORDERS_WITH_ITEMS, [order.id]);
        return { ...order, items: itemsResult };
      })
    );

    if (orderWithItems.length === 0) {
      return res.json([]);
    }

    res.json(orderWithItems);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("GET user orders error: ", err.message);
      return res.status(500).json({
        error: "Failed to fetch user orders",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const user_id = req.body.user_id;

    if (!user_id || isNaN(Number(user_id))) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    
  } catch (err) {}
});

export const usersOrdersRouter = router;
