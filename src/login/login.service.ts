import { Injectable } from '@nestjs/common';
import { Login } from './interfaces/login/login.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login-dto/login-dto';

@Injectable()
//definimos los servicios de acceso a la bd para nuestro modulo login
export class LoginService {
  usuarios: Login[] = [];
  constructor(
    @InjectModel('Login')
    private readonly loginModel: Model<Login>,
  ) {}

  async listar(): Promise<Login[]> {
    return await this.loginModel.find().exec();
  }
  async buscarPorId(id: string): Promise<Login> {
    return await this.loginModel.findById(id).exec();
  }

  async insertar(crearLoginDto: LoginDto): Promise<Login> {
    const nuevaLogin = new this.loginModel(crearLoginDto);
    return await nuevaLogin.save();
  }
  async borrar(id: string): Promise<Login> {
    return await this.loginModel.findByIdAndRemove(id).exec();
  }

  async actualizar(id: string, actualizarLoginDto: LoginDto): Promise<Login> {
    return await this.loginModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            login: actualizarLoginDto.login,
            password: actualizarLoginDto.password,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();
  }
}
