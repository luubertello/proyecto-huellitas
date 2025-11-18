import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { InsumoService } from './insumo.service';
import { CrearInsumoDto } from '../dto/crear-insumo.dto';
import { ActualizarStockDto } from '../dto/actualizar-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventario')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class InsumoController {
  constructor(private readonly insumoService: InsumoService) {}

  @Get()
  @Roles('Admin General', 'Responsable de Inventarios')
  async findAll() {
    return this.insumoService.findAll();
  }

  @Post('insumo')
  @Roles('Admin General', 'Responsable de Inventarios')
  async create(@Body(new ValidationPipe()) dto: CrearInsumoDto) {
    return this.insumoService.create(dto);
  }

  @Patch(':id/stock')
  @Roles('Admin General', 'Responsable de Inventarios')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: ActualizarStockDto,
  ) {
    return this.insumoService.updateStock(id, dto);
  }
}