import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class NuevaDonacionInsumoDto {
  @IsEmail()
  @IsNotEmpty()
  emailAdmin: string;

  @IsString()
  @IsNotEmpty()
  nombreDonante: string;
  
  @IsEmail()
  @IsNotEmpty()
  emailDonante: string;
  
  @IsString()
  @IsNotEmpty()
  telefonoDonante: string;
  
  @IsString()
  @IsNotEmpty()
  descripcionInsumo: string;
  
  @IsString()
  @IsNotEmpty()
  tipoEntrega: string;
  
  @IsString()
  @IsOptional()
  direccionRetiro?: string;
}