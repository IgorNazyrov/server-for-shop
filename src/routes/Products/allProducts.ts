import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { myDataSource } from "../../data-source.js";
import { Product } from "../../entity/Product.entity.js";
import { NotFullProducts } from "../../types/notFullProduct.js";

const router = Router();
const productsRepository = myDataSource.getRepository(Product);

router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = req.query.categoriesNames;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    let categoriesArray: string[] = [];

    if (categories) {
      if (Array.isArray(categories)) {
        categoriesArray = categories as string[];
      } else if (typeof categories === "string") {
        categoriesArray = categories.split(",");
      }
    }

    const queryBuilder = productsRepository
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
      .groupBy(
        "product.id, product.title, product.price, product.category, product.rating, product.images, product.thumbnail, product.discountPercentage"
      )
      .orderBy("(product.meta->>'createdAt')::TIMESTAMP", "DESC")
      .offset(offset)
      .limit(limit);

    if (categoriesArray.length > 0) {
      queryBuilder.where("product.category IN (:...categories)", {
        categories: categoriesArray,
      });
    }

    const products: NotFullProducts = await queryBuilder.getRawMany();

    const countQueryBuilder = productsRepository.createQueryBuilder("product");

    const totalCount = await countQueryBuilder.getCount();

    const productsWithCount = products.map((product) => ({
      ...product,
      reviewsCount: parseInt(product.reviewsCount) || 0,
    }));

    res.json({
      data: productsWithCount,
      pagination: {
        total: totalCount,
        page: page,
        totalPages: Number(Math.ceil(totalCount / limit)),
        limit,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("GET all products error: ", err.message);
      res.status(500).json({
        error: "Failed to fetch all products",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      });
    }
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      category,
      dicount_Percentage,
      rating,
      stock,
      tags,
      brand,
      sku,
      weight,
      dimensions,
      waranty_information,
      shipping_information,
      availability_status,
      return_policy,
      minimum_order_quanity,
      meta,
      images,
      thumbnail,
      seller_id,
    } = req.body;

    if (!title || !price || !stock) {
      return res
        .status(400)
        .json({ error: "Title, price and stock are required" });
    } else {
      await productsRepository.save(req.body)
    }

    // const { rows } = await pool.query(POST_PRODUCT, [
    //   title,
    //   description,
    //   price,
    //   category,
    //   dicount_Percentage,
    //   rating,
    //   stock,
    //   tags,
    //   brand,
    //   sku,
    //   weight,
    //   dimensions,
    //   waranty_information,
    //   shipping_information,
    //   availability_status,
    //   return_policy,
    //   minimum_order_quanity,
    //   meta,
    //   images,
    //   thumbnail,
    //   seller_id,
    // ]);

    // res.status(201).json(rows[0]);
    res.status(201).json(req.body);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Database error";

    if (err && typeof err === "object" && "code" in err) {
      const pgError = err as { code: string; message: string };

      if (pgError.code === "23505") {
        return res.status(409).json({
          error: "Product with such data already exists",
          details:
            process.env.NODE_ENV === "development" ? pgError.message : null,
        });
      }

      if (pgError.code === "23514") {
        return res.status(400).json({
          error: "Invalid data",
          details:
            process.env.NODE_ENV === "development" ? pgError.message : null,
        });
      }
    }

    res.status(500).json({
      error: "Failed to add product",
      details: process.env.NODE_ENV === "development" ? errorMessage : null,
    });
  }
});

export const allProductsRouter = router;
