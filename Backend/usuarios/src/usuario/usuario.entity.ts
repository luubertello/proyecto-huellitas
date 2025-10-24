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

  @Column({ 
    type: "varchar",
    nullable: true 
  }) 
  contraseña: string | null;

  @Column()
  telefono: string;

  @Index({ unique: true, where: '"googleId" IS NOT NULL' })
  @Column({ type: 'varchar', nullable: true, unique: false })
  googleId: string | null;
  
  @ManyToOne(() => Rol, rol => rol.usuarios)
  rol: Rol;

}