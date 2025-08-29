export const GET_PRODUCTS = `
  SELECT * FROM products
  WHERE category = $1
  ORDER BY created_at DESC
  LIMIT $2 OFFSET $3
`