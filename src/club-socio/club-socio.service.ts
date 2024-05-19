/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubSocioService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
     
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) {}

    async addSocioToClub(clubId: string, socioId: string): Promise<ClubEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios", "exhibitions"]}) 
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
     
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
      }
     
    async findSocioByClubIdSocioId(clubId: string, socioId: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]}); 
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socios.find(e => e.idSocio === socio.idSocio);
    
        if (!clubSocio)
          throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)
    
        return clubSocio;
    }
     
    async findSociosByClubId(clubId: string): Promise<SocioEntity[]> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        
        return club.socios;
    }
     
    async associateSociosClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
     
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < socios.length; i++) {
          const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].idSocio}});
          if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        club.socios = socios;
        return await this.clubRepository.save(club);
      }
     
    async deleteSocioClub(clubId: string, socioId: string){
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
     
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
     
        const clubSocio: SocioEntity = club.socios.find(e => e.idSocio === socio.idSocio);
     
        if (!clubSocio)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

        club.socios = club.socios.filter(e => e.idSocio !== socioId);
        await this.clubRepository.save(club);
    } 

        async findSocioFromClub(idClub: string, idSocio: string): Promise<SocioEntity> {
          const club: ClubEntity = await this.clubRepository.findOne({ where: { id: idClub }, relations: ["socios"] });
          if (!club)
              throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
  
          const socio: SocioEntity = club.socios.find(s => s.idSocio === idSocio);
          if (!socio)
              throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED);
  
          return socio;
      }
  
      async updateSocioFromClub(idClub: string, idSocio: string): Promise<SocioEntity> {
          const club: ClubEntity = await this.clubRepository.findOne({ where: { id: idClub }, relations: ["socios"] });
          if (!club)
              throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
  
          const socioIndex: number = club.socios.findIndex(s => s.idSocio === idSocio);
          if (socioIndex === -1)
              throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED);
  
          const updatedSocio: SocioEntity = { ...club.socios[socioIndex] };
          club.socios[socioIndex] = updatedSocio;
          await this.clubRepository.save(club);
  
          return updatedSocio;
      }
  
      async deleteSocioFromClub(idClub: string, idSocio: string): Promise<void> {
          const club: ClubEntity = await this.clubRepository.findOne({ where: { id: idClub }, relations: ["socios"] });
          if (!club)
              throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
  
          const initialLength: number = club.socios.length;
          club.socios = club.socios.filter(s => s.idSocio !== idSocio);
          if (club.socios.length === initialLength)
              throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED);
  
          await this.clubRepository.save(club);
      }
  }