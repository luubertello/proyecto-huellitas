import { CambioEstado } from "src/cambio-estado/cambio-estado.entity";
import { Estado } from "src/estado/estado.entity";
import { FormularioAdopcion } from "src/formulario-adopcion/formulario-adopcion.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity('solicitud_adopcion')
export class SolicitudAdopcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaInicio: string;

  // Relaciones
  @OneToOne(() => FormularioAdopcion, { cascade: true, eager: true })
  @JoinColumn()
  formulario: FormularioAdopcion;

  @ManyToOne(() => Estado, (estado) => estado.solicitudes, { eager: true })
  estadoActual: Estado;

  @OneToMany(
    () => CambioEstado,
    (cambioEstado) => cambioEstado.solicitud,
    { cascade: true },
  )
  historialDeEstados: CambioEstado[];
}
