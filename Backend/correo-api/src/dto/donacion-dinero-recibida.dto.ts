import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class DonacionDineroRecibidaDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombreDonante: string;
  
  @IsNumber()
  @IsNotEmpty()
  monto: number;
}