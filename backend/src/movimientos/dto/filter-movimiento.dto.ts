import { IsOptional, IsString, IsIn, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterMovimientoDto {
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_cuenta?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ingreso', 'egreso'])
  tipo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}