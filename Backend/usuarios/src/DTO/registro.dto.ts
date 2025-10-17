import { IsString, IsNotEmpty, IsEmail, MinLength, IsNumber, IsDateString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegistroDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  readonly nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  readonly apellido: string;

  @IsNumber({}, { message: 'El DNI debe ser un número.' })
  @IsNotEmpty({ message: 'El DNI no puede estar vacío.' })
  readonly dni: number;
  
  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Otro'], { message: 'El sexo debe ser Masculino, Femenino u Otro.'})
  readonly sexo: string;

  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD).'})
  @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacía.' })
  readonly fechaNacimiento: Date;
  
  @IsString()
  @IsNotEmpty({ message: 'La dirección no puede estar vacía.' })
  readonly direccion: string;

  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  readonly contraseña: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El teléfono no puede estar vacío.' })
  readonly telefono: string;
}