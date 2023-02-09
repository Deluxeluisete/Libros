import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
  Res,
  Session,
  UseInterceptors,
  Redirect,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JuegoDto } from './dto/juego-dto/juego-dto';
import { JuegoService } from './juego.service';
@Controller()
export class JuegoController {
  constructor(private readonly juegoService: JuegoService) {}
  // / (raíz de la aplicación): renderizará la vista publico_index de la carpeta de vistas, sin parámetros.
  @Get()
  async raiz(@Res() res) {
    try {
      return res.render('publico_index');
    } catch {
      res.render('publico_error', {
        error: 'Error en la aplicacion',
      });
    }
  }
  //  /buscar : buscará todos los juegos cuyo nombre contenga el texto que se le pasará en el cuerpo
  @Post('/buscar')
  async buscarJuego(@Res() res, @Body() body) {
    try {
      const resultado = await (
        await this.juegoService.listar()
      ).filter((j) => j.nombre.includes(body.textoBusqueda));
      return res.render('publico_index', { juegos: resultado });
    } catch (error) {
      res.render('publico_error', {
        error: 'Se ha producido un error en la búsqueda',
      });
    }
  }
  // GET /juegos/nuevo : nos poermitira subir nuevos juegos .
  @Get('juegos/nuevo')
  async nuevoJuegoForm(@Res() res, @Session() session) {
    try {
      if (!session.usuario) return res.render('auth_login');
      return res.render('admin_juegos_form');
    } catch (error) {
      res.render('admin_error', { error: 'algo ha ido mal' });
    }
  }
  @Get('ediciones/nueva/:id')
  async nuevoEdicionesForm(
    @Res() res,
    @Param('id') id: string,
    @Session() session,
  ) {
    try {
      if (!session.usuario) return res.render('auth_login');
      const resultado = await this.juegoService.buscarPorId(id);

      return res.render('admin_ediciones_form', { juego: resultado });
    } catch (error) {
      res.render('admin_error', { error: 'algo ha ido mal' });
    }
  }

  // Mostramos el juego que tenga el id indicado en la peticion
  @Get('juegos/:id')
  async juegosPorId(@Res() res, @Param('id') id: string) {
    try {
      const resultado = await this.juegoService.buscarPorId(id);
      if (resultado.nombre.length > 0) {
        return res.render('publico_juego', { juego: resultado });
      } else {
        return res.render('publico_error', { error: 'juego no encontrado' });
      }
    } catch (error) {
      res.render('publico_error', { error: 'juego no encontrado' });
    }
  }

  // GET obtenemos el listado de todos los juegos
  @Get('juegos')
  async listar(@Res() res, @Session() session) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });
      const resultado = await this.juegoService.listar();
      return res.render('admin_juegos', { juegos: resultado });
    } catch (error) {
      res.render('admin_error', { error: 'juego no encontrado' });
    }
  }

  // GET /juegos/editar/:id : renderizará la vista admin_juegos_form pasándole como parámetro el
  @Get('juegos/editar/:id')
  async editarJuego(@Res() res, @Param('id') id: string, @Session() session) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });
      const resultado = await this.juegoService.buscarPorId(id);
      if (resultado.nombre.length > 0) {
        return res.render('admin_juegos_form', { juego: resultado });
      } else {
        return res.render('admin_error', { mensaje: 'juego no encontrado' });
      }
    } catch {
      return res.render('admin_error', { error: 'juego no encontrado' });
    }
  }
  // POST /juegos :
  // Insertamos el juego desde el formulario
  @Post('juegos')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  async insertarJuego(
    @Res() res,
    @Body() body,
    @Session() session,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });
      const resultado = await this.juegoService.insertar(body);
      this.listar(res, session);
    } catch (error) {
      res.render('admin_error', { error: 'Error al insertar el juego' });
    }
  }

  @Post('juegos/ediciones/:id')
  async insertarEdicionJuego(
    @Res() res,
    @Param('id') id: string,
    @Body() body,
    @Session() session,
  ) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });

      const resultado = await this.juegoService.actualizarEdiciones(
        id,
        body.edicion,
        body.anyo,
      );
      this.listar(res, session);
    } catch (error) {
      res.render('admin_error', { error: 'Error al insertar el juego' });
    }
  }

  // Modificar juego - formulario
  @Post('juegos/:id')
  async modificarJuego(
    @Res() res,
    @Param('id') id: string,
    @Body() body,
    @Session() session,
  ) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });
      await this.juegoService.actualizar(id, body);
      this.listar(res, session);
    } catch (error) {
      res.render('admin_error', { error: 'Error al modificar el juego' });
    }
  }

  // Borrar juego - botón de borrar
  @Post('juegos/borrar/:id')
  async borrarJuego(@Res() res, @Param('id') id: string, @Session() session) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });
      await this.juegoService.borrar(id);
      this.listar(res, session);
    } catch (error) {
      res.render('admin_error', { error: 'Error al borrar el juego' });
    }
  }

  @Post('juegos/borrarediciones/:idjuego/:idedicion')
  async borrarEdicionJuego(
    @Res() res,
    @Param('idjuego') idjuego: string,
    @Param('idedicion') idedicion: string,
    @Session() session,
  ) {
    try {
      if (!session.usuario)
        return res.render('auth_login', {
          error: 'El usuario debe estar logueado',
        });
      await this.juegoService.borrarEdiciones(idjuego, idedicion);
      this.listar(res, session);
    } catch (error) {
      res.render('admin_error', { error: 'Error al borrar el juego' });
    }
  }
}
