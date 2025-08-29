import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.js";
import { allCategoriesRouter } from "./routes/allCategories.js";
import { allProductsRouter } from "./routes/allProducts.js";
import { usersOrdersRouter } from "./routes/userOrders.js";
import { productReviewsRouter } from "./routes/productReviews.js";
import { loginRouter } from "./routes/login.js";
import { productByIdRouter } from "./routes/productById.js";
import { cheapAndTopProductsRouter } from "./routes/cheapAndTopProducts.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { searchProductRouter } from "./routes/searchProducts.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser())

app.use("/users", usersRouter);
app.use("/allCategories", allCategoriesRouter);
app.use("/allProducts", allProductsRouter);
app.use("/userOrders", usersOrdersRouter);
app.use("/productReviews", productReviewsRouter);
app.use("/login", loginRouter);
app.use("/productById", productByIdRouter)
app.use("/cheapAndTopProducts", cheapAndTopProductsRouter)
app.use("/searchProduct", searchProductRouter)

export { app };
