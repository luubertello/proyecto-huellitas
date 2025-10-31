import { CambioEstado } from "src/cambio-estado/cambio-estado.entity";
import { SolicitudAdopcion } from "src/solicitud-adopcion/solicitud-adopcion.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'Sin nombre' })
  nombre: string;

  // Relaciones

  @OneToMany(
    () => SolicitudAdopcion,
    (solicitud) => solicitud.estadoActual,
  )
  solicitudes: SolicitudAdopcion[];

  @OneToMany(() => CambioEstado, (cambio) => cambio.estadoNuevo)
  cambiosComoNuevo: CambioEstado[];

  @OneToMany(() => CambioEstado, (cambio) => cambio.estadoAnterior)
  cambiosComoAnterior: CambioEstado[];

}