/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SocioDto } from '../socio.dto';
import { SocioEntity } from '../socio.entity';
import { ClubSocioService } from './club-socio.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubMemberController {
    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':idClub/socios/:idSocio')
    async addSocioToClub(@Param('idClub') idClub: string, @Param('idSocio') idSocio: string){
        return await this.clubSocioService.addSocioToClub(idClub, idSocio);
    }

    @Get(':idClub/socios')
    async findSociosFromClub(@Param('idClub') idClub: string){
        return await this.clubSocioService.findSociosByClubId(idClub);
    }

    @Get(':idClub/socios/:idSocio')
    async findSocioFromClub(@Param('idClub') idClub: string, @Param('idSocio') idSocio: string){
        return await this.clubSocioService.findSocioFromClub(idClub, idSocio);
    }

    @Put(':idClub/socios/:idSocio')
    async updateSocioFromClub(@Body() socioDto: SocioDto, @Param('idClub') idClub: string, @Param('idSocio') idSocio: string){
        const member = plainToInstance(SocioEntity, socioDto);
        return await this.clubSocioService.updateSocioFromClub(idClub, idSocio);
    }

    @Delete(':idClub/socios/:idSocio')
    @HttpCode(204)
    async deleteSocioClub(@Param('idClub') idClub: string, @Param('idSocio') idSocio: string){
        return await this.clubSocioService.deleteSocioFromClub(idClub, idSocio);
    }
}
