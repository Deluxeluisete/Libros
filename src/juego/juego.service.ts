import { Injectable } from '@nestjs/common';
import { Juego } from './interfaces/juego/juego.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JuegoDto } from './dto/juego-dto/juego-dto';

@Injectable()
//definimos los servicios de acceso a la bd para nuestro modulo juegos
export class JuegoService {
  juegos: Juego[] = [];
  constructor(
    @InjectModel('Juego')
    private readonly juegoModel: Model<Juego>,
  ) {}

  async listar(): Promise<Juego[]> {
    return await this.juegoModel.find().exec();
  }
  async buscarPorId(id: string): Promise<Juego> {
    return await this.juegoModel.findById(id).exec();
  }

  async insertar(crearJuegoDto: JuegoDto): Promise<Juego> {
    const nuevaJuego = new this.juegoModel(crearJuegoDto);
    return await nuevaJuego.save();
  }
  async borrar(id: string): Promise<Juego> {
    return await this.juegoModel.findByIdAndRemove(id).exec();
  }
  async borrarEdiciones(idJuego: string, idEdicion: string): Promise<Juego> {
    return await this.juegoModel
      .findByIdAndUpdate(
        idJuego,
        {
          $pull: { Ediciones: { _id: idEdicion } },
        },
        { new: true },
      )
      .exec();
  }

  async actualizar(id: string, actualizarJuegoDto: JuegoDto): Promise<Juego> {
    return await this.juegoModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            nombre: actualizarJuegoDto.nombre,
            descripcion: actualizarJuegoDto.descripcion,
            imagen: actualizarJuegoDto.imagen,
            precio: actualizarJuegoDto.precio,
            prioridad: actualizarJuegoDto.edad,
            fecha: actualizarJuegoDto.jugadores,
            tipo: actualizarJuegoDto.tipo,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();
  }
  async actualizarEdiciones(
    id: string,
    edicion: string,
    anyo: number,
  ): Promise<Juego> {
    return await this.juegoModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            Ediciones: [{ edicion: edicion, anyo: anyo }],
          },
        },
        { new: true, runValidators: true },
      )

      .exec();
  }
}
