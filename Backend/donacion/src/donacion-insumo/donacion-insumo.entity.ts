import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { EstadoInsumo } from 'src/estado-insumo/estado-insumo.entity';

@Entity('donacion_insumo')
export class DonacionInsumo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ type: 'text' })
  descripcionInsumo: string;

  @Column({ type: 'varchar', length: 50 })
  tipoEntrega: string;

  @Column({ type: 'varchar', nullable: true })
  direccionRetiro: string;

  // --- Datos del Donante (Invitado o Registrado) ---
  
  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  nombreInvitado: string;
  
  @Column({ type: 'varchar', nullable: true })
  emailInvitado: string;

  @Column({ type: 'varchar', nullable: true })
  telefonoInvitado: string;

  // --- Relación con EstadoLogistica ---
  @ManyToOne(() => EstadoInsumo, (estado) => estado.donacionesInsumos, { eager: true })
  estadoInsumo: EstadoInsumo;
}