export const GET_CATEGORIES = `
  SELECT DISTINCT category from products 
  ORDER BY category
`