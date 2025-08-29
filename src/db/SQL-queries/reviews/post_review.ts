export const POST_REVIEW = `
  INSERT INTO product_reviews (
  product_id,
  user_id,
  rating,
  comment
) VALUES (
  $1,
  $2,
  $3,
  $4
)
RETURNING *
`