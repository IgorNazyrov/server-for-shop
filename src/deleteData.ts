import { myDataSource } from "./data-source";

async function deleteData() {
  await myDataSource.initialize();

  await myDataSource.query(`TRUNCATE TABLE products RESTART IDENTITY CASCADE`);
  await myDataSource.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
  await myDataSource.destroy();
}

deleteData();
