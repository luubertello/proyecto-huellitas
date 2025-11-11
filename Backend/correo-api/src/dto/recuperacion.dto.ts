import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RecuperacionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  resetLink: string;
}