import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class CrearAnimalDto {
  @IsString()
  nombre: string;

  @IsString()
  raza: string;

  @IsOptional()
  @IsDate()
  fechaNacimiento?: Date;

  @IsString()
  descripcion: string;

  @IsString()
  foto: string;

  @IsInt()
  especieId: number;

  @IsInt()
  estadoActualId: number;
}
