const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EtomicSwapV1", (m) => {
  const etomicSwap = m.contract("EtomicSwap");

  return { etomicSwap };
});