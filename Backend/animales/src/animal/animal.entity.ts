import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CambioEstado } from "../cambioEstado/cambioEstado.entity";
import { Especie } from "../especie/especie.entity";
import { Estado } from "../estado/estado.entity";
import { Raza } from "../raza/raza.entity";

@Entity('animal')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  sexo: string

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column()
  descripcion: string;

  @Column()
  foto: string;

  // Relaciones

  @ManyToOne(() => Raza, raza => raza.animales, { eager: true })
  @JoinColumn({ name: 'raza_id' })
  raza: Raza;

  @ManyToOne(() => Especie, especie => especie.animales, { eager: true })
  @JoinColumn({ name: 'especie_id' })
  especie: Especie;

  @ManyToOne(() => Estado, estadoActual => estadoActual.animales, { eager: true })
  @JoinColumn({ name: 'estadoActual_id' })
  estadoActual: Estado;

  @OneToMany(() => CambioEstado, cambio => cambio.animal)
  cambiosEstado: CambioEstado[];
}
