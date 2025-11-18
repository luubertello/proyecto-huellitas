
import { DonacionDinero } from 'src/donacion-dinero/donacion-dinero.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('estado_donacion_dinero')
export class EstadoDonacionDinero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string; 

  @OneToMany(() => DonacionDinero, (donacion) => donacion.estadoDinero)
  donacionesDinero: DonacionDinero[];
}