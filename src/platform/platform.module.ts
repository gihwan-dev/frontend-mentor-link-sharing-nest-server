import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platforms } from './entities/platform.entity';
import { Users } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Platforms, Users])],
  controllers: [PlatformController],
  providers: [PlatformService],
})
export class PlatformModule {}
