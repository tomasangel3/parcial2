/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    readonly nombreClub: string;

    @IsNumber()
    @IsNotEmpty()
    readonly fechaFundacion: number;

    @IsString()
    @IsNotEmpty()
    readonly image: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
