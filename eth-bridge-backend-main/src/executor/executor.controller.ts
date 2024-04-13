import { Controller } from '@nestjs/common';
import { ExecutorService } from './executor.service';

@Controller()
export class ExecutorController {
  constructor(private readonly executorService: ExecutorService) {}
}
