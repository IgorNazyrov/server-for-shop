import { myDataSource } from "../data-source";
import { Product } from "../entity/Product.entity";
import * as productsData from "../embeddedData/productsData.json";
import { importUsers } from "./importUsers";
import { Review } from "../entity/Review.entity";

async function importProducts() {
  const productRepository = myDataSource.getRepository(Product);
  const reviewsRepository = myDataSource.getRepository(Review);

  // Create products

  for (const productData of productsData.products) {
    const product = new Product();
    product.title = productData.title;
    product.description = productData.description;
    product.brand = product.brand;
    const existingProduct = await productRepository.findOne({
      where: {
        title: productData.title,
        description: productData.description,
        ...(productData.brand ? { brand: productData.brand } : {}),
      },
    });
    if (existingProduct) {
      console.log(`Product ${productData.title} already exist, skipping...`);
      continue;
    }
    product.price = productData.price;
    product.category = productData.category;
    product.discountPercentage = productData.discountPercentage;
    product.rating = productData.rating;
    product.stock = productData.stock;
    product.tags = productData.tags;
    product.weight = productData.weight;
    product.dimensions = {
      depth: productData.dimensions.depth,
      height: productData.dimensions.height,
      width: productData.dimensions.width,
    };
    product.warrantyInformation = productData.warrantyInformation;
    product.shippingInformation = productData.shippingInformation;
    product.availabilityStatus = productData.availabilityStatus;

    // Create users

    const user = await importUsers(
      productData.reviews[0].reviewerName,
      productData.reviews[0].reviewerEmail
    );

    product.returnPolicy = productData.returnPolicy;
    product.minimumOrderQuantity = productData.minimumOrderQuantity;
    product.meta = {
      createdAt: productData.meta.createdAt,
      updatedAt: productData.meta.updatedAt,
      barcode: productData.meta.barcode,
      qrCode: productData.meta.qrCode,
    };
    product.images = productData.images;
    product.thumbnail = productData.thumbnail;
    if (typeof user !== "undefined") {
      product.seller = user;
    }

    await productRepository.save(product);

    // Create review

    if (productData.reviews && productData.reviews.length > 0 && user) {
      for (const reviewData of productData.reviews) {
        const review = new Review();
        review.product = product;
        review.user = user;
        review.rating = reviewData.rating;
        review.comment = reviewData.comment;
        review.createdAt = new Date(reviewData.date);
        review.isApproved = true;

        await reviewsRepository.save(review);
      }
    }
  }

  console.log("import finished");
}

export { importProducts };
