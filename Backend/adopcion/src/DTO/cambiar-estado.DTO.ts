
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CambiarEstadoDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del nuevo estado es obligatorio.' })
  nuevoEstadoId: number;

  @IsString()
  @IsOptional()
  motivo?: string;
}