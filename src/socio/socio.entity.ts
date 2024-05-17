import { ClubEntity } from "../club/club.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn("uuid")
    idSocio: string;
 
    @Column()
    nombre: string;
 
    @Column()
    correo: string;
 
    @Column()
    fechaNacimiento: Date;

    @ManyToMany(() => ClubEntity, club => club.socios)
    clubs: ClubEntity[];

}