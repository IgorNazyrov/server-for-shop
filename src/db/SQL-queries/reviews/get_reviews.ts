export const GET_REVIEW = `
  SELECT * FROM product_reviews
  WHERE product_id = $1
  ORDER BY created_at DESC
`