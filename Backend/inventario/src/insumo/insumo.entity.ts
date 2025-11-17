// En: inventario-api/src/insumo/insumo.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CategoriaInsumo } from 'src/categoria-insumo/categoria-insumo.entity';

@Entity('insumo')
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string; 

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 0 })
  stock: number; 

  @Column({ type: 'varchar', length: 50 })
  unidadMedida: string; 

  @Column({
    type: 'jsonb',
    nullable: true,
    default: () => "'{}'", 
  })
  atributos: any; 

  @ManyToOne(() => CategoriaInsumo, (categoria) => categoria.insumos, { 
    eager: true, 
    nullable: false 
  })
  categoria: CategoriaInsumo;
}