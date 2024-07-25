import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Toni o iubeste pe Daria cel mai mult';
  }
}
