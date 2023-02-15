// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "hardhat/console.sol";

contract Lock {
  struct Message {
    address sender;
    bytes32 content;
    uint timestamp;
  }

  struct ContractProperties {
    address ChatWeiOwner;
    address[] registeredUsersAddress;
  }

  struct Inbox {
    uint numSentMessages;
    uint numReceivedMessages;
    mapping (uint => Message) sentMessages;
    mapping (uint => Message) receivedMessages;
  }

  mapping (address => Inbox) userInboxes;
  mapping (address => bool) hasRegistered;

  Inbox newInbox;
  uint donationsInWei = 0;
  Message newMessage;
  ContractProperties contractProperties;

  constructor(){
    // Constructor
    registerUser();
    contractProperties.ChatWeiOwner = msg.sender;
  }

  function checkUserRegistration() public view returns (bool) {
    return hasRegistered[msg.sender];
  }

  function clearInbox() view public {
    Inbox storage newinbox = userInboxes[msg.sender];
    newinbox = newInbox;
  }

  function registerUser() public {
    if(!hasRegistered[msg.sender]) {
      Inbox storage newinbox = userInboxes[msg.sender];
      newinbox = newInbox;
      hasRegistered[msg.sender] = true;
      contractProperties.registeredUsersAddress.push(msg.sender);
    }
  }

  function getContractProperties() public view returns (address, address[] memory) {
    return (contractProperties.ChatWeiOwner, contractProperties.registeredUsersAddress);
  }

  function sendMessage(address _receiver, string memory _content) public {
    newMessage.content = bytes32(bytes(_content));
    newMessage.timestamp = block.timestamp;
    newMessage.sender = msg.sender;
    // Update senders inbox
    Inbox storage sendersInbox = userInboxes[msg.sender];
    sendersInbox.sentMessages[sendersInbox.numSentMessages] = newMessage;
    sendersInbox.numSentMessages++;

    // Update receivers inbox
    Inbox storage receiversInbox = userInboxes[_receiver];
    receiversInbox.receivedMessages[receiversInbox.numReceivedMessages] = newMessage;
    receiversInbox.numReceivedMessages++;
    return;
  }

  function receiveMessages() public view returns (bytes32[16] memory, uint[] memory, address[] memory) {
    Inbox storage receiversInbox = userInboxes[msg.sender];
    bytes32[16] memory content;
    address[] memory sender = new address[](16);
    uint[] memory timestamp = new uint[](16);
    for (uint m = 0; m < 15; m++) {
      Message memory message = receiversInbox.receivedMessages[m];
      content[m] = message.content;
      sender[m] = message.sender;
      timestamp[m] = message.timestamp;
    }
    return (content, timestamp, sender);
  }

  function getMyInboxSize() public view returns (uint, uint) {
    return (userInboxes[msg.sender].numSentMessages, userInboxes[msg.sender].numReceivedMessages);
  }

}


/*contract Lock {
    
w    mapping (address => int) public balances;
    function get(address to,int amount) public
    {
        balances[to] += amount;
    }
    function set(address to) public view returns(int)
    {
        return balances[to];
    }
    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }

    userInboxes[msg.sender] = newInbox;

}*/
