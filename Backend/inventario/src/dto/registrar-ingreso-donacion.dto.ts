

import { IsString, IsNotEmpty, IsInt, IsOptional, IsObject } from 'class-validator';

export class RegistrarIngresoDto {
  @IsInt()
  @IsNotEmpty()
  donacionOriginalId: number;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;

  @IsString()
  @IsOptional()
  unidad?: string;

  @IsObject()
  @IsOptional()
  atributos?: any;
}