import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CambioEstado } from "src/cambioEstado/cambioEstado.entity";

@Entity('animal')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  especie: string;

  @Column()
  raza: string;

  @Column()
  fechaNacimiento: Date;

  @Column()
  descripcion: string;

  @Column()
  foto: string;
  
  // Relaciones
  @OneToMany(() => CambioEstado, cambio => cambio.animal)
  cambiosEstado: CambioEstado[];
  

}