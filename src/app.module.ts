import { Module } from '@nestjs/common';
import { RedisService } from './redis/redis-storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>("DATABASE_URI"),
        entities: [],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false
        }
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development'
    })
  ],
  providers: [
    {
      provide: 'STORAGE',
      useClass: RedisService
    }
  ]
})
export class AppModule { }

// db:
// image: postgres:14
// ports:
//   - '5432:5432'
// environment:
//   - name=value
// volumes:
//   - pgdata:/var/lib/postgresql/data