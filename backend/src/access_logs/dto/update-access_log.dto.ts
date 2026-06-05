// Nota: No se permite actualizar logs, pero creamos el DTO por consistencia
import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessLogDto } from './create-access_log.dto';

// Este DTO no se usará realmente porque los logs son solo lectura
export class UpdateAccessLogDto extends PartialType(CreateAccessLogDto) {}