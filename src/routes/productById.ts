import { Router, Request, Response } from "express";
import { myDataSource } from "../data-source.js";
import { Product } from "../entity/Product.entity.js";

const router = Router();
const productRepository = myDataSource.getRepository(Product);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id)
    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ["reviews" ]
    });

    if (!product) {
      return res.status(404).json({error: "Product not found"})
    }

    res.json(product)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("GET product by id error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch product",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

export const productByIdRouter = router