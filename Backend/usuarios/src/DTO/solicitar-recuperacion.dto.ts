import { IsEmail, IsNotEmpty } from 'class-validator';

export class SolicitarRecuperacionDto {
  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  email: string;
}