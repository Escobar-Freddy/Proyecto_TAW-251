import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { FilterMovimientoDto } from './dto/filter-movimiento.dto';
import { CuentasService } from '../cuentas/cuentas.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private movimientoRepository: Repository<Movimiento>,
    private cuentasService: CuentasService,
    private usuariosService: UsuariosService,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto, userRol: string): Promise<Movimiento> {
    if (userRol !== 'admin' && userRol !== 'tesorero') {
      throw new ForbiddenException('No tiene permisos para crear movimientos');
    }

    const cuenta = await this.cuentasService.findOne(createMovimientoDto.id_cuenta);
    
    if (cuenta.tipo !== createMovimientoDto.tipo) {
      throw new ConflictException(`La cuenta ${cuenta.codigo} es de tipo ${cuenta.tipo}, no coincide con el movimiento tipo ${createMovimientoDto.tipo}`);
    }

    await this.usuariosService.findOne(createMovimientoDto.id_usuario_registra);

    const movimiento = this.movimientoRepository.create(createMovimientoDto);
    return await this.movimientoRepository.save(movimiento);
  }

  async findAll(filterDto: FilterMovimientoDto, userRol: string): Promise<Movimiento[]> {
    const { fecha_inicio, fecha_fin, id_cuenta, tipo, search } = filterDto;
    
    const query = this.movimientoRepository
      .createQueryBuilder('m')
      .where('m.deleted_at IS NULL')
      .leftJoinAndSelect('m.usuario_registra', 'usuario_registra')
      .leftJoinAndSelect('m.cuenta', 'cuenta');

    if (fecha_inicio && fecha_fin) {
      query.andWhere('m.fecha_movimiento BETWEEN :fecha_inicio AND :fecha_fin', {
        fecha_inicio,
        fecha_fin,
      });
    } else if (fecha_inicio) {
      query.andWhere('m.fecha_movimiento >= :fecha_inicio', { fecha_inicio });
    } else if (fecha_fin) {
      query.andWhere('m.fecha_movimiento <= :fecha_fin', { fecha_fin });
    }

    if (id_cuenta) {
      query.andWhere('m.id_cuenta = :id_cuenta', { id_cuenta });
    }

    if (tipo) {
      query.andWhere('m.tipo = :tipo', { tipo });
    }

    if (search) {
      query.andWhere(
        '(m.descripcion LIKE :search OR m.persona_origen LIKE :search OR m.iglesia_origen LIKE :search OR m.numero_recibo LIKE :search)',
        { search: `%${search}%` }
      );
    }

    query.orderBy('m.fecha_movimiento', 'DESC');

    return await query.getMany();
  }

  async findOne(id: number, userRol: string): Promise<Movimiento> {
    const movimiento = await this.movimientoRepository
      .createQueryBuilder('m')
      .where('m.id_movimiento = :id', { id })
      .andWhere('m.deleted_at IS NULL')
      .leftJoinAndSelect('m.usuario_registra', 'usuario_registra')
      .leftJoinAndSelect('m.cuenta', 'cuenta')
      .getOne();
    
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    
    return movimiento;
  }

  async update(id: number, updateMovimientoDto: UpdateMovimientoDto, userRol: string): Promise<Movimiento> {
    if (userRol !== 'admin' && userRol !== 'tesorero') {
      throw new ForbiddenException('No tiene permisos para actualizar movimientos');
    }

    const movimiento = await this.findOne(id, userRol);
    
    if (updateMovimientoDto.id_cuenta && updateMovimientoDto.id_cuenta !== movimiento.id_cuenta) {
      const cuenta = await this.cuentasService.findOne(updateMovimientoDto.id_cuenta);
      const tipoMovimiento = updateMovimientoDto.tipo || movimiento.tipo;
      if (cuenta.tipo !== tipoMovimiento) {
        throw new ConflictException(`La cuenta ${cuenta.codigo} es de tipo ${cuenta.tipo}, no coincide con el movimiento tipo ${tipoMovimiento}`);
      }
    }

    Object.assign(movimiento, updateMovimientoDto);
    return await this.movimientoRepository.save(movimiento);
  }

  async softDelete(id: number, userRol: string): Promise<void> {
    if (userRol !== 'admin' && userRol !== 'tesorero') {
      throw new ForbiddenException('No tiene permisos para eliminar movimientos');
    }

    const movimiento = await this.findOne(id, userRol);
    movimiento.deleted_at = new Date();
    await this.movimientoRepository.save(movimiento);
  }

  async getResumen(fecha_inicio: string, fecha_fin: string): Promise<any> {
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new ConflictException('Fechas inválidas');
    }

    const movimientos = await this.movimientoRepository
      .createQueryBuilder('m')
      .where('m.fecha_movimiento BETWEEN :inicio AND :fin', { inicio, fin })
      .andWhere('m.deleted_at IS NULL')
      .getMany();

    const total_ingresos = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    const total_egresos = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    return {
      fecha_inicio,
      fecha_fin,
      total_ingresos,
      total_egresos,
      saldo: total_ingresos - total_egresos,
      cantidad_movimientos: movimientos.length,
    };
  }

  async getResumenPorCuenta(fecha_inicio: string, fecha_fin: string): Promise<any> {
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new ConflictException('Fechas inválidas');
    }

    const movimientos = await this.movimientoRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.cuenta', 'cuenta')
      .where('m.fecha_movimiento BETWEEN :inicio AND :fin', { inicio, fin })
      .andWhere('m.deleted_at IS NULL')
      .getMany();

    const porCuenta = movimientos.reduce((acc, m) => {
      const key = `${m.cuenta.codigo} - ${m.cuenta.nombre}`;
      if (!acc[key]) {
        acc[key] = {
          codigo: m.cuenta.codigo,
          nombre: m.cuenta.nombre,
          tipo: m.tipo,
          total: 0,
          cantidad: 0,
        };
      }
      acc[key].total += Number(m.monto);
      acc[key].cantidad += 1;
      return acc;
    }, {});

    const ingresos = Object.values(porCuenta).filter((item: any) => item.tipo === 'ingreso');
    const egresos = Object.values(porCuenta).filter((item: any) => item.tipo === 'egreso');

    return {
      ingresos,
      egresos,
      total_ingresos: ingresos.reduce((sum: number, item: any) => sum + item.total, 0),
      total_egresos: egresos.reduce((sum: number, item: any) => sum + item.total, 0),
    };
  }

  async getMovimientosPorMes(anio: number): Promise<any> {
    const inicio = new Date(anio, 0, 1);
    const fin = new Date(anio, 11, 31);

    const movimientos = await this.movimientoRepository
      .createQueryBuilder('m')
      .where('m.fecha_movimiento BETWEEN :inicio AND :fin', { inicio, fin })
      .andWhere('m.deleted_at IS NULL')
      .getMany();

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ingresosPorMes = new Array(12).fill(0);
    const egresosPorMes = new Array(12).fill(0);

    movimientos.forEach(m => {
      const mes = new Date(m.fecha_movimiento).getMonth();
      if (m.tipo === 'ingreso') {
        ingresosPorMes[mes] += Number(m.monto);
      } else {
        egresosPorMes[mes] += Number(m.monto);
      }
    });

    return {
      anio,
      meses,
      ingresos: ingresosPorMes,
      egresos: egresosPorMes,
    };
  }
}