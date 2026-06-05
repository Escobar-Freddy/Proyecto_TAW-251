//para actualizar usuario

// PartialType: Convierte todos los campos de CreateUsuarioDto en opcionales
// mapped-types: Utilidad oficial de NestJS para DTOs parciales
import { PartialType } from '@nestjs/mapped-types';
// Validadores: Cada decorador valida un tipo específico de dato
import { IsOptional, IsString, IsEmail, IsInt, Min, Max, IsIn } from 'class-validator';
// Base DTO: Extiende las validaciones del DTO de creación
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
   
  @IsOptional() // el campo puede omitirse en la peticion
  @IsString() // si se envia, debe ser texto
  nombre?: string; //Maraco en TypeScript como opcional

  @IsOptional()
  @IsString()
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  apellido_materno?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsInt()
  @Min(0) //cantidad minima de a;os
  @Max(120) //cantidad maxima de a;os
  edad?: number;

  @IsOptional()
  @IsString()
  distrito?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  iglesia?: string;

  @IsOptional()
  @IsEmail()  // verifica si es del tipo email hola@mundo.com
  email?: string;

  @IsOptional()
  @IsString()
  password?: string; // Opcional para actualizar

  @IsOptional()
  @IsIn(['weak', 'medium', 'strong'])
  password_strength?: string;

  @IsOptional()
  @IsIn(['admin', 'tesorero', 'usuario'])
  rol?: string;
}