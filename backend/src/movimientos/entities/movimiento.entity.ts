import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CuentaContable } from '../../cuentas/entities/cuenta.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id_movimiento: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_registra' })
  usuario_registra: Usuario;
  
  @Column({ name: 'id_usuario_registra' })
  id_usuario_registra: number;

  @ManyToOne(() => CuentaContable)
  @JoinColumn({ name: 'id_cuenta' })
  cuenta: CuentaContable;
  
  @Column({ name: 'id_cuenta' })
  id_cuenta: number;

  @Column({ length: 10 })
  tipo: string; // 'ingreso' o 'egreso'

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_movimiento' })
  fecha_movimiento: Date;

  @Column({ length: 50, nullable: true, name: 'numero_recibo' })
  numero_recibo: string;

  @Column({ length: 200, nullable: true, name: 'persona_origen' })
  persona_origen: string;

  @Column({ length: 150, nullable: true, name: 'iglesia_origen' })
  iglesia_origen: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at: Date; // Soft delete
}