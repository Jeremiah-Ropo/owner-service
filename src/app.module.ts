import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerModule } from './owner/owner.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [OwnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
