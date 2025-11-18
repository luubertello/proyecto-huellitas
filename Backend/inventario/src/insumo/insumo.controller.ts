
import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards,
  ValidationPipe,
  Query 
} from '@nestjs/common';
import { InsumoService } from './insumo.service';
import { CrearInsumoDto } from '../dto/crear-insumo.dto';
import { ActualizarStockDto } from '../dto/actualizar-stock.dto';
import { RegistrarIngresoDto } from 'src/dto/registrar-ingreso-donacion.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventario')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class InsumoController {
  constructor(private readonly insumoService: InsumoService) {}


  // GET /inventario
  @Get()
  @Roles('Admin General', 'Responsable de Inventarios')
  async findAll() {
    return this.insumoService.findAll();
  }


  // GET /inventario/buscar?q=...
  @Get('buscar')
  @Roles('Admin General', 'Responsable de Inventarios')
  async search(@Query('q') termino: string) {
    return this.insumoService.search(termino);
  }

  // POST /inventario/insumo
  @Post('insumo')
  @Roles('Admin General', 'Responsable de Inventarios')
  async create(@Body(new ValidationPipe()) dto: CrearInsumoDto) {
    return this.insumoService.create(dto);
  }

  // PATCH /inventario/:id/stock
  @Patch(':id/stock')
  @Roles('Admin General', 'Responsable de Inventarios')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: ActualizarStockDto,
  ) {
    return this.insumoService.updateStock(id, dto);
  }

  // POST /inventario/ingresar-donacion-recibida
  @Post('ingresar-donacion-recibida')
  @Roles('Admin General')
  async registrarIngreso(
    @Body(new ValidationPipe()) dto: RegistrarIngresoDto
  ) {
    return this.insumoService.ingresarDonacionRecibida(dto);
  }
}