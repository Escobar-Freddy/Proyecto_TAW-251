import { IsInt, IsString, IsNotEmpty, IsOptional, IsIn, IsPositive, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovimientoDto {
  @IsInt()
  @Min(1)
  id_usuario_registra: number;

  @IsInt()
  @Min(1)
  id_cuenta: number;

  @IsString()
  @IsIn(['ingreso', 'egreso'])
  tipo: string;

  @IsPositive()
  @Type(() => Number)
  monto: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fecha_movimiento: string;

  @IsString()
  @IsOptional()
  numero_recibo?: string;

  @IsString()
  @IsOptional()
  persona_origen?: string;

  @IsString()
  @IsOptional()
  iglesia_origen?: string;
}