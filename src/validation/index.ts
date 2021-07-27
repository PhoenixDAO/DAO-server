import { ProposalSchema } from '../proposal/proposal.model';
import * as mongoose from 'mongoose';

export const validationJwt = async (email: String) => {
  console.log('email', email);
  const Proposal = mongoose.model('Proposal', ProposalSchema);
  const proposal = await Proposal.findOne({ email });
  console.log(proposal);
  if (proposal) {
    return proposal;
  } else {
    throw new Error('Unauthorized');
  }
};
