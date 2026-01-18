const fs = require('fs');
const Deploy = require('./deployments/localhost-deployment.json');
console.log('ADDRESS:' + Deploy.contractAddress);
console.log('CHAINID:' + Deploy.chainId);
