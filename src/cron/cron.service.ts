/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal, Block } from '../proposal/proposal.model';
// import { Block } from '../block/block.model';
import { Cron } from '@nestjs/schedule';
const axios = require('axios');
const moment = require('moment');
const Web3 = require('web3');
import { ProposalService } from '../proposal/proposal.service';
// import { getEvents } from '../block/block.service';
import {
  PHNX_PROPOSAL_ABI,
  PHNX_PROPOSAL_ADDRESS,
} from '../contracts/contracts';
import {MAIN_NET_INFRUA_URL} from '../infuraURL';
import process from 'process';


@Injectable()
export class CronService {
  constructor(
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel('Block') private readonly blockModel: Model<Block>,
  ) {}

  @Cron('1 0 0 5 * *')
  // // @Cron('1 30 * * * *')
  votingTimeEnd() {
    // console.log('cron job is running,calculating voting results');
    this.votingResultCalculation({ body: { votingStatus: true } });
  }
  @Cron('1 0 5 2 * *')
  // @Cron('1 0 * * * *')
  votingDateArrival() {
    // console.log('cron job is running, voting starts now');
    this.votingTimeStart({ body: { status: 'Voting' } });
  }

  @Cron('*/6 * * * * *')
  testing() {
    // console.log('Cron job');
    this.getEvents();
  }

  @Cron('0 * * * *')
  expire() {
    console.log('expire Cron job');
    this.expireUpVoteProposals({ body: { status: 'UpVote' } });
  }

  getCurrentGasPrices = async () => {
    try {
      let response = await axios.get(
        'https://ethgasstation.info/json/ethgasAPI.json',
      );
      let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10,
      };
      console.log(prices);
      return prices;
    } catch (e) {
      console.log(e);
    }
  };

  updateStatus = async (id, status) => {
    const web3 = new Web3(
      // 'https://rinkeby.infura.io/v3/98ae0677533f424ca639d5abb8ead4e7',
      // 'https://rinkeby.infura.io/v3/637a6ab08bce4397a29cbc97b4c83abf',
      MAIN_NET_INFRUA_URL
    );

    const contract = new web3.eth.Contract(
      PHNX_PROPOSAL_ABI,
      PHNX_PROPOSAL_ADDRESS,
    );
    console.log('Here');
    // console.log('++++++++++++++++++++',PHNX_PROPOSAL_ABI)
    console.log('Update status from blockchain');
    try {
      let adminPublicKey = process.env.adminPublicKey
      let count = await web3.eth.getTransactionCount(
        adminPublicKey,
        'pending',
      );
      let gasPrices = await this.getCurrentGasPrices();
      console.log(gasPrices);
      let rawTransaction = {
        from: adminPublicKey,
        to: PHNX_PROPOSAL_ADDRESS,
        data: contract.methods.updateProposalStatus(id, status).encodeABI(),
        gasPrice: gasPrices.high * 1000000000,
        nonce: count,
        gasLimit: web3.utils.toHex(2000000),
      };
      let pr_key = process.env.adminPrivateKey;
      let signed = await web3.eth.accounts.signTransaction(
        rawTransaction,
        pr_key,
      );
      await web3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .on('confirmation', (confirmationNumber, receipt) => {
          if (confirmationNumber === 1) {
            return true;
          }
        })
        .on('error', error => {
          return false;
        })
        .on('transactionHash', async hash => {
          console.log('transaction has -->', hash);
        });
    } catch (Err) {
      console.log('Error in update status', Err);
      return false;
    }
  };

  votingResultCalculation = async req => {
    //   let setSchedule = '0 0 0 4 * *';
    try {
      const votingProposals = await this.proposalModel.find({
        votingStatus: req.body.votingStatus,
      });
      if (votingProposals.length === 0) {
        throw {
          statusCode: 404,
          message: `No proposal with voting status ${req.body.status} found`,
        };
      }

      let utcDate;
      let resultDate;
      // await axios
      //   .get('http://worldtimeapi.org/api/timezone/America/New_York')
      //   .then(value => {
      //     utcDate=moment(value.data.utc_datetime).format();
      //   })
      //   .catch(err => {
      //     console.log('Error occured is ', err);
      //   });

      utcDate = moment(Date.now()).format();
      resultDate = moment(votingProposals[0].votingDate)
        .add(3, 'days')
        .format();

      // console.log('votingDate is', new Date(votingProposals[0].votingDate));
      // console.log('resultDate is', resultDate);
      // console.log('utcDate is', utcDate);

      // console.log('comparison', resultDate < utcDate);

      let totalVotes = 0;
      console.log('proposals with voting status are --->');
      // calculating total votes
      for (let i = 0; i < votingProposals.length; i++) {
        if (
          moment(votingProposals[i].votingDate)
            .add(3, 'days')
            .format() < utcDate
        ) {
          console.log(votingProposals[i].name);
          totalVotes += votingProposals[i].stake.length;
        }
      }
      // console.log('total votes are', totalVotes);

      // updating proposal status according to percentage of votes on it
      for (let i = 0; i < votingProposals.length; i++) {
        if (
          moment(votingProposals[i].votingDate)
            .add(3, 'days')
            .format() < utcDate
        ) {
          if (
            totalVotes !== 0 &&
            votingProposals[i].stake.length / totalVotes >= 0.51
          ) {
            console.log(
              'updating proposal status to Accepted',
              votingProposals[i].name,
            );
            let completionDays = 0,
              estCompletionDate;
            for (let t = 0; t < votingProposals[i].milestone.length; t++) {
              completionDays += Number(votingProposals[i].milestone[t].days);
            }
            estCompletionDate = moment(utcDate)
              .add(completionDays, 'days')
              .format();

            console.log('Proposal accepted');

            await this.proposalModel.findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: {
                  status: 'Accepted',
                  votingStatus: false,
                  estCompletionDate,
                },
              },
              { runValidators: true, new: true },
            );

            await this.updateStatus(votingProposals[i]._id, 3);

            console.log('Voting proposal ID ----->', votingProposals[i]._id);

            votingProposals.splice(i, 1);
            i--;
          } else if (
            totalVotes !== 0 &&
            votingProposals[i].stake.length / totalVotes < 0.51 &&
            votingProposals[i].stake.length / totalVotes !== 0.5
          ) {
            console.log(
              'updating proposal status to Fail and splicing it',
              votingProposals[i].name,
            );
            await this.proposalModel.findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: { status: 'Fail', votingStatus: false },
              },
              { runValidators: true, new: true },
            );

            await this.updateStatus(votingProposals[i]._id, 5);

            votingProposals.splice(i, 1);
            i--;
          }
        }
      }
      console.log('proposals array after splicing are --->', votingProposals);
      console.log(
        'length of the votingProposals is -->',
        votingProposals.length,
      );
      if (votingProposals.length === 2) {
        for (let i = 0; i < votingProposals.length; i++) {
          if (
            moment(votingProposals[i].votingDate)
              .add(3, 'days')
              .format() < utcDate
          ) {
            if (
              totalVotes !== 0 &&
              (votingProposals[i].stake.length / totalVotes) * 100 === 50
            ) {
              votingProposals[i] = await this.proposalModel.findByIdAndUpdate(
                votingProposals[i]._id,
                {
                  $set: { status: 'Draw', votingStatus: false },
                },
                { runValidators: true, new: true },
              );
            }
          }
        }
        console.log(
          'proposals array after assigning Draw are --->',
          votingProposals,
        );
      } else {
        for (let i = 0; i < votingProposals.length; i++) {
          if (
            moment(votingProposals[i].votingDate)
              .add(3, 'days')
              .format() < utcDate
          ) {
            await this.proposalModel.findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: { status: 'Fail', votingStatus: false },
              },
              { runValidators: true, new: true },
            );
          }
        }
      }
    } catch (err) {
      throw err;
    }
  };

  expireUpVoteProposals = async req => {
    try {
      const proposals = await this.proposalModel.find({
        status: req.body.status,
      });
      const serverDate = moment(Date()).format();
      if (proposals.length > 0) {
        for (let i = 0; i < proposals.length; i++) {
          if (moment(proposals[i].expirationDate).format() < serverDate) {
            const proposal = await this.proposalModel.findByIdAndUpdate(
              proposals[i]._id,
              {
                $set: { status: 'Fail' },
              },
              { runValidators: true, new: true },
            );
          }
        }
      }
    } catch (err) {
      throw err;
    }
  };
  votingTimeStart = async req => {
    try {
      // console.log('req.body is ', req.body);
      const votingProposals = await this.proposalModel.find({
        status: req.body.status,
      });
      // console.log("voting proposals are ", votingProposals)
      if (votingProposals.length === 0) {
        throw {
          statusCode: 404,
          message: `No proposal with voting status ${req.body.status} found`,
        };
      }

      let serverDate = moment(Date.now()).format();
      // console.log('server Date is ', serverDate);

      for (let i = 0; i < votingProposals.length; i++) {
        console.log(
          'Moment date',
          moment(votingProposals[i].votingDate).format(),
        );
        console.log('Server date', serverDate);
        console.log(
          votingProposals[i].name,
          ' and date ',
          moment(votingProposals[i].votingDate).format(),
          ' and server date',
          serverDate,
        );
        if (moment(votingProposals[i].votingDate).format() <= serverDate) {
          await this.proposalModel
            .findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: { votingStatus: true },
              },
              { runValidators: true, new: true },
            )
            .then((proposal: any) => {
              console.log(
                'updated proposal ',
                proposal.name,
                ' with voting date ',
                proposal.votingDate,
              );
            })
            .catch(err => {
              console.log('error updating proposal ', err);
            });
        }
      }
    } catch (err) {
      throw err;
    }
  };

  // expireProposals = async (req) => {
  //   try{
  //     let serverDate= moment(Date.now()).format();
  //     const expiredProposals = await this.proposalModel.find();
  //   //  if(expiredProposals.expirationDate >= serverDate ){}

  //     for(let i=0; i < expiredProposals.length ; i++){
  //       console.log('Moment date',moment(expiredProposals[i].votingDate).format())
  //       console.log('Server date',serverDate)
  //       console.log(expiredProposals[i].name, " and date ",moment(expiredProposals[i].votingDate).format() , " and server date" , serverDate )
  //       if(moment(expiredProposals[i].votingDate).format() <= serverDate){
  //         await this.proposalModel.findByIdAndUpdate(
  //           expiredProposals[i]._id,
  //           {
  //             $set: { votingStatus: true },
  //           },
  //           { runValidators: true, new: true },
  //         ).then((proposal:any)=>{
  //           console.log("updated proposal " , proposal.name , " with voting date " , proposal.votingDate)
  //         }).catch((err)=>{
  //           console.log("error updating proposal " , err)
  //         })
  //       }
  //     }
  //   }catch(err){
  //     throw err
  //   }
  // }

  getEvents = async () => {
    // console.log(1);
    console.log('Working')
    let web3 = new Web3(
      // 'https://rinkeby.infura.io/v3/c89f216154d84b83bb9344a7d0a91108',
      // 'https://rinkeby.infura.io/v3/637a6ab08bce4397a29cbc97b4c83abf',
      // 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      MAIN_NET_INFRUA_URL
    );
    let contract_abi = PHNX_PROPOSAL_ABI;
    let contract = new web3.eth.Contract(contract_abi, PHNX_PROPOSAL_ADDRESS);
    // console.log('Contract', contract);
    const result = await this.blockModel.find();
    console.log('Result [][]', result)
    contract.getPastEvents(
      'ProposalSubmitted',
      {
        fromBlock: result[0].proposalBlock,
        toBlock: 'latest',
      },
      async (err, events) => {
        console.log('Events', events)
        if (!err) {
          // console.log('events', events.length);
          if (events.length > 0) {
            for (let i = 0; i < events.length; i++) {
              let proposalId = events[i].returnValues[0];
              // await this.BlockService.findOneAndUpdate(
              //   { _id: '60278e16ce40995008177788' },
              //   { $inc: { proposalBlock: 1 } },
              // );
              await this.proposalModel.findByIdAndUpdate(
                proposalId,
                {
                  $set: { status: 'Pending' },
                },
                { runValidators: true, new: true },
              );
            }
            let newBlock = events[events.length - 1].blockNumber + 1;

            const result2 = await this.blockModel.findByIdAndUpdate(
              result[0]._id,
              {
                proposalBlock: newBlock,
              },
            );
          } else {
            // console.log(5);
            // console.log('No events found');
          }
        } else {
          // console.log(6);
          console.log('In else get past events err', err);
        }
      },
    );
  };
}
