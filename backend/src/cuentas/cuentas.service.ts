import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaContable } from './entities/cuenta.entity';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@Injectable()
export class CuentasService {
  constructor(
    @InjectRepository(CuentaContable)
    private cuentaRepository: Repository<CuentaContable>,
  ) {}

  async create(createCuentaDto: CreateCuentaDto): Promise<CuentaContable> {
    // Verificar si ya existe una cuenta con ese código
    const existe = await this.cuentaRepository.findOne({
      where: { codigo: createCuentaDto.codigo },
    });
    
    if (existe) {
      throw new ConflictException(`La cuenta con código ${createCuentaDto.codigo} ya existe`);
    }

    // Si tiene cuenta padre, verificar que exista
    if (createCuentaDto.id_cuenta_padre) {
      const padre = await this.findOne(createCuentaDto.id_cuenta_padre);
      if (!padre) {
        throw new NotFoundException(`Cuenta padre con ID ${createCuentaDto.id_cuenta_padre} no encontrada`);
      }
      // El nivel del hijo es nivel del padre + 1
      createCuentaDto.nivel = padre.nivel + 1;
    }

    const cuenta = this.cuentaRepository.create(createCuentaDto);
    return await this.cuentaRepository.save(cuenta);
  }

  async findAll(): Promise<CuentaContable[]> {
    return await this.cuentaRepository.find({
      relations: {cuenta_padre:true},
      //relations: ['cuenta_padre'],
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CuentaContable> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta: id },
      relations: {cuenta_padre:true},
      //relations: ['cuenta_padre'],
    });
    
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }
    return cuenta;
  }

  async findByCodigo(codigo: string): Promise<CuentaContable> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { codigo },
      relations: {cuenta_padre:true},
      //relations: ['cuenta_padre'],
    });
    
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con código ${codigo} no encontrada`);
    }
    return cuenta;
  }

  async findByTipo(tipo: string): Promise<CuentaContable[]> {
    return await this.cuentaRepository.find({
      where: { tipo },
      relations: {cuenta_padre:true},
      //relations: ['cuenta_padre'],
      order: { codigo: 'ASC' },
    });
  }

  async findHijas(id: number): Promise<CuentaContable[]> {
    return await this.cuentaRepository.find({
      where: { id_cuenta_padre: id },
      order: { codigo: 'ASC' },
    });
  }

  async update(id: number, updateCuentaDto: UpdateCuentaDto): Promise<CuentaContable> {
    const cuenta = await this.findOne(id);
    
    // Si se actualiza el código, verificar que no exista otro
    if (updateCuentaDto.codigo && updateCuentaDto.codigo !== cuenta.codigo) {
      const existe = await this.cuentaRepository.findOne({
        where: { codigo: updateCuentaDto.codigo },
      });
      if (existe) {
        throw new ConflictException(`La cuenta con código ${updateCuentaDto.codigo} ya existe`);
      }
    }

    // Si se actualiza la cuenta padre, recalcular nivel
    if (updateCuentaDto.id_cuenta_padre && updateCuentaDto.id_cuenta_padre !== cuenta.id_cuenta_padre) {
      const padre = await this.findOne(updateCuentaDto.id_cuenta_padre);
      if (!padre) {
        throw new NotFoundException(`Cuenta padre con ID ${updateCuentaDto.id_cuenta_padre} no encontrada`);
      }
      updateCuentaDto.nivel = padre.nivel + 1;
    }

    Object.assign(cuenta, updateCuentaDto);
    return await this.cuentaRepository.save(cuenta);
  }

  async remove(id: number): Promise<void> {
    const cuenta = await this.findOne(id);
    
    // Verificar si tiene hijas
    const hijas = await this.findHijas(id);
    if (hijas.length > 0) {
      throw new ConflictException(`No se puede eliminar la cuenta porque tiene ${hijas.length} subcuentas asociadas`);
    }
    
    await this.cuentaRepository.remove(cuenta);
  }

  // Obtener árbol completo de cuentas
  async getTree(): Promise<any[]> {
    const cuentas = await this.findAll();
    return this.buildTree(cuentas, null);
  }

  // Método privado para construir el árbol (definido correctamente)
  private buildTree(cuentas: CuentaContable[], parentId: number | null): any[] {
    return cuentas
      .filter(cuenta => {
        // Manejar null y undefined correctamente
        if (parentId === null) {
          return cuenta.id_cuenta_padre === null || cuenta.id_cuenta_padre === undefined;
        }
        return cuenta.id_cuenta_padre === parentId;
      })
      .map(cuenta => ({
        id_cuenta: cuenta.id_cuenta,
        codigo: cuenta.codigo,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        nivel: cuenta.nivel,
        descripcion: cuenta.descripcion,
        children: this.buildTree(cuentas, cuenta.id_cuenta)
      }));
  }

  // Obtener solo cuentas de nivel 1 (principales)
  async findPrincipales(): Promise<CuentaContable[]> {
    return await this.cuentaRepository.find({
      where: { nivel: 1 },
      order: { codigo: 'ASC' },
    });
  }
}