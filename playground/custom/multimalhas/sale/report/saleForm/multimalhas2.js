let productionService = new zen.client.api.supply.production.ProductionService(zen.ctx.z);
let productionOrderList = await productionService.productionOrderRead("q=tags==sale:1016");
for (const productionOrder of productionOrderList) {
  productionOrder.productionStepList = await productionService.productionStepRead(`q=productionOrder.id==${productionOrder.id}`);
  for (const productionStep of productionOrder.productionStepList) {
    productionStep.productionStepConsumptionList = await productionService.productionStepConsumptionRead(`q=productionStep.id==${productionStep.id}`);
  }
}
let result = {
  data: productionOrderList,
};
console.log(result);