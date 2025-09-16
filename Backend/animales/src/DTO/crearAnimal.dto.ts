import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class CrearAnimalDto {
  @IsString()
  nombre: string;

  @IsInt()
  razaId: number; // ahora es relación a la entidad Raza

  @IsInt()
  sexoId: number; // relación a la entidad Sexo

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
