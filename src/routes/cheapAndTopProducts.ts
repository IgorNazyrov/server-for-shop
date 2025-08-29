import { Router, Request, Response } from "express";
import { myDataSource } from "../data-source.js";
import { Product } from "../entity/Product.entity.js";
import { NotFullProducts } from "../types/notFullProduct.js";

const router = Router();
const productsRepository = myDataSource.getRepository(Product);

router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 12, 30));

    const cheapProducts: NotFullProducts = await productsRepository
      .createQueryBuilder("product")
      .leftJoin("product.reviews", "reviews")
      .select([
        "product.id",
        "product.title",
        "product.price",
        "product.category",
        "product.rating",
        "product.images",
        "product.thumbnail",
        "product.discountPercentage",
        "COUNT(reviews.id) as reviewsCount",
      ])
      .where("product.discountPercentage IS NOT NULL")
      .andWhere("product.images IS NOT NULL")
      .andWhere("array_length(product.images, 1) > 0")
      .andWhere("product.images[1] != ''")
      .groupBy(
        "product.id, product.title, product.price, product.category, product.rating, product.images, product.thumbnail, product.discountPercentage"
      )
      .orderBy("product.discountPercentage", "DESC")
      .limit(limit)
      .getRawMany();

    const topProducts: NotFullProducts = await productsRepository
      .createQueryBuilder("product")
      .leftJoin("product.reviews", "reviews")
      .select([
        "product.id",
        "product.title",
        "product.price",
        "product.category",
        "product.rating",
        "product.images",
        "product.thumbnail",
        "product.discountPercentage",
        "COUNT(reviews.id) as reviewsCount",
      ])
      .where("product.rating IS NOT NULL")
      .andWhere("product.images IS NOT NULL")
      .andWhere("array_length(product.images, 1) > 0")
      .andWhere("product.images[1] != ''")
      .groupBy(
        "product.id, product.title, product.price, product.category, product.rating, product.images, product.thumbnail, product.discountPercentage"
      )
      .orderBy("product.rating", "DESC")
      .limit(limit)
      .getRawMany();

    const cheapWithReviews = cheapProducts.map((product) => ({
      ...product,
      reviewsCount: parseInt(product.reviewsCount) || 0,
    }));

    const topWithReviews = topProducts.map((product) => ({
      ...product,
      reviewsCount: parseInt(product.reviewsCount) || 0,
    }));

    res.json({
      cheapProducts: cheapWithReviews,
      topProducts: topWithReviews,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("GET cheap and top products error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch to cheap and top products",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

export const cheapAndTopProductsRouter = router;
