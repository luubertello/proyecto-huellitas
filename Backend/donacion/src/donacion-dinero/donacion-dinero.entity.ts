
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { EstadoDonacionDinero } from 'src/estado-donacion-dinero/estado-donacion-dinero.entity';

@Entity('donacion_dinero')
export class DonacionDinero {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' }) 
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 50 })
  metodoDePago: string; 

  @Column({ default: false })
  esAnonimo: boolean; 

  // --- Campos de Donante (Usuario o Invitado) ---

  @Column({ type: 'int', nullable: true })
  userId: number; 

  @Column({ type: 'varchar', nullable: true })
  emailInvitado: string;

  @ManyToOne(() => EstadoDonacionDinero, (estado) => estado.donacionesDinero, { 
    eager: true, 
    nullable: false 
  })
  estadoDinero: EstadoDonacionDinero;
}