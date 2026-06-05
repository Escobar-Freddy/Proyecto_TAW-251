import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn, Min } from 'class-validator';

export class CreateCuentaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsIn(['ingreso', 'egreso'])
  tipo: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  nivel?: number;

  @IsInt()
  @IsOptional()
  id_cuenta_padre?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
}