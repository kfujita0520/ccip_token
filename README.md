# CCIP Token

## Objective
Create ERC20 Token which natively supports cross transfers with CCIP protocol.

## Design
MyToken is the contract used for this purpose, which has ccipSend and ccipReceive function for cross transfer.
There is not much logic inside except for minimal ERC20 related ones.

MyToken inherits abstract contract CCIPHandler, which will take care of detail procedure to interact with CCIP router
and AccessControl to related operations. 

## Test
Testing in live-net is time-consuming task and very difficult to track the errors.

CCIPReceiverTest is a tester tool, which generates Any2EVMMessage. Then ccipReceive test is possible in localnet.

## Findings (or Error-prone items)
- ccipReceive function of CCIPReceiver contract has onlyRouter restriction. This will limit the executor to router who process incoming (and outgoing) CCIP messages.
- for the message data used as the argument of call() is something like abi.encodeWithSignature("mint(address,uint256)", msg.sender, amount). When type this, no space should be inserted in signature part. Otherwise call funciton will be failed. (i.e. "mint(address, uint256)" will cause an error).
- because mint funciton is executed through call funciton, msg.sender is not the router, rather MyToken itself. You need to grant minter power to call function caller. 
