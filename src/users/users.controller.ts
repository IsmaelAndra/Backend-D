import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //GET -> OBTENER
  //POST -> CREAR
  //PUT ' PATH -> ACTUALIZAR
  //DELETE -> ELIMINAR
  // @HastRoles(JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    // http://localhost:3000/users
    return this.usersService.findAll();
  }

  @Get(':id') // http://localhost:3000/users/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post() // http://localhost:3000/users
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
  // @HastRoles(JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id') // http://192.168.100.223:3000/users/:id
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }
  // @HastRoles(JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put('upload/:id') // http://192.168.100.223:3000/users/upload
  @UseInterceptors(FileInterceptor('file'))
  uploadWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(pgn|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    this.usersService.updateWithImage(file, id, user);
  }

  // @HastRoles(JwtRole.ADMIN) // Solo usuarios con rol ADMIN pueden eliminar
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id') // http://localhost:3000/users/:id
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
