import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('usuarios') // define nombre de la tabla
export class Usuario {
  @PrimaryGeneratedColumn() //auto incremental
  id_usuario: number;

  @Column({ length: 30 })
  nombre: string;

  @Column({ length: 25 })
  apellido_paterno: string;

  @Column({ length: 25 })
  apellido_materno: string;

  @Column({ type: 'text' }) //sin limite de longitud
  direccion: string;

  @Column({ length: 10 })
  celular: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ length: 30 })
  distrito: string;

  @Column({ length: 30 })
  region: string;

  @Column({ length: 50 })
  iglesia: string;

  @Column({ length: 150, unique: true }) // unique no puede repetirse el email
  email: string;

  @Column({ type: 'text' })
  password_hash: string;  //Contraseña encriptada con bcrypt

  @Column({ length: 20, default: 'weak' })
  password_strength: string; // 'weak', 'medium', 'strong'

  @Column({ length: 20, default: 'usuario' })
  rol: string; // 'admin', 'tesorero', 'usuario'

  @Column({ type: 'boolean', default: true })
  activo: boolean; // false = eliminado lógico

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}