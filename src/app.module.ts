import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JuegoModule } from './juego/juego.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    LoginModule,
    JuegoModule,
    MongooseModule.forRoot('mongodb://mymongodb/juegos'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
