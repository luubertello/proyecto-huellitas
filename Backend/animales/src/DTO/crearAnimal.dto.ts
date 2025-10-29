import {
  IsString,
  IsOptional,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearAnimalDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @IsInt({ message: 'El razaId debe ser un número entero' })
  @IsPositive({ message: 'El razaId debe ser un número positivo' })
  razaId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Macho', 'Hembra'], { message: 'El sexo debe ser "Macho" o "Hembra"' })
  sexo: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  fechaNacimiento?: Date;

  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion: string;

  @IsString()
  @IsNotEmpty({ message: 'La foto no puede estar vacía' })
  foto: string;

  @IsInt({ message: 'El especieId debe ser un número entero' })
  @IsPositive({ message: 'El especieId debe ser un número positivo' })
  especieId: number;

  @IsInt({ message: 'El estadoActualId debe ser un número entero' })
  @IsPositive({ message: 'El estadoActualId debe ser un número positivo' })
  estadoActualId: number;
}