import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificacionSolicitudDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombreAdoptante: string;

  @IsString()
  @IsNotEmpty()
  nombreAnimal: string;
}