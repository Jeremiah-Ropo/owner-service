// import { Controller, Injectable } from '@nestjs/common';
// import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
// import { OwnerService } from '../owner/owner.service';

// @Injectable()
// export class OwnerEventService {
//   constructor(private readonly ownerService: OwnerService) {}
//   @RabbitRPC({
//     exchange: 'ownerExchange',
//     routingKey: 'owner.getById',  // Routing key for Owner retrieval
//       queue: 'owner-getById-queue', // Queue name for Owner retrieval
//       queueOptions: { durable: true },
//   })
     
//   public async getOwnerById(message: { ownerId: string }) {
//     console.log('here')
      
//     return await this.ownerService.findById(message.ownerId); // Adjust this based on your actual retrieval method
//   }
// }
