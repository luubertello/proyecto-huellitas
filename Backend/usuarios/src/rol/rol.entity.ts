import { BaseEntity, Entity, PrimaryGeneratedColumn, Index, Column, ManyToMany, JoinTable, OneToMany  } from "typeorm";
import { Usuario } from "src/usuario/usuario.entity";
import { Permisos } from "src/permisos/permisos.entity";

@Entity('rol')
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({unique:true})
    @Column()
    nombre: string;

    @ManyToMany(() => Permisos, permisos => permisos.rol)
    @JoinTable()
    permisos: Permisos[];

    @OneToMany(() => Usuario, usuarios => usuarios.rol)
    usuarios: Usuario[]
}