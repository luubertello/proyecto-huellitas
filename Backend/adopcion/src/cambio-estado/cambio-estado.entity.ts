import { Estado } from "src/estado/estado.entity";
import { SolicitudAdopcion } from "src/solicitud-adopcion/solicitud-adopcion.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaHoraInicio: string;

  @Column()
  fechaHoraFin: string;

  @Column()
  motivo: string;

  // Relaciones

  @ManyToOne(() => SolicitudAdopcion, (solicitud) => solicitud.historialDeEstados)
  solicitud: SolicitudAdopcion;

  @ManyToOne(() => Estado, (estado) => estado.cambiosDeEstado)
  estado: Estado;


}