export const GET_PRODUCTS_FOR_PAGINATION = `
  SELECT COUNT(*) FROM products WHERE ($1:: text IS NULL OR category = $1)
`