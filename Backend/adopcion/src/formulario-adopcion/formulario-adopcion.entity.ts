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

  @Column({ nullable: true, default: 0 })
  cantidadPerros: number;

  @Column({ nullable: true, default: 0 })
  cantidadGatos: number;

  @Column({ nullable: true })
  otrasEspeciesDescripcion: string;

  @Column() 
  tipoVivienda: string; 

  @Column({ nullable: true })
  tienePatio: boolean;

  @Column({ nullable: true })
  tieneBalcon: boolean;

  @Column({ nullable: true })
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