/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/user/user.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,

    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await this.transactionModel.find().exec();
      if (transactions.length !== 0) {
        return transactions;
      } else {
        throw { statusCode: 404, message: 'No transactions found!' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionById(id): Promise<Transaction> {
    try {
      const transaction = await this.findTransaction(id);
      if (transaction) {
        return transaction;
      } else {
        throw { statusCode: 404, message: 'Transaction not found' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionOfCreateProposal(propId, propTYPE) {
    try {
      const trans = await this.transactionModel.findOne({
        Type: propTYPE,
        proposalId: propId,
      });
      if (!trans) {
        throw { message: 'No transaction found!' };
      }
      return trans;
    } catch (error) {
      throw error;
    }
  }
  private async findTransaction(id: string): Promise<Transaction> {
    let transaction;
    try {
      transaction = await this.transactionModel.findById(id).exec();
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}