import { Rol } from "src/rol/rol.entity";
import { BaseEntity, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity('permisos')
export class Permisos {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nombre: string;

    @ManyToMany(() => Rol, rol => rol.permisos)
    rol: Rol[]
}