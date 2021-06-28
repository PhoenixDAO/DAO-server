/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async addUser(user) {
    try {
      console.log('USer');
      const uniqueUser = await this.findUser(user.numioAddress);
      if (!uniqueUser) {
        user.isAdmin = false;
        const newUser = this.userModel(user);
        const createdUser = await this.userModel.create(newUser);

        return createdUser;
      } else {
        throw { statusCode: 400, message: 'User already exist' };
      }
    } catch (error) {
      throw error;
    }
  }
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      if (users.length !== 0) {
        return users;
      } else {
        throw { statusCode: 404, message: 'No users found!' };
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserByEmail(email) {
    let user;
    try {
      if (!email) {
        throw { statusCode: 400, message: 'Please provide email!' };
      }
      user = await this.userModel.findOne({ email: email }).exec();
      if (user) {
        return user;
      } else {
        throw { statusCode: 404, message: 'No user found!' };
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id): Promise<User> {
    try {
      const user = await this.findUser(id);
      if (user) {
        return user;
      } else {
        throw { statusCode: 404, message: 'User not found' };
      }
    } catch (error) {
      throw error;
    }
  }
  findUserByNumioId = async req => {
    console.log('REQ PARAMS', req.params.id);
    console.log('REQ BODY', req.body)
    try {
      const userExist = await this.userModel.find({
        numioId: req.params.id,
      });
      console.log('user exist', userExist)
      if(userExist.length == 0){return true}
      // if (!userExist) {
      //   return { statusCode: 400, message: 'No user found' };
      // }
      console.log('User', userExist)
      if(userExist.length >= 1 && userExist[0].numioAddress == req.body.address){
        console.log('True')
        return true;
      }
      console.log('False')
      return false
      // return userExist;
    } catch (err) {
      throw err;
    }
  };
  getVotedProposals = async req => {
    try {
      const userExist = await this.userModel.findOne({
        numioAddress: req.params.id,
      });

      if (!userExist) {
        throw { statusCode: 400, message: 'No user found' };
      }
      const result = await this.userModel
        .findOne({ numioAddress: req.params.id })
        .populate('proposalVote')
        .then(prop => {
          if (prop.proposalVote.length == 0) {
            throw { statusCode: 404, message: 'No Proposal Found' };
          }
          return prop.proposalVote;
        })
        .catch(err => {
          throw err;
        });

      return result;
    } catch (err) {
      throw err;
    }
  };

  getStakedProposals = async req => {
    try {
      const userExist = await this.userModel.findOne({
        numioAddress: req.params.id,
      });

      if (!userExist) {
        throw { statusCode: 400, message: 'No user found' };
      }
      const result = await this.userModel
        .findOne({ numioAddress: req.params.id })
        .populate('proposalStake')
        .then(prop => {
          if (prop.proposalStake.length == 0) {
            throw { statusCode: 404, message: 'No Proposal Found' };
          }
          return prop.proposalStake;
        })
        .catch(err => {
          throw err;
        });

      return result;
    } catch (err) {
      throw err;
    }
  };

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ numioAddress: id }).exec();
      return user;
    } catch (error) {
      throw error;
    }
  }
}
