import { Insumo } from '../insumo/insumo.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categoria_insumo')
export class CategoriaInsumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string; 

  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[];
}