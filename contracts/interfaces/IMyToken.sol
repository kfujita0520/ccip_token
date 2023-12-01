// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

interface IMyToken is IERC20 {
    enum PayFeesIn {
        Native,
        LINK
    }

    event MessageSent(bytes32 messageId);
    event MessageReceived(bytes32 messageId, uint64 sourceChainSelector, address sender, bytes data);
    event Mint(address minter, uint256 amount);

    function mint(address to, uint256 amount) external;
    function ccipSend(uint64 destinationChainSelector, address receiver,
        uint256 amount, PayFeesIn payFeesIn) external payable;
    function ccipReceive(Client.Any2EVMMessage calldata message) external;
}
