/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Body, Injectable } from '@nestjs/common';
import jwt = require('jsonwebtoken');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.model';
const numio = require('numio-sdk');

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signin(req) {
    try {
      const userExist = await this.userModel.findOne({ email: req.body.email });
      if (!userExist) {
        throw {
          statusCode: 404,
          message: 'User with this email doesnot exist',
        };
      }
      const token = jwt.sign(
        { email: req.body.email },
        process.env.SECRET_KEY,
        {
          expiresIn: '5d',
        },
      );
      if (!token) {
        throw { statusCode: 400, message: 'token not generated!' };
      }
      return token;
    } catch (error) {
      throw error;
    }
  }
  async loginWithNumio(req) {
    console.log('In login with Numio', req.body.token, req.body.app_secret);
    try {
      const temp = {
        token: req.body.token,
        userDetails: ['fullname', 'email', 'profileImage', 'numio_id'],
        app_secret: req.body.app_secret,
      };
      const resp = await numio.verifyToken(temp);
      console.log('resp [[[]]] ', resp.data.data.userInformation);
      if (!resp || resp.data.status !== 200) {
        console.log('In if 1');
        throw { statusCode: 500, message: 'Internal server error' };
      }
      // const {
      //   email,
      //   numioId,
      //   first_name,
      //   last_name,
      // } = resp.data.data.userInformation;

      //  MY CHANGE
      const { email, numioId, first_name, last_name } = req.body.information;
      console.log('Email =======>>>>>>', email);
      const userExist = await this.userModel.findOne({ email: email });
      console.log('User exist', userExist);
      // if (req.body.numioAddress != userExist.numioAddress) {
      //   throw { statusCode: 422, message: 'MetaMask address changed' };
      // }
      if (!userExist) {
        console.log('In if 2');
        // const userData = {
        //   numioAddress: numioId,
        //   firstName: first_name,
        //   lastName: last_name,
        //   email: email,
        //   isAdmin: false,
        // };

        // MY CHANGE
        const userData = {
          numioAddress: req.body.information.numioAddress,
          firstName: req.body.information.firstName,
          lastName: req.body.information.lastName,
          email: req.body.information.email,
          isAdmin: false,
          numioId: req.body.information.numioId,
        };
        console.log('Before newUser', userData);
        const newUser = this.userModel(userData);
        console.log('NewUser', newUser);
        const createdUser = await this.userModel.create(newUser);
        console.log('Created user', createdUser);
        console.log(3);
        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
          expiresIn: '1y',
        });
        if (!token) {
          console.log('In if 4');
          throw { statusCode: 400, message: 'token not generated!' };
        }
        const user = {
          _id: createdUser._id,
          email: createdUser.email,
          first_name: createdUser.firstName,
          last_name: createdUser.lastName,
          isAdmin: createdUser.isAdmin,
          numioAddress: createdUser.numioAddress,
          proposalStake: createdUser.proposalStake,
          proposalVote: createdUser.proposalVote,
          profileImage: resp.data.data.userInformation.profileImage,
          createdAt: createdUser.createdAt,
          token,
          loginWith: 'numio',
          numioId: createdUser.numioId,
        };
        return user;
      }
      const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
        expiresIn: '1y',
      });
      if (!token) {
        console.log('In if 5');
        throw { statusCode: 400, message: 'token not generated!' };
      }
      const user = {
        _id: userExist._id,
        email: userExist.email,
        first_name: userExist.firstName,
        last_name: userExist.lastName,
        isAdmin: userExist.isAdmin,
        numioAddress: userExist.numioAddress,
        proposalStake: userExist.proposalStake,
        proposalVote: userExist.proposalVote,
        profileImage: resp.data.data.userInformation.profileImage,
        createdAt: userExist.createdAt,
        token,
        loginWith: 'numio',
        numioId: userExist.numioId,
      };
      console.log('User 6 =====>>>', user);
      return user;
    } catch (error) {
      console.log('In catch Login with Numio', error);
      throw error;
    }
  }
  async loginWithMetaMask(req) {
    try {
      let userExist = await this.userModel.findOne({
        numioAddress: req.body.Address,
      });

      if (!userExist) {
        userExist = await this.userModel.findOne({
          email: req.body.email,
        });
      }
      if (!userExist) {
        if (req.body.register) {
          const { first_name, last_name, email } = req.body;
          const userData = {
            numioAddress: req.body.Address,
            firstName: first_name,
            lastName: last_name,
            email: email,
            isAdmin: false,
          };
          const newUser = this.userModel(userData);
          const createdUser = await this.userModel.create(newUser);
          const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
            expiresIn: '1y',
          });
          if (!token) {
            throw { statusCode: 400, message: 'token not generated!' };
          }
          const user = {
            _id: createdUser._id,
            email: createdUser.email,
            first_name: createdUser.firstName,
            last_name: createdUser.lastName,
            isAdmin: createdUser.isAdmin,
            numioAddress: createdUser.numioAddress,
            proposalStake: createdUser.proposalStake,
            proposalVote: createdUser.proposalVote,
            profileImage: '',
            createdAt: createdUser.createdAt,
            token,
            loginWith: 'metaMask',
          };
          return { signInSuccess: true, user };
        }
        const user = { signInSuccess: false, notRegistered: true };
        return user;
      }

      if (req.body.register) {
        return {
          signInSuccess: false,
          alreadyRegistered:
            'User with the current wallet address or email already exists!',
        };
      }

      const token = jwt.sign(
        { email: userExist.email },
        process.env.SECRET_KEY,
        {
          expiresIn: '1y',
        },
      );
      if (!token) {
        throw { statusCode: 400, message: 'token not generated!' };
      }
      const user = {
        _id: userExist._id,
        email: userExist.email,
        first_name: userExist.firstName,
        last_name: userExist.lastName,
        isAdmin: userExist.isAdmin,
        numioAddress: userExist.numioAddress,
        proposalStake: userExist.proposalStake,
        proposalVote: userExist.proposalVote,
        profileImage: '',
        createdAt: userExist.createdAt,
        token,
        loginWith: 'metaMask',
      };
      return { signInSuccess: true, user };
    } catch (error) {
      throw error;
    }
  }
}
