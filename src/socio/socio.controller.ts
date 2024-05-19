/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SocioDto } from '../socio.dto';
import { SocioEntity } from '../socio.entity';
import { SocioService } from '../socio.service';

@Controller('socios')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(private readonly socioService: SocioService) {}

  @Get()
  async findAll() {
    return await this.socioService.findAll();
  }

  @Get(':idSocio') 
  async findOne(@Param('socioId') idSocio: string) {
    return await this.socioService.findOne(idSocio);
  }

  @Post()
  async create(@Body() socioDto: SocioDto) {
    const socio = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.create(socio);
  }

  @Put(':socioId')
  async update(@Param('idSocio') idSocio: string, @Body() socioDto: SocioDto) {
    const socio = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.update(idSocio, socio);
  }

  @Delete(':socioId')
  @HttpCode(204)
  async delete(@Param('socioId') idSocio: string) {
    return await this.socioService.delete(idSocio);
  }

}
