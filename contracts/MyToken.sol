// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPHandler} from "./CCIPHandler.sol";
import "hardhat/console.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract MyToken2 is ERC20, CCIPHandler {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event MessageSent(bytes32 messageId);
    event MessageReceived(bytes32 messageId, uint64 sourceChainSelector, address sender, bytes data);
    event Mint(address minter, uint256 amount);

    constructor(address router, address link, uint256 initialSupply) ERC20("MyToken", "MTN") CCIPHandler(router, link) {
        _setupRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, initialSupply);
    }


    function mint(address to, uint256 amount) public onlyMinter(msg.sender) {
        console.log("mint function is executed");
        _mint(to, amount);
        emit Mint(to, amount);
    }

    modifier onlyMinter(address user){
        console.log(user);
        require(hasRole(MINTER_ROLE, user), "Caller is not a minter");
        _;
    }


    function crossTransfer(uint64 destinationChainSelector, address receiver, uint256 amount, PayFeesIn payFeesIn) public payable {

        require(amount < balanceOf(msg.sender));

        _burn(msg.sender, amount);

        //tokenAmounts field can only be used for supported tokens on CCIP platform.
        //Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        //tokenAmounts[0] = Client.EVMTokenAmount({token: address(this), amount: amount});
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature("mint(address, uint256)", msg.sender, amount),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        bytes32 messageId = _ccipSend(destinationChainSelector, message);

        emit MessageSent(messageId);
    }


    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        address srcSender = abi.decode(message.sender, (address));
        console.log(msg.sender);
        (bool success,) = address(this).call(message.data);
        require(success);
        emit MessageReceived(message.messageId, message.sourceChainSelector, srcSender, message.data);
    }


}
