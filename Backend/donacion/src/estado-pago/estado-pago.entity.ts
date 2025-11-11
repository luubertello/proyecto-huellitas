import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DonacionMonetaria } from '../donacion-monetaria/donacion-monetaria.entity';

@Entity('estado_pago')
export class EstadoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @OneToMany(() => DonacionMonetaria, (donacion) => donacion.estadoPago)
  donacionesMonetarias: DonacionMonetaria[];
}