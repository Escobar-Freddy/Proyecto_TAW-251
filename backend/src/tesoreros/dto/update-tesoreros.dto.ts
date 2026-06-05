import { PartialType } from '@nestjs/mapped-types';
import { CreateTesoreroDto } from './create-tesoreros.dto';

export class UpdateTesoreroDto extends PartialType(CreateTesoreroDto) {}