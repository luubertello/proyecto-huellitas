import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DonacionInsumoRecibidaDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombreDonante: string;
  
  @IsString()
  @IsNotEmpty()
  descripcionInsumo: string;
}