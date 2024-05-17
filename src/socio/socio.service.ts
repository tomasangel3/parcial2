/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';

@Injectable()
export class SocioService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubs"] });
    }

    async findOne(idSocio: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {idSocio}, relations: ["clubs"] } );
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
    
        return socio;
    }
    
    async create(socio: SocioEntity): Promise<SocioEntity> {
        this.validateEmail(socio.email);
        return await this.socioRepository.save(socio);
    }

    async update(idSocio: string, socio: SocioEntity): Promise<SocioEntity> {
        this.validateEmail(socio.email);
        
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{idSocio}});
        if (!persistedSocio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
     
        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(idSocio: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{idSocio}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);

        await this.socioRepository.remove(socio);
    }

    private validateEmail(email: string): void {
        if (!email.includes('@')) {
            throw new BusinessLogicException("The email provided is invalid", BusinessError.BAD_REQUEST);
        }
    }
}
