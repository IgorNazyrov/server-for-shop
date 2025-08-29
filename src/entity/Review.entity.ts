import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Product } from './Product.entity.js';
import { User } from './User.entity.js';


@Entity("product_reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne("Product", "reviews", { 
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({name: "product_id"})
  product: Product;

  @ManyToOne(() => User,  { 
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({name: "user_id"})
  user: User;

  @Column({ 
    type: 'decimal', 
    precision: 2, 
    scale: 1,
    nullable: false
  })
  rating: number;

  @Column({ 
    type: 'text', 
    nullable: true 
  })
  comment: string;

  @Column({ 
    name: 'created_at',
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false
  })
  createdAt: Date;

  @Column({ 
    name: 'is_approved',
    type: 'boolean',
    default: false
  })
  isApproved: boolean;
}