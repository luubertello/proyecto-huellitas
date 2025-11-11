import { IsNotEmpty, IsString } from 'class-validator';

export class CambiarEstadoAnimalDto {
  
  @IsString({ message: 'El nuevo estado debe ser un texto.' })
  @IsNotEmpty({ message: 'El nuevo estado no puede estar vacío.' })
  nuevoEstado: string;
}