import { IsEmail, IsString, MinLength, MaxLength, IsInt, Min, Max, IsIn, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  apellido_paterno: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  apellido_materno: string;

  @IsString()
  direccion: string;

  @IsString()
  @MaxLength(10)
  celular: string;

  @IsInt()
  @Min(0)
  @Max(100)
  edad: number;

  @IsString()
  distrito: string;

  @IsString()
  region: string;

  @IsString()
  iglesia: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string; // Contraseña en texto plano (se encriptará después)

  @IsString()
  @IsIn(['weak', 'medium', 'strong'])
  password_strength: string;

  @IsString()
  @IsIn(['admin', 'tesorero', 'usuario'])
  @IsOptional()
  rol?: string;
}