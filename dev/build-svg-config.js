/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dirs = fs
  .readdirSync(path.resolve(__dirname, '..', './packages/suite-data/files/images/svg'))
  .filter(item => !['.DS_Store'].includes(item));

const payload = dirs.reduce((memo, curr) => {
  return {
    ...memo,
    [curr.replace('.svg', '')]: curr,
  };
}, {});

console.log(JSON.stringify(payload, null, 4));
