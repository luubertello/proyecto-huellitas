import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Animal } from "src/animal/animal.entity";
import { Especie } from "src/especie/especie.entity";

@Entity('raza')
export class Raza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Especie, especie => especie.razas)
  @JoinColumn({ name: 'especie_id' })
  especie: Especie;

  @OneToMany(() => Animal, animal => animal.raza)
  animales: Animal[];
}
