import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './schema/owner.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name) private readonly ownerModel: Model<Owner>
  ){}
  async create(createOwnerDto: CreateOwnerDto) {
    const owner = await this.ownerModel.create(createOwnerDto);
    return owner;
  }

  async findAll(query: any, { page, limit }) {
    const owners = await this.ownerModel
      .find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
    return owners;
  }

  async findById(id: string) {
    const Owner = await this.ownerModel.findById(id);
    return Owner;
  }

  async findOne(query: any) {
    const Owner = await this.ownerModel.findOne(query);
    return Owner;
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto) {
    const updatedOwner = await this.ownerModel
      .findByIdAndUpdate({ _id: id }, updateOwnerDto, { new: true })
      .exec();
    return updatedOwner;
  }

  async remove(id: string) {
    const deleteOwner = await this.ownerModel.findByIdAndDelete(id)
    return deleteOwner;
  }
}
