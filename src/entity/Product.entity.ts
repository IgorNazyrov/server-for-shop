import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User.entity.js";
import { Review } from "./Review.entity.js";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar", {length: 100 })
  title: string
  
  @Column({ type: 'text', nullable: true})
  description: string
  @Column({ 
    type: 'enum',
    enum: [
      'beauty', 'fragrances', 'furniture', 'groceries', 'skincare',
      'electronics', 'home', 'kitchen', 'fitness', 'health',
      'wearables', 'transport', 'supplements', 'smart home', 'baby',
      'automotive', 'office', 'garden', 'travel', 'outdoors'
    ],
    nullable: true
  })
  category: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'discount_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column("text", { array: true, nullable: true })
  tags: string[];

  @Column("varchar", { length: 100, nullable: true })
  brand: string;

  @Column("varchar", { unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column('jsonb', { nullable: true })
  dimensions: {
    depth: number;
    height: number;
    width: number;
  };

  @Column({ name: 'warranty_information', type: 'text', nullable: true })
  warrantyInformation: string;

  @Column({ name: 'shipping_information', type: 'text', nullable: true })
  shippingInformation: string;

  @Column({ name: 'availability_status', type: 'text', nullable: true })
  availabilityStatus: string;

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @Column({ name: 'return_policy', type: 'text', nullable: true })
  returnPolicy: string;

  @Column("int", { name: 'minimum_order_quantity' })
  minimumOrderQuantity: number;

  @Column('jsonb', { nullable: true })
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };

  @Column('text', { array: true })
  images: string[];

  @Column("varchar", { length: 500, nullable: true })
  thumbnail: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;
}
