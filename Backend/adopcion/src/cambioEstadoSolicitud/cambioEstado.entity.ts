import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { SolicitudAdopcion } from "src/solicitudAdopcion/solicitudAdopcion.entity";

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaHoraInicio: string;

  @Column()
  fechaHoraFin: string;

  // Relaciones

  @ManyToOne(() => SolicitudAdopcion, solicitud => solicitud.cambiosEstado)
  solicitudAdopcion: SolicitudAdopcion;

}