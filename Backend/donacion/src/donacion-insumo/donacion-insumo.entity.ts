// En: donaciones-api/src/donacion-insumo/donacion-insumo.entity.ts

import { EstadoDonacionInsumo } from 'src/estado-donacion-insumo/estado-donacion-insumo.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('donacion_insumo')
export class DonacionInsumo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  fecha: Date;

  // --- Datos del Formulario Dinámico ---
  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @Column({ type: 'varchar', nullable: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidad: string;

  // --- Datos de Logística (del formulario) ---
  @Column({ type: 'varchar', length: 50 })
  tipoEntrega: string;

  @Column({ type: 'varchar', nullable: true })
  direccionRetiro: string;

  // --- Datos del Donante (Usuario o Invitado) ---
  
  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  nombreInvitado: string;
  
  @Column({ type: 'varchar', nullable: true })
  emailInvitado: string;

  @Column({ type: 'varchar', nullable: true })
  telefonoInvitado: string;

  // --- Relación con EstadoLogistica ---
  @ManyToOne(() => EstadoDonacionInsumo, (estado) => estado.donacionesInsumos, { 
    eager: true,
    nullable: false 
  })
  estadoInsumo: EstadoDonacionInsumo;
}