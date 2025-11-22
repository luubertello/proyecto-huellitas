
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CategoriaInsumoService } from 'src/categoria-insumo/categoria-insumo.service';

@Controller('inventario')
export class InsumoController {
  constructor(private readonly insumoService: InsumoService,
  private readonly categoriaInsumoService: CategoriaInsumoService) {}


  // GET /inventario
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Get()
  @Roles('Admin General', 'Responsable de Inventarios')
  async findAll() {
    return this.insumoService.findAll();
  }


  // GET /inventario/buscar?q=...
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Get('buscar')
  @Roles('Admin General', 'Responsable de Inventarios')
  async search(@Query('q') termino: string) {
    return this.insumoService.search(termino);
  }

  // POST /inventario/insumo
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Post('insumo')
  @Roles('Admin General', 'Responsable de Inventarios')
  async create(@Body(new ValidationPipe()) dto: CrearInsumoDto) {
    return this.insumoService.create(dto);
  }

  // PATCH /inventario/:id/stock
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Patch(':id/stock')
  @Roles('Admin General', 'Responsable de Inventarios')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: ActualizarStockDto,
  ) {
    return this.insumoService.updateStock(id, dto);
  }

  @Get('categorias')
  async findAllCategorias() {
    return this.categoriaInsumoService.findAll();
  }

}