/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express';
import { ProposalService } from './proposal.service';
import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { encryptData, decryptData } from '../jwt/index';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly ProposalService: ProposalService) {}
  // Here we get ALL proposals from the database
  @Get()
  async getAllProposals(@Req() req: Request, @Res() res: Response) {
    // var ipAddr: any = req.headers["x-forwarded-for"];
    // if (ipAddr){
    //   var list = ipAddr.split(",");
    //   ipAddr = list[list.length-1];
    //   console.log('ip Addr if', ipAddr)
    // } else {
    //   ipAddr = req.connection.remoteAddress;
    //   console.log('Ip addr else', ipAddr)
    // }
    try {
      const result = await this.ProposalService.getAllProposals();
      if (result.length == 0) {
        res
          .status(400)
          .send({ responseCode: 400, result: 'No Proposals Found' });
      } else {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      }
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }

  // Here post a NEW proposal
  @Post('')
  async postProposal(@Req() req: Request, @Res() res: Response) {
    try {
      // console.log('In controller', req.body.decodeToken)
      let value = { encrypt: req.body };
      const decrypt = await decryptData(value);
      console.log('Res', decrypt);
      const result = await this.ProposalService.postProposal(decrypt, res);
      console.log('Result after in controller', result);
      const encryptedData = await encryptData(result);
      console.log('Encry ====[][][]', encryptedData);
      res.status(200).send({
        responseCode: 200,
        result: encryptedData,
      });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  // Here we VOTE on a proposal
  @Post('/vote/:id')
  async voteOnProposal(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('COntroller ', req.body);
      const result = await this.ProposalService.VoteOnProposal(req, res);
      res.status(200).send({
        statusCode: 200,
        result: result,
      });
    } catch (err) {
      res.status(400).send({
        statusCode: 400,
        message: err.message,
      });
    }
  }

  // Here we get proposals by giving the ID in PARAMS
  @Get('/:id')
  async getProposalsById(@Req() req: Request, @Res() res: Response) {
    try {
      console.log(req.params.id);
      const result = await this.ProposalService.getProposalsById(req.params.id);
      if (result) {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      } else {
        res.status(400).send({
          responseCode: 400,
          result: 'No Proposal Found',
        });
      }
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  // Here we UPDATE the status of a proposal from ID
  @Put('/:id')
  async updateProposalStatus(@Req() req: Request, @Res() res: Response) {
    try {
      const result: any = await this.ProposalService.updateProposalStatus(
        req.params.id,
        req,
      );
      if (result) {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      } else {
        res.status(200).send({
          responseCode: 200,
          result: 'No Proposal Found',
        });
      }
    } catch (err) {
      res.status(err.statusCode | 400).send({
        responseCode: err.statusCode,
        result: err,
      });
    }
  }
  // Here we get a proposal by NUMIOADDRESS
  @Post('/getByNumioAddress')
  async getByNumioAddress(@Req() req: Request, @Res() res: Response) {
    try {
      const { email } = req.body.decodeToken;
      const result = await this.ProposalService.getProposalByNumioAddress(
        req.body.numioAddress,
        email
      );

      res.status(200).send({
        statusCode: 200,
        result: result,
      });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err.message,
      });
    }
  }
  // Here we get proposals by NUMIOADDRESS whose status is accepted
  @Post('/getByNumioAddressAndProposalStatus')
  async getProposalByNumioAddressAndProposalStatus(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ProposalService.getProposalByNumioAddressAndProposalStatus(
        req.body.numioAddress,
        req.body.status,
      );

      res.status(200).send({
        statusCode: 200,
        result: result,
      });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err.message,
      });
    }
  }

  // Here we get Proposals by STATUS
  @Post('/status')
  async getPropsalsByStatus(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.getProposalsByStatus(req);
      if (result.length !== 0) {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      } else {
        res.status(400).send({ responseCode: 400, result: 'Not Found' });
      }
    } catch (err) {
      console.log('In catch ====>', err);
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  // Here we CHANGE the STATUS of a MILESTONE by ADMIN
  @Put('/changeStatusOfMilestoneByAdmin/:id')
  async changeStatusOfMilestoneByAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ProposalService.changeStatusOfMilestoneByAdmin(
        req,
        res,
      );
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }

  // Here we CHANGE the STATUS of a MILESTONE by USER
  @Put('/changeStatusOfMilestoneByUser/:id')
  async changeStatusOfMilestoneByUser(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ProposalService.changeStatusOfMilestoneByUser(
        req,
        res,
      );
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }

  // Here we UPDATE a accepted proposal's est. completion date and github link in the database by Id
  @Put('/updateProposalCompleteDateAndGitHubLink/:id')
  async updateProposalEstCompleteDateAndGitHubLink(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ProposalService.updateProposalEstCompleteDateAndGitHubLink(
        req,
      );
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(err.statusCode).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }

  // Here we UPDATE a proposals in the database by Id
  @Put('/updateProposal/:id')
  async updateProposal(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('Running');
      let value = { encrypt: req.body };
      console.log('In update proposal controller', value);
      const decrypt = await decryptData(value);
      console.log('In update proposal controller decrypt', decrypt);

      let value2 = { body: decrypt };
      let value3 = { encrypt: { value: req.params.id } };
      console.log('Last console');
      const decryptedId = await decryptData(value3);

      const result = await this.ProposalService.updateProposal(
        value2,
        decryptedId,
      );
      console.log('Result after in controller', result);
      const encryptedData = await encryptData(result);
      console.log('Encry ====[][][]', encryptedData);
      res.status(200).send({ responseCode: 200, result: encryptedData });
    } catch (err) {
      console.log('err', err);
      res.status(400).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }

  // Here we DELETE a proposals in the database by Id
  @Delete('/singleProposal/:id')
  async deleteProposal(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.deleteProposal(req);
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(err.statusCode).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }

  @Patch('/generateVRS')
  async generateVRS(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('req.body', req.body);
      const result = await this.ProposalService.getVRS(
        req.body.id,
        req.body.contractAddress,
        req.body.senderAddress,
      );
      console.log('Result from service ====', result);
      res.status(200).send({ responseCode: 200, result });
    } catch (err) {
      console.log('Error here', err.message);
      res.status(err.responseCode).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }

  @Post('/sendMail')
  async sendMail(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.sendMail(req);
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(err.statusCode).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }
}
