import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubEntity } from './club/club.entity';
import { SocioEntity } from './socio/socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SocioEntity, ClubEntity,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ClubSocial',
      entities: [SocioEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
 })
export class AppModule {}
