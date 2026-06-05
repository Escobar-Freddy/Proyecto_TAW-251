import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CuentaContable } from '../cuentas/entities/cuenta.entity';

@Injectable()
export class TesoreriadatosService {
  constructor(
    @InjectRepository(Movimiento)
    private movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(CuentaContable)
    private cuentaRepository: Repository<CuentaContable>,
    private jwtService: JwtService,
  ) {}

  // Obtener todos los movimientos (público)
  async obtenerTodosLosMovimientos() {
    // se Usa QueryBuilder en lugar de find con where complejo
    const movimientos = await this.movimientoRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.cuenta', 'cuenta')
      .leftJoinAndSelect('m.usuario_registra', 'usuario_registra')
      .where('m.deleted_at IS NULL')
      .orderBy('m.fecha_movimiento', 'DESC')
      .getMany();

    // Calcular resumen de ingresos y egresos
    const total_ingresos = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + Number(m.monto), 0);
    
    const total_egresos = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    // Formatear movimientos para JSON
    const movimientosFormateados = movimientos.map(m => ({
      id_movimiento: m.id_movimiento,
      fecha_movimiento: m.fecha_movimiento,
      tipo: m.tipo,
      monto: Number(m.monto),
      descripcion: m.descripcion,
      numero_recibo: m.numero_recibo,
      persona_origen: m.persona_origen,
      iglesia_origen: m.iglesia_origen,
      cuenta: m.cuenta ? {
        id_cuenta: m.cuenta.id_cuenta,
        codigo: m.cuenta.codigo,
        nombre: m.cuenta.nombre,
        tipo: m.cuenta.tipo,
      } : null,
      usuario_registra: m.usuario_registra ? {
        id: m.usuario_registra.id_usuario,
        nombre: `${m.usuario_registra.nombre} ${m.usuario_registra.apellido_paterno}`,
      } : null,
    }));

    // Obtener resumen por cuentas
    const cuentas = await this.cuentaRepository.find();
    const resumenCuentas = cuentas.map(cuenta => ({
      id_cuenta: cuenta.id_cuenta,
      codigo: cuenta.codigo,
      nombre: cuenta.nombre,
      tipo: cuenta.tipo,
      total: movimientos
        .filter(m => m.id_cuenta === cuenta.id_cuenta)
        .reduce((sum, m) => sum + Number(m.monto), 0),
    }));

    return {
      success: true,
      version: '1.0.0',
      fecha_generacion: new Date().toISOString(),
      estadisticas: {
        total_movimientos: movimientos.length,
        total_ingresos,
        total_egresos,
        saldo: total_ingresos - total_egresos,
      },
      movimientos: movimientosFormateados,
      resumen_cuentas: resumenCuentas.filter(c => c.total > 0),
    };
  }

  // Login para aplicación móvil
  async loginMobile(email: string, password: string) {
    // se Usa QueryBuilder para buscar usuario
    const usuario = await this.usuarioRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .andWhere('u.activo = :activo', { activo: true })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT para móvil (expira en 30 días)
    const token = this.jwtService.sign({
      sub: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
      mobile: true,
    }, { expiresIn: '30d' });

    return {
      success: true,
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: `${usuario.nombre} ${usuario.apellido_paterno}`,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}