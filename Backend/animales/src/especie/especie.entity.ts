import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Animal } from "src/animal/animal.entity";
import { Raza } from "src/raza/raza.entity";

@Entity('especie')
export class Especie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Relaciones
  @OneToMany(() => Animal, animal => animal.especie)
  animales: Animal[];

  @OneToMany(() => Raza, raza => raza.especie)
  razas: Raza[];

  // Metodos
  getEspecie() {
    
  }
}