import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as process from "process";

import { CustomConfigService } from "./config.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/${process.env.NODE_ENV}.env`],
    }),
  ],
  providers: [ConfigService, CustomConfigService],
  exports: [ConfigService, CustomConfigService],
})
export class CustomConfigModule {}
