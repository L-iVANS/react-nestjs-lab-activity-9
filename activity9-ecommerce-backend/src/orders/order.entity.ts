import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderId: string; // ORD-YYYYMMDD-XXXXX format

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column('json')
  items: Array<{
    name: string;
    price: number;
    qty: number;
  }>;

  @Column('json')
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column()
  paymentMethod: string; // 'credit-card', 'debit-card', 'gcash'

  @Column({ default: 'Pending Payment' })
  status: string; // 'Pending Payment', 'Paid', 'Payment Failed', 'Completed', 'Cancelled'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
