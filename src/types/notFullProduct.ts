export type NotFullProducts = NotFullProduct[]

export interface NotFullProduct {
  product_id: number;
  product_title: string;
  product_price: number;
  product_category: string;
  product_rating: number;
  product_images: string[];
  product_thumbnail: string;
  product_discountPercentage: number;
  reviewsCount: string; 
}