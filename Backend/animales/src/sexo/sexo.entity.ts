import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Animal } from "src/animal/animal.entity";

@Entity('sexo')
export class Sexo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // Macho o Hembra

  @OneToMany(() => Animal, animal => animal.sexo)
  animales: Animal[];
}
