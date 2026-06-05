// Decoradores y excepciones de NestJS
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// Decorador para inyectar el repositorio de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Repositorio de TypeORM (interfaz para operaciones BD)
import { Repository } from 'typeorm';
// Entidad, DTOs y biblioteca de encriptación
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

//Permite que NestJS inyecte este servicio en otras clases (controladores, otros servicios)
//Hace que el servicio sea parte del sistema de DI (Dependency Injection)
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el email ya existe
    const existe = await this.usuarioRepository.findOne({
      where: { email: createUsuarioDto.email },
    });
    if (existe) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar contraseña
    // genSalt(10): genera un "sal" con 10 rondas (factor de costo)
    // Más rondas es más seguro pero más lento
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(createUsuarioDto.password, salt);

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password_hash,
    });
     // save(): guarda la entidad y devuelve el registro con el ID generado
    return await this.usuarioRepository.save(usuario);
  }
  // retorna lista de usuario
  async findAll(): Promise<Usuario[]> {
    // Solo usuarios activos (soft delete)
    return await this.usuarioRepository.find({
      where: { activo: true }, // solo usuarios activos
    });
  }
  //Busca un usuario específico por su ID (solo si está activo)
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id, activo: true },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }
  //Actualiza parcialmente un usuario
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);
    
    // Si se envía nueva contraseña, encriptarla
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto['password_hash'] = await bcrypt.hash(updateUsuarioDto.password, salt);
      delete updateUsuarioDto.password;
    }
    
    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }
  //Elimina lógicamente un usuario (soft delete)
  async softDelete(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.activo = false;
    await this.usuarioRepository.save(usuario);
  }
  //Busca un usuario por su email (para login)
  async findByEmail(email: string): Promise<Usuario> {
  const usuario = await this.usuarioRepository.findOne({
    where: { email, activo: true },
  });
  
  if (!usuario) {
    throw new NotFoundException(`Usuario con email ${email} no encontrado`);
  }
  return usuario;
}
}