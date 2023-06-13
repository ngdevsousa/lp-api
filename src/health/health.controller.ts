import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('')
  async ping(): Promise<string> {
    return 'OK!';
  }
}
