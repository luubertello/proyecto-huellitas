// En: donaciones-api/src/estado-logistica/estado-logistica.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DonacionInsumo } from '../donacion-insumo/donacion-insumo.entity';

@Entity('estado_donacion_insumo')
export class EstadoDonacionInsumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @OneToMany(() => DonacionInsumo, (donacion) => donacion.estadoInsumo)
  donacionesInsumos: DonacionInsumo[];
}