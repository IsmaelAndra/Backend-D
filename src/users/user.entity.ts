import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Rol } from '../roles/rol.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  notification_token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;

  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'id_user',
    },
    inverseJoinColumn: {
      name: 'id_rol',
    },
  })
  @ManyToMany(() => Rol, (rol) => rol.users)
  roles: Rol[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, Number(process.env.HASH_SALT));
  }
}
