import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DonacionInsumo } from '../donacion-insumo/donacion-insumo.entity';

@Entity('estado_insumo')
export class EstadoInsumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @OneToMany(() => DonacionInsumo, (donacion) => donacion.estadoInsumo)
  donacionesInsumos: DonacionInsumo[];
}