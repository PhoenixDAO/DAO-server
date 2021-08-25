import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from './user.model';
describe('ProposalController', () => {
  let controller: User;
  let product = {
    _id: '12345678',
    numioAddress: 'SHIRT',
    firstName: 'imageLink123',
    lastName: 'Caption123',
  };

  class productModel {
    constructor(body) {
      return body;
    }
    static create = jest.fn().mockImplementation(req => {
      return req;
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
    controller = module.get<UserController>(UserController);
  });
});
