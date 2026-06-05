// Decoradores y excepciones de NestJS
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// decorador para inyectar repositorio de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Repositorio de TypeORM (interfaz para operaciones BD)
import { Repository } from 'typeorm';
// Entidad, DTOs y biblioteca de encriptación
import { Tesorero } from './entities/tesoreros.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateTesoreroDto } from './dto/create-tesoreros.dto';
import { UpdateTesoreroDto } from './dto/update-tesoreros.dto';

@Injectable()
export class TesorerosService {
  constructor(
    @InjectRepository(Tesorero)
    private tesoreroRepository: Repository<Tesorero>,
    private usuariosService: UsuariosService,
  ) {}

  async create(createTesoreroDto: CreateTesoreroDto): Promise<Tesorero> {
    // Verificar que el usuario existe
    const usuario = await this.usuariosService.findOne(createTesoreroDto.id_usuario);
    
    // Verificar que el usuario tiene rol de tesorero
    if (usuario.rol !== 'tesorero') {
      throw new ConflictException('El usuario debe tener rol "tesorero" para crear un registro en tesoreros');
    }

    // Verificar que el usuario no tenga ya un registro en tesoreros
    const existe = await this.tesoreroRepository.findOne({
      where: { id_usuario: createTesoreroDto.id_usuario }
    });
    
    if (existe) {
      throw new ConflictException('Este usuario ya tiene un registro como tesorero');
    }

    const tesorero = this.tesoreroRepository.create(createTesoreroDto);
    return await this.tesoreroRepository.save(tesorero);
  }

  async findAll(): Promise<Tesorero[]> {
    return await this.tesoreroRepository.find({
      //relations: ['usuario'], // Cargar los datos del usuario relacionado
      relations:{usuario:true},
    });
  }

  async findOne(id: number): Promise<Tesorero> {
    const tesorero = await this.tesoreroRepository.findOne({
      where: { id_tesorero: id },
      relations:{usuario:true},
      //relations: ['usuario'],
    });
    
    if (!tesorero) {
      throw new NotFoundException(`Tesorero con ID ${id} no encontrado`);
    }
    return tesorero;
  }

  async findByUsuarioId(id_usuario: number): Promise<Tesorero> {
    const tesorero = await this.tesoreroRepository.findOne({
      where: { id_usuario },
      //relations: ['usuario'],
      relations:{usuario:true},
    });
    
    if (!tesorero) {
      throw new NotFoundException(`Tesorero con usuario ID ${id_usuario} no encontrado`);
    }
    return tesorero;
  }

  async update(id: number, updateTesoreroDto: UpdateTesoreroDto): Promise<Tesorero> {
    const tesorero = await this.findOne(id);
    
    // Si se actualiza el id_usuario, verificar que el nuevo usuario sea tesorero
    if (updateTesoreroDto.id_usuario && updateTesoreroDto.id_usuario !== tesorero.id_usuario) {
      const usuario = await this.usuariosService.findOne(updateTesoreroDto.id_usuario);
      if (usuario.rol !== 'tesorero') {
        throw new ConflictException('El usuario debe tener rol "tesorero"');
      }
    }
    
    Object.assign(tesorero, updateTesoreroDto);
    return await this.tesoreroRepository.save(tesorero);
  }

  async remove(id: number): Promise<void> {
    const tesorero = await this.findOne(id);
    await this.tesoreroRepository.remove(tesorero);
  }
}