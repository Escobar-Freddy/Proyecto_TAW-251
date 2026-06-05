import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from './entities/access_logs.entity';
import { CreateAccessLogDto } from './dto/create-access_log.dto';
import { FilterAccessLogDto } from './dto/filter-access-log.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    private usuariosService: UsuariosService,
  ) {}

  async create(createAccessLogDto: CreateAccessLogDto): Promise<AccessLog> {
    const log = this.accessLogRepository.create({
      ...createAccessLogDto,
      fecha_hora: new Date(),
    });
    return await this.accessLogRepository.save(log);
  }

  // ✅ Método findAll corregido - acepta filterDto y userRol
  async findAll(filterDto: FilterAccessLogDto, userRol: string): Promise<AccessLog[]> {
    // Solo administradores pueden ver logs
    if (userRol !== 'admin') {
      throw new ForbiddenException('No tiene permisos para acceder a los logs');
    }

    const { fecha_inicio, fecha_fin, id_usuario, evento, search } = filterDto;
    
    const query = this.accessLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.usuario', 'usuario');

    if (fecha_inicio && fecha_fin) {
      query.andWhere('log.fecha_hora BETWEEN :fecha_inicio AND :fecha_fin', {
        fecha_inicio,
        fecha_fin,
      });
    } else if (fecha_inicio) {
      query.andWhere('log.fecha_hora >= :fecha_inicio', { fecha_inicio });
    } else if (fecha_fin) {
      query.andWhere('log.fecha_hora <= :fecha_fin', { fecha_fin });
    }

    if (id_usuario) {
      query.andWhere('log.id_usuario = :id_usuario', { id_usuario });
    }

    if (evento) {
      query.andWhere('log.evento = :evento', { evento });
    }

    if (search) {
      query.andWhere(
        '(log.ip LIKE :search OR log.browser LIKE :search OR usuario.nombre LIKE :search OR usuario.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    query.orderBy('log.fecha_hora', 'DESC');

    return await query.getMany();
  }

  async getEstadisticas(userRol: string): Promise<any> {
    if (userRol !== 'admin') {
      throw new ForbiddenException('No tiene permisos para acceder a las estadísticas');
    }

    const total = await this.accessLogRepository.count();
    
    const ingresos = await this.accessLogRepository.count({
      where: { evento: 'ingreso' },
    });
    
    const salidas = await this.accessLogRepository.count({
      where: { evento: 'salida' },
    });

    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 7);
    fecha.setHours(0, 0, 0, 0);
    
    const ultimos7Dias = await this.accessLogRepository
      .createQueryBuilder('log')
      .where('log.fecha_hora >= :fecha', { fecha })
      .getCount();

    return {
      total,
      ingresos,
      salidas,
      ultimos7Dias,
    };
  }

  async findOne(id: number, userRol: string): Promise<AccessLog> {
    if (userRol !== 'admin') {
      throw new ForbiddenException('No tiene permisos para acceder a los logs');
    }

    const log = await this.accessLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.usuario', 'usuario')
      .where('log.id_log = :id', { id })
      .getOne();

    if (!log) {
      throw new NotFoundException(`Log con ID ${id} no encontrado`);
    }
    return log;
  }

  async findByUsuarioId(id_usuario: number, userRol: string): Promise<AccessLog[]> {
    if (userRol !== 'admin') {
      throw new ForbiddenException('No tiene permisos para acceder a los logs');
    }

    await this.usuariosService.findOne(id_usuario);

    return await this.accessLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.usuario', 'usuario')
      .where('log.id_usuario = :id_usuario', { id_usuario })
      .orderBy('log.fecha_hora', 'DESC')
      .getMany();
  }
}