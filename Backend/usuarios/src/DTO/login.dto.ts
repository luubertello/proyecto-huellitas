import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  readonly contrasena: string;
}