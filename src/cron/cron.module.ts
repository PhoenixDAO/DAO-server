import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ProposalService } from '../proposal/proposal.service'

import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema, BlockSchema } from '../proposal/proposal.model';
import { UserSchema } from '../user/user.model'
import { DAOAttributesSchema } from 'src/admin/admin.model';
import { ProposalModule } from '../proposal/proposal.module'
// import {  } from '../'
// import { BlockSchema } from '.';

@Module({
  imports: [
    ProposalModule,
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema },
      { name: 'Block', schema: BlockSchema },
      { name: 'User', schema: UserSchema },
      { name: 'DAOAttribute', schema: DAOAttributesSchema }
    ]),
  ],
  providers: [CronService,
    //  ProposalService
    ],
})
export class CronModule {}
