import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class CrearAnimalDto {
  nombre: string;
  razaId: number;
  sexoId: number;
  fechaNacimiento?: Date;
  descripcion: string;
  foto: string;
  especieId: number;
  estadoActualId: number;
}

