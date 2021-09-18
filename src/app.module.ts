/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProposalModule } from './proposal/proposal.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './loggerMiddleware';
import { TransactionModule } from './transaction/transaction.module';
import { StakeModule } from './stake/stake.module';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { NodemailerService } from './nodemailer/nodemailer.service';
import { ProposalService } from './proposal/proposal.service';
// import { BlockModule } from './block/block.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.NEW_DATABASE_URL, {
      entities: ['src/**/**.entity{.ts,.js}'], // <-- replace it to 'dist/**/**.entity.js' prod mode or use relative path
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    UserModule,
    ProposalModule,
    AuthModule,
    TransactionModule,
    StakeModule,
    AdminModule,
    CronModule,
    // BlockModule,
  ],
  controllers: [AppController],
  providers: [AppService, NodemailerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/numio', method: RequestMethod.ALL },
        { path: 'auth/metamask', method: RequestMethod.ALL },
        { path: 'proposal/sendMail', method: RequestMethod.ALL },
        { path: 'test', method: RequestMethod.ALL },
        { path: 'user/findUserByNumioId/:id', method: RequestMethod.ALL },
        { path: 'proposal/generateVRS', method: RequestMethod.ALL },
        { path: 'stake/getReceipt', method: RequestMethod.ALL },
        { path: 'proposal/createBlock', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
