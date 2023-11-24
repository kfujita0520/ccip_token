// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IAny2EVMMessageReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";
import "hardhat/console.sol";

contract CCIPReceiverTest {

    address public destinationMinter;

    constructor(address _destinationMinter){
        destinationMinter = _destinationMinter;
    }


    function updateDestinationMinter(address _destinationMinter) public {
        destinationMinter = _destinationMinter;
    }

    function executeReceive(bytes32 messageId, uint64 sourceChainSelector, address srcSender, uint256 amount) public {
        Client.Any2EVMMessage memory message = Client.Any2EVMMessage({
            messageId: messageId,
            sourceChainSelector: sourceChainSelector,
            sender: abi.encode(srcSender),
            data: abi.encodeWithSignature("mint(address,uint256)", msg.sender, amount),
            destTokenAmounts: new Client.EVMTokenAmount[](0)
        });
        console.log('start ccipReceive');
        IAny2EVMMessageReceiver(destinationMinter).ccipReceive(message);

    }



}
