// En: donaciones-api/src/dto/crear-donacion-insumo.dto.ts
import { IsString, IsNotEmpty, IsInt, IsOptional, IsEmail, IsIn, ValidateIf, IsObject, IsNumber, IsPositive } from 'class-validator';

export class CrearDonacionInsumoDto {
  @IsString() @IsNotEmpty()
  categoria: string; 

  @IsString() @IsOptional()
  descripcion?: string; 

  @IsString() @IsNotEmpty()
  unidad: string;

  @IsNumber() @IsPositive() @IsNotEmpty()
  cantidad: number;
  
  @IsObject() 
  @IsOptional()
  atributos?: any; 

  @IsIn(['fundacion', 'retira_domicilio']) @IsNotEmpty()
  tipoEntrega: string;

  @IsString() @ValidateIf(o => o.tipoEntrega === 'retira_domicilio') @IsNotEmpty()
  direccionRetiro?: string;
  
  @IsString() @ValidateIf(o => !o.userId) @IsNotEmpty()
  nombreInvitado?: string;
  
  @IsEmail() @ValidateIf(o => !o.userId) @IsNotEmpty()
  emailInvitado?: string;

  @IsString() @ValidateIf(o => !o.userId) @IsNotEmpty()
  telefonoInvitado?: string;

  @IsInt() @IsOptional()
  userId?: number;
}