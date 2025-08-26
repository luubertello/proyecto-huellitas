import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Animal } from "src/animal/animal.entity";
import { CambioEstado } from "src/cambioEstado/cambioEstado.entity";

@Entity('solicitud_adopcion')
export class SolicitudAdopcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaHoraInicio: string;

  @Column()
  fechaHoraFin: string;

  @Column()
  formulario: string;

  // Relaciones
  
  @ManyToOne(() => Animal, animal => animal.solicitudAdopcion)
  animal: Animal;

  @OneToMany(() => CambioEstado, cambio => cambio.solicitudAdopcion)
  cambiosEstado: CambioEstado[];

  // RELACION CON USUARIO
}