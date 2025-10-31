import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Animal } from "../animal/animal.entity";
import { Especie } from "../especie/especie.entity";

@Entity('raza')
export class Raza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'Sin nombre' })
  nombre: string;

  @ManyToOne(() => Especie, especie => especie.razas)
  @JoinColumn({ name: 'especie_id' })
  especie: Especie;

  @OneToMany(() => Animal, animal => animal.raza)
  animales: Animal[];
}
