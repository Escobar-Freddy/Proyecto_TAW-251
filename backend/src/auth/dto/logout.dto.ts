import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class LogoutDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  id_usuario: number;
}