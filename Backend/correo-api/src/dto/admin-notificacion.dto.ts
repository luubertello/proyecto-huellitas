import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminNotificacionDto {
  
  @IsEmail()
  @IsNotEmpty()
  emailAdmin: string; 

  @IsString()
  @IsNotEmpty()
  nombreAdoptante: string;

  @IsString()
  @IsNotEmpty()
  nombreAnimal: string;
  
  @IsEmail()
  @IsNotEmpty()
  emailAdoptante: string;
}