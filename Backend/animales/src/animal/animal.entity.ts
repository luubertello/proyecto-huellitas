import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CambioEstado } from "src/cambioEstado/cambioEstado.entity";
import { Especie } from "src/especie/especie.entity";
import { Estado } from "src/estado/estado.entity";

@Entity('animal')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  raza: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column()
  descripcion: string;

  @Column()
  foto: string;
  
  // Relaciones
  @OneToMany(() => CambioEstado, cambio => cambio.animal)
  cambiosEstado: CambioEstado[];
  
  @ManyToOne(() => Especie, especie => especie.animales)
  @JoinColumn({ name: 'especie_id' })
  especie: Especie;

  @ManyToOne(() => Estado, estadoActual => estadoActual.animales)
  @JoinColumn({ name: 'estadoActual_id' })
  estadoActual: Estado;
  

}