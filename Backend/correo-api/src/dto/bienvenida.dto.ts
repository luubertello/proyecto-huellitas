import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BienvenidaDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}