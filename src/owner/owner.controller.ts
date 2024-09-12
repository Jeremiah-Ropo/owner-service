import {
  Controller,
  ParseIntPipe,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Controller('owner')
export class OwnerController {
  constructor(
    private readonly ownerService: OwnerService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Post()
  async create(@Body() createOwnerDto: CreateOwnerDto) {
    try {
      const ownerExist = await this.ownerService.findOne({
        name: createOwnerDto.name,
      });
      if (!ownerExist) {
        throw new HttpException(
          'Owner with this name already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const owner = await this.ownerService.create(createOwnerDto);
      this.amqpConnection.publish('ownerExchange', 'owner.updated', {
        owner,
      });
      return owner;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Get()
  async findAll(
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('email') email?: string,
    @Query('name') name?: string,
  ) {
    try {
      const query = {};
      if (name) query['name'] = name;
      if (email) query['email'] = email;
      return this.ownerService.findAll(query, { page, limit });
    } catch (error) {
      throw new HttpException(error.message, error.statusCode)
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.ownerService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode)
    }
  }

  @Get()
  async findOne(@Query('field') field: string, @Query('value') value: string) {
    try {
      if (!field || !value) {
        throw new NotFoundException('Field or Value is missing');
      }

      const query = { [field]: value };
      const owner = await this.ownerService.findOne(query);
      if (!owner) {
        throw new NotFoundException(
          `Owner with ${field}: ${value} is not found`,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ) {
    try {
      const ownerId = await this.ownerService.findById(id);
      if (!ownerId) {
        throw new NotFoundException('Owner with the id not found');
      }
      const updatedOwner = await this.ownerService.update(id, updateOwnerDto);
      this.amqpConnection.publish('ownerExchange', 'owner.updated', {
        ownerId,
        ...updateOwnerDto, // send updated owner data
      });
      return updatedOwner;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const ownerId = await this.ownerService.findById(id);
      if (!ownerId) {
        throw new NotFoundException('Owner with the id not found');
      }

      return await this.ownerService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
