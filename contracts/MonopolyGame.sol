pragma solidity ^0.4.11;

import './MonopolyBoard.sol';
import './OwnableNotTransferible.sol';

contract  MonopolyGame is OwnableNotTransferible {
  address bankerAddress;
  address boardAddress;
  mapping( uint256 => address[] ) playersPerGameId;
  mapping( address => uint256[] ) gamePlayingPerPlayer;
  mapping( uint256 => bool ) startedGames;

  uint256 public lastGameId;

  event LogAddedNewPlayer(uint256 gameId, address player, uint256 initialBalance);
  event LogGameCreated(uint256 gameId);
  event LogGameFallback();
  
  function MonopolyGame(address _banker, address _monopolyBoard) public {
    bankerAddress = _banker;
    boardAddress = _monopolyBoard;
    lastGameId = 0;
  }

  function createNew() public returns(uint256) {
    lastGameId += 1;
    LogGameCreated(lastGameId);
    return lastGameId;
  }

  // TODO _player and _initialBalance should be msg.sender and msg.value
  function addPlayer(uint256 _gameId, address _player, uint256 _initialBalance) public {

    require( _gameId <= lastGameId );
    require( !startedGames[_gameId] );
    require( _initialBalance == 1500 );

    //Banker(bankerAddress).secureBalance(_gameId,_player,_initialBalance);
	//ver https://ethereum.stackexchange.com/questions/3667/difference-between-call-callcode-and-delegatecall
    if( !bankerAddress.delegatecall(bytes4(keccak256("secureBalance(uint256,address,uint256)")),_gameId,_player,_initialBalance) )
      revert();

    playersPerGameId[_gameId].push(_player);
    gamePlayingPerPlayer[_player].push(_gameId);

    LogAddedNewPlayer(_gameId,_player,_initialBalance);
  }

  function start(uint256 _gameId) public {
    require( !startedGames[_gameId] );
    require( playersPerGameId[_gameId].length > 2 );

    MonopolyBoard(boardAddress).newInstanceFor(_gameId);
    startedGames[_gameId] = true;
  }

  function playNextPlayer(uint256 _gameId) public {
    uint diceNumber = uint(block.blockhash(block.number-1))%6 + 1;
    MonopolyBoard(boardAddress).movePlayer(_gameId, diceNumber);
  }

  function () public {
     LogGameFallback();
  }
}
