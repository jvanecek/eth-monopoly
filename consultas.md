* Cuando descomento los truffle*.js para usar testrpc, `truffle test` no deploya los contratos.
* Hay forma de sacar los warning del compilador?
* No se entiende las fallas de los tests.
-- `Banker.isTurnOf(address _player)` estaba devolviendo un objeto. La definí como `constant` y anduvo. ¿Qué tiene que ver?
-- `Purchasable.purchasedBy(address _player)` no puede llamar a las funciones de `Banker`. Tuve que usar `call` y es horrible.
-- El `Purchasable` se está creando con las variables de estado vacías.
