import { SocioEntity } from "../socio/socio.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn("uuid")
    idClub: string;
 
    @Column()
    nombreClub: string;
 
    @Column()
    fechaFundacion: string;
 
    @Column()
    image: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    socios: SocioEntity[];

}