// En: src/cambio-estado/cambio-estado.entity.ts

import { Estado } from "src/estado/estado.entity";
import { SolicitudAdopcion } from "src/solicitud-adopcion/solicitud-adopcion.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity('cambio_estado')
export class CambioEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCambio: Date;

  @Column({ nullable: true })
  motivo: string;
  
  @Column()
  responsableId: number;

  // Relaciones

  @ManyToOne(() => SolicitudAdopcion, (solicitud) => solicitud.historialDeEstados)
  solicitud: SolicitudAdopcion;

  @ManyToOne(() => Estado, (estado) => estado.cambiosComoNuevo)
  estadoNuevo: Estado;

  @ManyToOne(() => Estado, (estado) => estado.cambiosComoAnterior)
  estadoAnterior: Estado;
}