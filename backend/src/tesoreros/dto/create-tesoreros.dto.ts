import { IsInt, IsString, IsDateString, IsOptional, Min, Max } from 'class-validator';

export class CreateTesoreroDto {
  @IsInt()
  @Min(1)
  id_usuario: number;

  @IsString()
  cargo: string;

  @IsDateString()
  fecha_inicio_cargo: string;

  @IsDateString()
  @IsOptional()
  fecha_fin_cargo?: string | null;
}