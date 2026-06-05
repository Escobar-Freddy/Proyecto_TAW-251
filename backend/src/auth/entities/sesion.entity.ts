import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('sesiones_activas')
export class SesionActiva {
  @PrimaryGeneratedColumn()
  id_sesion: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @Column({ type: 'text' })  // ✅ Cambiado de VARCHAR(100) a TEXT
  token: string;

  @Column({ length: 45 })
  ip: string;

  @Column({ type: 'text' })  // ✅ Cambiado de VARCHAR(100) a TEXT
  browser: string;

  @CreateDateColumn({ name: 'fecha_inicio' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date | null;

  @Column({ type: 'boolean', default: true })
  activa: boolean;
}