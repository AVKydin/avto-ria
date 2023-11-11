import { CustomConfigModule } from './config.module';
import { CustomConfigService } from './config.service';

export const redisConfig: any = {
  imports: [CustomConfigModule],
  useFactory: (customConfigService: CustomConfigService): { url: string } => {
    return {
      url: customConfigService.redis,
    };
  },
  inject: [CustomConfigService],
};
