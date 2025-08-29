import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Animal } from "src/animal/animal.entity";

@Entity('especie')
export class Especie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Relaciones
  @OneToMany(() => Animal, animal => animal.especie)
  animales: Animal[];

  // Metodos
  getEspecie() {
    
  }
}