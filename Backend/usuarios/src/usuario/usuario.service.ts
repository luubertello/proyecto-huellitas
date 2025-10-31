// En: src/usuario/usuario.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { RegistroDto } from 'src/DTO/registro.dto';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/rol/rol.entity';

interface GoogleProfileData {
  googleId: string;
  email: string;
  nombre: string;
  apellido: string;
  sexo?: string;
  fechaNacimiento?: Date;
  direccion?: string;
  telefono?: string;
}

type UsuarioSincontrasena = Omit<Usuario, 'contrasena'>;

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

// Crea nuevo usuario
   async create(registroDto: RegistroDto): Promise<UsuarioSincontrasena> {
    const { contrasena, ...userData } = registroDto;

    const defaultRol = await this.rolRepository.findOne({ where: { nombre: 'interesado' } });
    
    if (!defaultRol) {
      throw new InternalServerErrorException('El rol por defecto "interesado" no fue encontrado.');
    }

    const nuevoUsuario = this.usuarioRepository.create({
        ...userData,
        contrasena: await bcrypt.hash(contrasena, 10),
        rol: defaultRol,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const { contrasena: _, ...result } = usuarioGuardado;
    return result;
  }

// Encuentra un usuario por su google ID.
  async findOneByGoogleId(googleId: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ 
      where: { googleId },
      relations: ['rol'] // Carga el rol también
    });
  }

// Vincula Google ID a un usuario ya existente
  async linkGoogleId(userId: number, googleId: string): Promise<void> {
    const user = await this.usuarioRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado para vincular Google ID.`);
    }
    if (user.googleId && user.googleId !== googleId) {
        console.warn(`Usuario ${userId} ya tiene un Google ID (${user.googleId}), intentando vincular ${googleId}`);
    }
    
    await this.usuarioRepository.update(userId, { googleId });
  }

  // Crea un nuevo usuario desde el perfil de Google
  async createFromGoogle(profileData: GoogleProfileData): Promise<Usuario> {
    
    // Verificamos si ya existe por email o googleId (doble chequeo)
    const existingUser = await this.usuarioRepository.findOne({
        where: [
            { googleId: profileData.googleId },
            { email: profileData.email }
        ]
    });
    if (existingUser) {
        return existingUser; 
    }

    const defaultRol = await this.rolRepository.findOne({ where: { nombre: 'interesado' } });
    if (!defaultRol) {
      throw new InternalServerErrorException('El rol por defecto "interesado" no fue encontrado.');
    }

    // Creamos el usuario SIN contrasena
    const nuevoUsuario = this.usuarioRepository.create({
    // Datos de Google
      googleId: profileData.googleId,
      email: profileData.email,
      nombre: profileData.nombre,
      apellido: profileData.apellido,
      
      // --- VALORES POR DEFECTO ---
      dni: 0, 
      sexo: 'No especificado', 
      fechaNacimiento: new Date('1900-01-01'), 
      direccion: 'No especificada', 
      telefono: '00000000', 
      // --- FIN VALORES POR DEFECTO ---
      
      contrasena: null, 
      rol: defaultRol,
    });

    return this.usuarioRepository.save(nuevoUsuario);
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

// Devuelve todos los usuarios sin su contrasena
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
        relations: ['rol'],
    });
  }

  // Buscar usuario por email y NO devuelve la contrasena.
  async findOneByEmail(email: string): Promise<UsuarioSincontrasena> {
    const user = await this.usuarioRepository.findOne({ 
      where: { email },
      relations: ['rol'],
    });

    if (!user) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado.`);
    }

    const { contrasena, ...result } = user;
    return result;
  }
  
  // Buscar usuario por email y SI devuelve contrasena. (solo para valiadacion del Auth)
async findOneByEmailWithPassword(email: string): Promise<Usuario | null> { 
    const user = await this.usuarioRepository.findOne({ 
      where: { email },
      relations: ['rol'],
      select: ["id", "email", "nombre", "apellido", "rol", "contrasena", "googleId"] 
    });
    
    return user || null; 
  }
}
