pragma solidity ^0.4.11;

import './Banker.sol';
import './OwnableNotTransferible.sol';

contract MonopolyBoard is OwnableNotTransferible {

  struct Asset {
    address owner;
    string assetName;
    uint priceAmount;
  }

  mapping( uint256 => Asset[] ) assetsPerGame;
  mapping( uint256 => mapping(address => uint) ) playerPositions;

  event LogBoardCreated( uint256 _gameId );

  /*********** Constructors ***********/
  function MonopolyBoard(address _banker) public {
    // is expected to be the banker
    //owner = msg.sender;
    owner = _banker;
  }

  function newInstanceFor(uint256 _gameId) public {
    require( assetsPerGame[_gameId].length == 0 );

    assetsPerGame[_gameId].push( Asset({ assetName: "Park Lane 1", priceAmount: 15, owner: address(0)}) );
    assetsPerGame[_gameId].push( Asset({ assetName: "Park Lane 2", priceAmount: 20, owner: address(0)}) );

    LogBoardCreated(_gameId);
  }

  /*********** Prerequisites ***********/
  modifier isValidAsset(uint256 _gameId, uint _assetId){
    require( assetsPerGame[_gameId].length > 0 );
    require( _assetId < assetsPerGame[_gameId].length  );
    _;
  }

  /*********** Query functions ***********/
  function priceAmountOf(uint256 _gameId, uint _assetId) public view
    isValidAsset( _gameId, _assetId )
    returns(uint)
  {
    return assetsPerGame[_gameId][_assetId].priceAmount;
  }

  function ownerOf(uint256 _gameId, uint _assetId) public view
    isValidAsset( _gameId, _assetId )
    returns(address)
  {
    return assetsPerGame[_gameId][_assetId].owner;
  }

  /*********** Trading functions ***********/
  function purchase(uint256 _gameId, uint _assetId) public {
    require( ownerOf(_gameId,_assetId) == address(0) );

    address player = msg.sender;

    assetsPerGame[_gameId][_assetId].owner = player;
    Banker(owner).transferFrom( _gameId, player, assetsPerGame[_gameId][_assetId].priceAmount );
  }

  function payRent(uint256 _gameId, uint _assetId) public payable {
    require( ownerOf(_gameId,_assetId) != address(0) );

    uint rent = assetsPerGame[_gameId][_assetId].priceAmount / 10;
    address player = msg.sender;

    Banker(owner).transferBetween(
      _gameId,
      player,
      assetsPerGame[_gameId][_assetId].owner,
      rent );
  }

  /*********** Gaming functions ***********/
  function movePlayer(uint256 _gameId, uint diceNumber) public {
    uint totalSpaces = assetsPerGame[_gameId].length;
    playerPositions[_gameId][msg.sender] = (playerPositions[_gameId][msg.sender]+diceNumber) % totalSpaces;
  }
}
