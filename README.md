# CCIP Token

## Objective
Create ERC20 Token which natively supports cross transfers with CCIP protocol.

## Design
MyToken is the contract used for this purpose, which has ccipSend and ccipReceive function for cross transfer.
There is not much logic inside except for minimal ERC20 related ones.

MyToken inherits abstract contract CCIPHandler, which will take care of detail procedures to interact with CCIP router
and AccessControl to related operations. 

## Test
Testing in live-net is time-consuming task and very difficult to track the cause of errors.

CCIPReceiverTest is a test tool on local-net, which generates Any2EVMMessage passing to ccipReceive function.
Then we do not rely on router contract on live-net.

## Findings (or Error-prone items)
- ccipReceive function of CCIPReceiver contract has onlyRouter restriction. This will limit the executor to router who process incoming (and outgoing) CCIP messages.
- for the message data used as the argument of call() is something like abi.encodeWithSignature("mint(address,uint256)", msg.sender, amount). We have to be very careful with that no space should be inserted in signature part. Otherwise, call function will be failed. (i.e. "mint(address, uint256)" will cause an error).
- because mint function is executed through call function, msg.sender will not be router, rather it will be MyToken itself. MyToken should be granted minter power for this operation in advance. 
