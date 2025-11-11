import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { EstadoPago } from '../estado-pago/estado-pago.entity';

@Entity('donacion_monetaria')
export class DonacionMonetaria {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ default: false })
  esAnonimo: boolean;

  @Column({ type: 'varchar', nullable: true })
  metodoDePago: string;

  @Column({ type: 'int', nullable: true })
  userId: number; 

  @Column({ type: 'varchar', nullable: true })
  emailInvitado: string;

  // --- Relación con EstadoPago ---
  @ManyToOne(() => EstadoPago, (estado) => estado.donacionesMonetarias, { eager: true })
  estadoPago: EstadoPago;
}