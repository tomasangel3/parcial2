import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { ClubSocioService } from './club-socio.service';
import { ClubSocioController } from './club-socio.controller';

@Module({
  providers: [ClubSocioService],
  imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  controllers: [ClubSocioController],
})
export class ClubSocioModule {}