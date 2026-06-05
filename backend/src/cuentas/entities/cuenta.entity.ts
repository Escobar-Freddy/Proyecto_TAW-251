import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';

@Entity('cuentas_contables')
export class CuentaContable {
  @PrimaryGeneratedColumn()
  id_cuenta: number;

  @Column({ length: 10, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 10 })
  tipo: string; // 'ingreso' o 'egreso'

  @Column({ default: 1 })
  nivel: number;

  @ManyToOne(() => CuentaContable, { nullable: true })
  @JoinColumn({ name: 'id_cuenta_padre' })
  cuenta_padre: CuentaContable;

  @Column({ nullable: true })
  id_cuenta_padre: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}