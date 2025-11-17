import { IsString, IsNotEmpty, IsInt, IsOptional, IsJSON, IsObject, Min, IsNumber } from 'class-validator';

export class CrearInsumoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  unidadMedida: string; 

  @IsObject()
  @IsOptional()
  atributos?: any; 

  @IsNumber()
  @IsNotEmpty()
  categoriaId: number; 
}