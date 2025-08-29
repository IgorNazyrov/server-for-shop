export const GET_ORDERS = `
  SELECT * FROM orders
  WHERE user_id = $1
  ORDER BY order_date DESC
`;

export const GET_ORDERS_WITH_ITEMS = `
  SELECT * FROM order_items
  WHERE order_id = $1
`;
