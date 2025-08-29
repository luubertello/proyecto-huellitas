import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Animal } from "src/animal/animal.entity";

@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Relaciones
  @OneToMany(() => Animal, animal => animal.estadoActual)
  animales: Animal[];

  // Metodos

  esEnAdopcion() {
    
  }
}