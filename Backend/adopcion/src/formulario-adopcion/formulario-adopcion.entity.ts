import { SolicitudAdopcion } from "src/solicitud-adopcion/solicitud-adopcion.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity('formulario_adopcion')
export class FormularioAdopcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  motivoAdopcion: string;

  @Column()
  experienciaPrevia: string;

  @Column()
  tieneOtrosAnimales: boolean;

  @Column()
  cantidadPerros: number;

  @Column()
  cantidadGatos: number;

  @Column()
  otrasEspeciesDescripcion: string;

  @Column() 
  tipoVivienda: string; 

  @Column()
  tienePatio: boolean;

  @Column()
  tieneBalcon: boolean;

  @Column()
  balconConProteccion: boolean;

  @Column()
  medidasDeSeguridad: string;

  @Column()
  tiempoAnimalSoloHoras: number;

  @Column()
  compromisoPaseos: boolean;

  @Column()
  compromisoGastosVet: boolean;

  // Relaciones

  @OneToOne(() => SolicitudAdopcion, (solicitud) => solicitud.formulario)
  solicitud: SolicitudAdopcion;
}