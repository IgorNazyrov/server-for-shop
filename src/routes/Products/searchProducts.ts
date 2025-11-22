import { Router, Request, Response } from "express";
import { myDataSource } from "../../data-source.js";
import { Product } from "../../entity/Product.entity.js";
import { ILike } from "typeorm";

const router = Router();

const productRepository = myDataSource.getRepository(Product);

router.get("/", async (req: Request, res: Response) => {
  const productName = req.query.productName || null;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  // console.log('Request query:', req.query);
  // console.log('Request productName:', req.query.productName);

  if (!productName) {
    return res.status(400).json({ error: "Empty query in searchProduct" });
  }

  try {
    const [products, totalCount] = await productRepository.findAndCount({
      where: [
        { title: ILike(`%${productName}%`) },
        { description: ILike(`%${productName}%`) },
      ],
      skip: offset,
      take: limit,
    });

    return {
      data: products,
      pagination: {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error("GET search products error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch search products",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

export const searchProductRouter = router;
