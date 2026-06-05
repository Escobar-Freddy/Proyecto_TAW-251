import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  OneToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('tesorero')
export class Tesorero {
  @PrimaryGeneratedColumn()
  id_tesorero: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
  // id creado en la tabla usuarios de tipo numerico y autogenerado
  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario: number;
  // ademas de ser tesorero puede ser auxilicar o vocal
  @Column({ length: 30 })
  cargo: string;
  //fecha donde esta iniciando el cargo o su periodo
  @Column({ type: 'date', name: 'fecha_inicio_cargo' })
  fecha_inicio_cargo: Date;
  //fecha donde ha concluido el cargo o su periodo
  @Column({ type: 'date', name: 'fecha_fin_cargo', nullable: true })
  fecha_fin_cargo: Date | null;
  //fecha de creacion 
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
  //fecha de actualizacion
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}