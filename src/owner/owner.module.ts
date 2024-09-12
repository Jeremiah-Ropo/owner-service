import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner } from './schema/owner.schema';
import { OwnerSchema } from './schema/owner.schema';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
    imports: [
      MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
    ],
  exports: [OwnerService, MongooseModule],
})
export class OwnerModule {}
