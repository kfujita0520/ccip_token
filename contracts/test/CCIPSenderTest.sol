// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IMyToken} from "./../interfaces/IMyToken.sol";
import "hardhat/console.sol";

contract CCIPSenderTest {

    address public sourceMinter;

    constructor(address _sourceMinter){
        sourceMinter = _sourceMinter;
    }


    function updateSourceMinter(address _sourceMinter) public {
        sourceMinter = _sourceMinter;
    }

    function executeSend(uint64 destinationChainSelector, address receiver, uint256 amount, IMyToken.PayFeesIn payFeesIn) public payable {
        //TODO only when payFeeIn is Native, send necessary amount of Ether. At the moment always send all ether deposited
        IMyToken(sourceMinter).ccipSend{value: address(this).balance}(destinationChainSelector, receiver, amount, payFeesIn);

    }



}
