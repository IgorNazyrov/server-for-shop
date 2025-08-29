export const POST_PRODUCT = `
INSERT INTO products (
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
  seller_id
) VALUES (
  $1, $2, $3, $4, $5, 
  $6, $7, $8, $9, $10,
  $11, $12, $13, $14, $15,
  $16, $17, $18, $19, $20,
  $21
) 
RETURNING *
`;
