import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'rxjs';
import * as process from 'node:process';
import { configuration } from './public/configuration';
import { validate } from 'class-validator';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './users/entities/user.entity';

const ENTITIES = [ User ];


@Module({
  imports: [ConfigModule.forRoot({ envFilePath: [ `config/${process.env.NODE_ENV || "development"}.env`, '.env'],
    load: [configuration],
    isGlobal: true,
    cache: true,
    validate,
  }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService<ConfigModule>) => {
        return {
          type: "postgres",
          host: config.get("DB_HOST"),
          port: config.get("DB_PORT"),
          username: config.get("DB_USERNAME"),
          password: config.get("DB_PASSWORD"),
          database: config.get("DB_DATABASE"),
          entities: ENTITIES,
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        }
      },
      inject: [ConfigService],
  })
    //
    //
    //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
