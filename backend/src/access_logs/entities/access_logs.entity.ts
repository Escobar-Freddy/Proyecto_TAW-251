import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn()
  id_log: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @Column({ length: 45 })
  ip: string;

  @Column({ length: 10 })
  evento: string;

  @Column({ type: 'text' })  // ✅ Cambiado a TEXT para evitar problemas
  browser: string;

  @CreateDateColumn({ name: 'fecha_hora', type: 'timestamp' })
  fecha_hora: Date;
}