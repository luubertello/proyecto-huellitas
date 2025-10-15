import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rol } from 'src/rol/rol.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  dni: number;

  @Column()
  sexo: string;

  @Column()
  fechaNacimiento: Date;

  @Column()
  direccion: string;

  @Index({unique:true})
  @Column()
  email: string;

  @Column()
  contraseña: string;

  @Column()
  telefono: number;
  
  @ManyToOne(() => Rol, rol => rol.usuarios)
  rol: Rol;

}