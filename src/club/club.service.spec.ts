/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombreClub: faker.company.companyName(),
        fechaFundacion: faker.date.past(),
        image: faker.image.imageUrl(),
        descripcion: faker.lorem.sentence(),
      });
      clubsList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.idClub);
    expect(club).not.toBeNull();
    expect(club.nombreClub).toEqual(storedClub.nombreClub);
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion);
    expect(club.image).toEqual(storedClub.image);
    expect(club.descripcion).toEqual(storedClub.descripcion);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      idClub: "",
      nombreClub: faker.company.companyName(),
      fechaFundacion: faker.date.past(),
      image: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: []
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: { idClub: newClub.idClub } });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombreClub).toEqual(newClub.nombreClub);
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion);
    expect(storedClub.image).toEqual(newClub.image);
    expect(storedClub.descripcion).toEqual(newClub.descripcion);
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubsList[0];
    club.nombreClub = "Nuevo club";
    club.descripcion = "Una descripcion del club bastante corta.";

    const updatedClub: ClubEntity = await service.update(club.idClub, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.idClub } });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombreClub).toEqual(club.nombreClub);
    expect(storedClub.descripcion).toEqual(club.descripcion);
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, nombreClub: "Nuevo club", descripcion: "Algo por poner aqui."
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.idClub);

    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.idClub } });
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.idClub);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
});
