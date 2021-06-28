// export const InfuraKey =
//   'https://rinkeby.infura.io/v3/98ae0677533f424ca639d5abb8ead4e7';

export const PHNX_PROPOSAL_ADDRESS =
  // '0x5579fBfD5417758Bf276276aFb597b7C6b30786E';
  // '0x7415eA5df0870fBcab3027c334e268F50B40ADf5';
  // "0x7c29A078fa3623Ee566D0D7543DC046d53C79523";
  // "0xc74367CcaAb0dfCAA1db102524bBA46725AEb502";
  '0xB56a23E41179c1f011d55dEa8f69928743e4d0Ff'

  export const PHNX_STAKING_ADDRESS =
  '0xc53E8ab88a91d16A669Fd5D2ADA12807125194f5';
  export const PHNX_PROPOSAL_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "AddedSubOwner",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        }
      ],
      "name": "ColleteralWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fundsRequested",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initiationTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "completionTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "colletralAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalMilestones",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "status",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalVotes",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        }
      ],
      "name": "ProposalEditted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "previousStatus",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newStatus",
          "type": "uint256"
        }
      ],
      "name": "ProposalStatusUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fundsRequested",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initiationTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "completionTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "colletralAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalMilestones",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "status",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalVotes",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        }
      ],
      "name": "ProposalSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "RemovedSubOwner",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "addOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "collateralAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_phoenixContractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_signer",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "phnxContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "proposalList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "fundsRequested",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "initiationTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completionTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "colletralAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalMilestones",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completedMilestones",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "status",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalVotes",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isClaimed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_subOwner",
          "type": "address"
        }
      ],
      "name": "removeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "signer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fundsRequested",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "colletralAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalMilestones",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        }
      ],
      "name": "submitProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unPause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fundsRequested",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "colletralAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalMilestones",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        }
      ],
      "name": "updateProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "status",
          "type": "uint256"
        }
      ],
      "name": "updateProposalStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "withdrawCollateral",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]