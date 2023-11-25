// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {CCIPReceiver} from "./CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "hardhat/console.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DestinationMinter is CCIPReceiver {

    event MessageReceived(bytes32 messageId, uint64 sourceChainSelector, address sender, bytes data);
    event RecordAddress(address sender);
    event RecordBytes(bytes32 data);
    event Mint(address minter, uint256 amount);


    constructor(address router) CCIPReceiver(router) {
    }

    function ccipReceive(Client.Any2EVMMessage calldata message) external override {
        _ccipReceive(message);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {

        emit RecordAddress(msg.sender);
        console.log('destination minter: ccip receive');
        address latestSender = abi.decode(message.sender, (address));
        console.log(latestSender);
        bytes memory arguments = slice(message.data, 4, message.data.length - 4);
        // Decode the argument data
        (address decodedAddress, uint256 decodedAmount) = abi.decode(arguments, (address, uint256));
        console.log(decodedAddress);//receiver
        console.log(decodedAmount);
        emit MessageReceived(message.messageId, message.sourceChainSelector, latestSender, message.data);

        (bool success, ) = address(this).call(message.data);
        console.log(success);
    }

    function slice(bytes memory data, uint start, uint len) private pure returns (bytes memory) {
        bytes memory b = new bytes(len);
        for(uint i = 0; i < len; i++) {
            b[i] = data[i + start];
        }
        return b;
    }

    function mint(address to, uint256 amount) public {
        console.log("mint function is called here");
        emit Mint(to, amount);
        //_mint(to, amount);
    }
}
