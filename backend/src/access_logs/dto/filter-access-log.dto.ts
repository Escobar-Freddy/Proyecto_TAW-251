import { IsOptional, IsString, IsInt, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterAccessLogDto {
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id_usuario?: number;

  @IsOptional()
  @IsString()
  evento?: string; // 'ingreso' o 'salida'

  @IsOptional()
  @IsString()
  search?: string;
}