import { IsNotEmpty, IsString } from 'class-validator';

export class CrearEstadoDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;
}