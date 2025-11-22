import express from "express";
import cors from "cors";
import { userDataRouter } from "./routes/Users/userData.js";
import { allCategoriesRouter } from "./routes/allCategories.js";
import { allProductsRouter } from "./routes/allProducts.js";
import { usersOrdersRouter } from "./routes/Users/userOrders.js";
import { productReviewsRouter } from "./routes/productReviews.js";
import { loginRouter } from "./routes/Users/login.js";
import { productByIdRouter } from "./routes/productById.js";
import { cheapAndTopProductsRouter } from "./routes/cheapAndTopProducts.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { searchProductRouter } from "./routes/Products/searchProducts.js";

const app = express();

app.use((req, res, next) => {
  console.log(`>>> ${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(cookieParser())

app.use("/userData", userDataRouter);
app.use("/allCategories", allCategoriesRouter);
app.use("/allProducts", allProductsRouter);
app.use("/userOrders", usersOrdersRouter);
app.use("/productReviews", productReviewsRouter);
app.use("/login", loginRouter);
app.use("/productById", productByIdRouter)
app.use("/cheapAndTopProducts", cheapAndTopProductsRouter)
app.use("/searchProduct", searchProductRouter)

export { app };
