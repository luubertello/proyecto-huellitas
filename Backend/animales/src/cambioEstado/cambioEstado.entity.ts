import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Animal } from "../animal/animal.entity";

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaHoraInicio: string;

  @Column()
  fechaHoraFin: string;

  // Relaciones
  
  @ManyToOne(() => Animal, animal => animal.cambiosEstado)
  animal: Animal;
}