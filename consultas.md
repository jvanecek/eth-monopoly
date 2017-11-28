* Cuando descomento los truffle*.js para usar testrpc, `truffle test` no deploya los contratos.
* Hay forma de sacar los warning del compilador?

No se entiende las fallas de los tests.
* [Solved] `Banker.isTurnOf(address _player)` estaba devolviendo un objeto. La definí como `constant` y anduvo. ¿Qué tiene que ver?
* [Solved] `Purchasable.purchasedBy(address _player)` no puede llamar a las funciones de `Banker`. Tuve que usar `call` y es horrible. Estaba fallando porque el address del banker era nula. Cuando se instancio bien el contrato anduvo.
* [Solved] El `Purchasable` se está creando con las variables de estado vacías. Estaba fallando porque el argumento `address banker` estaba mal, y el await silenciaba el error, dejandote el contrato vacio. (!!!!!)


* Tuve que usar un delegateCall `MonopolyGame.addPlayer` porque siempre me tiraba un revert. 