import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { LoginDto } from './dto/login-dto/login-dto';
import { LoginService } from './login.service';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('login')
  async listar(@Res() res) {
    return res.render('auth_login');
  }

  @Get('register')
  async listarRegister(@Res() res) {
    return res.render('auth_register');
  }
  // Formulario de login
  @Post('login')
  async login(@Res() res, @Req() req, @Body() body) {
    const usu = body.usuario;
    const pass = body.password;
    const resultado = await this.loginService.listar();
    // const existe = resultado.filter(
    //   (usuario) => usuario.login == usu && usuario.password == pass,
    // );

    const user = resultado.find((v) => v.login === body.usuario);
    const [salt, key] = user.password.split(':');
    const hashedBuffer = scryptSync(body.password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    const match = timingSafeEqual(hashedBuffer, keyBuffer);
    if (match) {
      req.session.usuario = user.login;
      return res.render('admin_juegos');
    } else {
      res.render('auth_login', {
        error: 'Error usuario o contraseña incorrecta',
      });
    }
  }
  // POST /juegos :
  // Modificamos el juego desde el formulario
  @Post('register')
  async insertarUsuario(@Res() res, @Body() body) {
    try {
      const salt = randomBytes(16).toString('hex');
      const hashedPassword = scryptSync(body.password, salt, 64).toString(
        'hex',
      );

      body.password = `${salt}:${hashedPassword}`;
      await this.loginService.insertar(body);
      return res.render('auth_login');
    } catch (error) {
      res.render('publico_error', { error: 'Error al insertar el usuario' });
    }
  }

  @Get('logout')
  async cerrarSession(@Res() res, @Req() req) {
    req.session.destroy();
    res.render('publico_index');
  }
}
