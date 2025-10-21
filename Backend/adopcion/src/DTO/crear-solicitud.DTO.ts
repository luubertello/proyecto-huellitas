import { IsNotEmpty, IsBoolean, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CrearSolicitudDto {

  @IsNumber()
  @IsNotEmpty()
  adoptanteId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID del animal es obligatorio.' })
  animalId: number;

  // Preguntas del Formulario
  @IsString()
  @IsNotEmpty({ message: 'El motivo de la adopción no puede estar vacío.' })
  motivoAdopcion: string;

  @IsString()
  @IsNotEmpty({ message: 'La experiencia previa no puede estar vacía.' })
  experienciaPrevia: string;

  @IsBoolean({ message: 'Debe indicar si tiene otros animales.' })
  @IsNotEmpty({ message: 'Debe responder si tiene otros animales.' })
  tieneOtrosAnimales: boolean;

  @IsNumber()
  @IsOptional()
  cantidadPerros?: number;

  @IsNumber()
  @IsOptional()
  cantidadGatos?: number;

  @IsString()
  @IsOptional()
  otrasEspeciesDescripcion?: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe seleccionar un tipo de vivienda.' })
  tipoVivienda: string;

  @IsBoolean()
  @IsOptional()
  tienePatio?: boolean;

  @IsBoolean()
  @IsOptional()
  tieneBalcon?: boolean;

  @IsBoolean()
  @IsOptional()
  balconConProteccion?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Debe describir las medidas de seguridad.' })
  medidasDeSeguridad: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Debe indicar el tiempo que el animal pasaría solo.' })
  @Min(0)
  @Max(24)
  tiempoAnimalSoloHoras: number;

  @IsBoolean({ message: 'Debe aceptar el compromiso de paseos.' })
  @IsNotEmpty({ message: 'Debe aceptar el compromiso de paseos.' })
  compromisoPaseos: boolean;

  @IsBoolean({ message: 'Debe aceptar el compromiso de gastos veterinarios.' })
  @IsNotEmpty({ message: 'Debe aceptar el compromiso de gastos veterinarios.' })
  compromisoGastosVet: boolean;
}