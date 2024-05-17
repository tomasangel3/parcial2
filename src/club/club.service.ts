/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"] });
    }

    async findOne(idClub: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {idClub}, relations: ["socios"] });
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
    
        return club;
    }
    
    async create(club: ClubEntity): Promise<ClubEntity> {
        this.validateDescription(club.descripcion);
        return await this.clubRepository.save(club);
    }

    async update(idClub: string, club: ClubEntity): Promise<ClubEntity> {
        this.validateDescription(club.descripcion);
        
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{idClub}});
        if (!persistedClub)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
     
        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(idClub: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{idClub}});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);

        await this.clubRepository.remove(club);
    }

    private validateDescription(descripcion: string): void {
        if (descripcion.length > 100) {
            throw new BusinessLogicException("The description provided is too long", BusinessError.BAD_REQUEST);
        }
    }
}
