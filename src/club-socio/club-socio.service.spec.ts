/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubSocioService } from './club-socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombre: faker.company.companyName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past()
      })
      sociosList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.name.findName(),
      fechaFundacion: faker.date.past(),
      image: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: sociosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSocioClub should add a socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.companyName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past()
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.findName(),
      fechaFundacion: faker.date.past(),
      image: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
    })

    const result: ClubEntity = await service.addSocioClub(newClub.idClub, newSocio.idSocio);

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(newSocio.nombre)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento)
  });

  it('addSocioClub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.companyName(),
      fechaFundacion: faker.date.past(),
      image: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.addSocioClub(newClub.idClub, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('addSocioClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
        nombre: faker.company.companyName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past()
    });

    await expect(() => service.addSocioClub("0", newSocio.idSocio)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findSocioByClubIdSocioId should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findSocioByClubIdSocioId(club.idClub, socio.idSocio)
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toBe(socio.nombre);
    expect(storedSocio.correo).toBe(socio.correo);
    expect(storedSocio.fechaNacimiento).toBe(socio.fechaNacimiento);
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid socio', async () => {
    await expect(() => service.findSocioByClubIdSocioId(club.idClub, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.findSocioByClubIdSocioId("0", socio.idSocio)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findSocioByClubIdSocioId should throw an exception for a socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.companyName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past()
    });

    await expect(() => service.findSocioByClubIdSocioId(club.idClub, newSocio.idSocio)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");
  });

  it('findSociosByClubId should return socios by club', async () => {
    const socios: SocioEntity[] = await service.findSociosByClubId(club.idClub);
    expect(socios.length).toBe(5)
  });

  it('findSociosByClubId should throw an exception for an invalid club', async () => {
    await expect(() => service.findSociosByClubId("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('associateSociosClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
        nombre: faker.company.companyName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past()
    });

    const updatedClub: ClubEntity = await service.associateSociosClub(club.idClub, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socios[0].correo).toBe(newSocio.correo);
    expect(updatedClub.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);
  });

  it('associateSociosClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
        nombre: faker.company.companyName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past()
    });

    await expect(() => service.associateSociosClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('associateSociosClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.idSocio = "0";

    await expect(() => service.associateSociosClub(club.idClub, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('deleteSocioToClub should remove a socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];

    await service.deleteSocioClub(club.idClub, socio.idSocio);

    const storedClub: ClubEntity = await clubRepository.findOne({ where: { id: club.idClub }, relations: ["socios"] });
    const deletedSocio: SocioEntity = storedClub.socios.find(a => a.idSocio === socio.idSocio);

    expect(deletedSocio).toBeUndefined();
  });

  it('deleteSocioToClub should thrown an exception for an invalid socio', async () => {
    await expect(() => service.deleteSocioClub(club.idClub, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('deleteSocioToClub should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.deleteSocioClub("0", socio.idSocio)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('deleteSocioToClub should thrown an exception for a non-associated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      name: faker.company.companyName(),
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(() => service.deleteSocioClub(club.idClub, newSocio.idSocio)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");
  });

});
