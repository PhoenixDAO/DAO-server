import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { Request } from 'express';
import { Proposal } from './proposal.model';
describe('ProposalController', () => {
  let controller: Proposal;
  let product = {
    _id: '12345678',
    productName: 'SHIRT',
    imageLink: 'imageLink123',
    caption: 'Caption123',
  };
});
