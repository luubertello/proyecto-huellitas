// En: donaciones-api/src/dto/crear-donacion-insumo.dto.ts

import { IsString, IsNotEmpty, IsInt, IsOptional, IsEmail, IsIn, ValidateIf } from 'class-validator';

export class CrearDonacionInsumoDto {

  // --- Datos del Insumo ---
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsOptional()
  nombre?: string; 

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;

  @IsString()
  @IsOptional()
  unidad?: string;

  // --- Datos de Logística ---
  @IsIn(['retira_domicilio', 'entrega_fundacion'])
  @IsNotEmpty()
  tipoEntrega: string;

  @IsString()
  @ValidateIf(o => o.tipoEntrega === 'retira_domicilio') 
  @IsNotEmpty({ message: 'La dirección es obligatoria si retiramos a domicilio' })
  direccionRetiro?: string;

  // --- Datos de Donante Invitado ---
  
  @IsString()
  @ValidateIf(o => !o.userId)
  @IsNotEmpty({ message: 'El nombre es obligatorio para donantes invitados' })
  nombreInvitado?: string;
  
  @IsEmail()
  @ValidateIf(o => !o.userId)
  @IsNotEmpty({ message: 'El email es obligatorio para donantes invitados' })
  emailInvitado?: string;

  @IsString()
  @ValidateIf(o => !o.userId)
  @IsNotEmpty({ message: 'El teléfono es obligatorio para donantes invitados' })
  telefonoInvitado?: string;

  @IsInt()
  @IsOptional()
  userId?: number;
}