import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class CrearAnimalDto {
  nombre: string;
  razaId: number;
  sexo: string;
  fechaNacimiento?: Date;
  descripcion: string;
  foto: string;
  especieId: number;
  estadoActualId: number;
}

