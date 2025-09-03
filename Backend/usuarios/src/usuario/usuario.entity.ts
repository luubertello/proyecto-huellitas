import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rol } from 'src/rol/rol.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({unique:true})
  @Column()
  email: string;

  @Column()
  contrasena: string;

  @Column('simple-array', { nullable: true })
  permisos: string[];
  
  @ManyToOne(() => Rol, rol => rol.usuarios)
  rol: Rol;

}