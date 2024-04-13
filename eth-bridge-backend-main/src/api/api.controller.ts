import {
  Controller,
  Get,
  Body,
  Post,
  UseInterceptors,
  Param,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiTags } from '@nestjs/swagger';
import { BigintInterceptor } from 'src/interceptors/bigint.interceptor';
import { BridgeDto } from './dto/bridge.dto';

ApiTags('/api');
@Controller('api')
@UseInterceptors(BigintInterceptor)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('/create')
  createTransaction(@Body() bridgeDto: BridgeDto) {
    return this.apiService.bridge(bridgeDto);
  }

  @Get('/tx/:key')
  getTransaction(@Param('key') key: string) {
    return this.apiService.getTransaction(key);
  }

  @Get('/sign/:key')
  getTransactionDepositSign(
    @Param('key') key: string,
    @Query('from') sender: string,
  ) {
    return this.apiService.getTransactionSign(key, sender);
  }
}
