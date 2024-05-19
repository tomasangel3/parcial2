/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly correo: string;

    @IsNumber()
    @IsNotEmpty()
    readonly fechaNacimiento: number;
}
