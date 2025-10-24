// En: src/usuario/usuario.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { RegistroDto } from 'src/DTO/registro.dto';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/rol/rol.entity';

type UsuarioSinContraseña = Omit<Usuario, 'contraseña'>;

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

// Crea nuevo usuario
   async create(registroDto: RegistroDto): Promise<UsuarioSinContraseña> {
    const { contrasena, ...userData } = registroDto;

    const defaultRol = await this.rolRepository.findOne({ where: { nombre: 'interesado' } });
    
    if (!defaultRol) {
      throw new InternalServerErrorException('El rol por defecto "interesado" no fue encontrado.');
    }

    const nuevoUsuario = this.usuarioRepository.create({
        ...userData,
        contraseña: await bcrypt.hash(contrasena, 10),
        rol: defaultRol,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const { contraseña: _, ...result } = usuarioGuardado;
    return result;
  }

// Verifica si un email ya existe y devuelve un booleano. No lanza error si no lo encuentra.
async emailYaRegistrado(email: string): Promise<boolean> {
  const emailEnMinusculas = email.toLowerCase();
  const usuario = await this.usuarioRepository.findOne({
    where: { email: emailEnMinusculas },
  });
  return !!usuario; // Convierte el resultado (objeto o null) en un booleano (true o false)
}

// Busca un usuario por ID
async findOneById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }

// Devuelve todos los usuarios sin su contraseña
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
        relations: ['rol'],
    });
  }

  // Buscar usuario por email y NO devuelve la contrasena.
  async findOneByEmail(email: string): Promise<UsuarioSinContraseña> {
    const user = await this.usuarioRepository.findOne({ 
      where: { email },
      relations: ['rol'],
    });

    if (!user) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado.`);
    }

    const { contraseña, ...result } = user;
    return result;
  }
  
  // Buscar usuario por email y SI devuelve contrasena. (solo para valiadacion del Auth)
async findOneByEmailWithPassword(email: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ 
      where: { email },
      relations: ['rol'],
      select: ['id', 'nombre', 'apellido', 'dni', 'sexo', 'fechaNacimiento', 'direccion', 'email', 'telefono', 'contraseña', 'rol'],
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado.`);
    }

    return user;
  }
}