// En: usuarios-api/src/DTO/actualizar-perfil.dto.ts

import { IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class ActualizarPerfilDto {
  
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  nombre?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  apellido?: string;

  @IsString()
  @IsOptional()
  @Length(7, 8, { message: 'El DNI debe tener 7 u 8 dígitos.' })
  dni?: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'La dirección no puede estar vacía.' })
  direccion?: string;
  
  @IsString()
  @IsOptional()
  @Length(8, 15, { message: 'El teléfono debe tener un formato válido.' })
  telefono?: string;

}