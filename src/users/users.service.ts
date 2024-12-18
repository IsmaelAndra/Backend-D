import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudStorageService } from '../utils/cloud-storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, user: UpdateUserDto) {
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }
    console.log('User:', user);
    const UpdateUser = Object.assign(userFound, user);
    return this.usersRepository.save(UpdateUser);
  }

  async updateWithImage(
    file: Express.Multer.File,
    id: number,
    user: UpdateUserDto,
  ) {
    const url = await await this.cloudStorageService.uploadFile(
      file,
      file.originalname,
    );
    console.log('URL: ' + url);

    if (url === undefined && url === null) {
      throw new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }
    user.image = url;
    const UpdateUser = Object.assign(userFound, user);
    return this.usersRepository.save(UpdateUser);
  }

  async remove(id: number) {
    const userFound = await this.usersRepository.findOneBy({ id });

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Eliminar el usuario
    await this.usersRepository.delete(id);

    return { message: 'Usuario eliminado exitosamente' };
  }
}
