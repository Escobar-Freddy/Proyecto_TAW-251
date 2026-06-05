import { IsInt, IsString, IsIn, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateAccessLogDto {
  @IsInt()
  @Min(1)
  id_usuario: number;

  @IsString()
  @MaxLength(45)
  ip: string;

  @IsString()
  @IsIn(['ingreso', 'salida'])
  evento: string;

  @IsString()
  @MaxLength(100)
  browser: string;

  @IsOptional()
  fecha_hora?: Date;
}