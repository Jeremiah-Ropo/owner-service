import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner } from './schema/owner.schema';
import { OwnerSchema } from './schema/owner.schema';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import e from 'express';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
    imports: [
      MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
      RabbitMQModule.forRoot(RabbitMQModule, 
        {
          uri: 'amqp://localhost:5672',
          exchanges: [
            {
              name: 'ownerExchange',
              type: 'topic'
            }
          ]
        })
    ],
  exports: [OwnerService, MongooseModule],
})
export class OwnerModule {}
