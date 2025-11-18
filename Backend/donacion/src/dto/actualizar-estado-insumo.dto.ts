import { IsNotEmpty, IsString } from "class-validator";

export class ActualizarEstadoInsumoDto { 
    @IsString() 
    @IsNotEmpty() 
    nuevoEstado: string; 
}