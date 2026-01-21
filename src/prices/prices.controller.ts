import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import {
  GetAggregatedPricesDto,
  GetRegionalPricesDto,
  SubmitPriceDto,
} from './dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  /**
   * GET /api/v1/prices/aggregated
   * Get verified and unverified average prices for a specific region and city
   */
  @Get('aggregated')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAggregatedPrices(@Query() dto: GetAggregatedPricesDto) {
    return this.pricesService.getAggregatedPrices(dto);
  }

  /**
   * GET /api/v1/prices/regional
   * Get regional price data for all Philippine regions
   */
  @Get('regional')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRegionalPrices(@Query() dto: GetRegionalPricesDto) {
    return this.pricesService.getRegionalPrices(dto);
  }

  /**
   * POST /api/v1/prices/submit
   * Submit a new price input (authenticated users only)
   * TODO: Add authentication guard
   */
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitPrice(@Body() dto: SubmitPriceDto) {
    // TODO: Get userId from authenticated session
    // For now using a placeholder UUID
    const userId = '00000000-0000-0000-0000-000000000000';

    return this.pricesService.submitPrice(userId, dto);
  }
}
