import "reflect-metadata"
import { myDataSource } from "./data-source";
import { importProducts } from "./utils/importProducts";

async function main() {
  try {
    await myDataSource.initialize();
    await importProducts()
    await myDataSource.destroy()
  } catch (err) {
    console.error('Fatal error:', err)
    process.exit(1)
  }
}

main()