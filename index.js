require('async-to-gen/register')({ sourceMaps: true });
const main = require('./main');

if (!process.argv[2] || !process.argv[3]) {
  console.log('Please supply a year and an output path.');
  process.exit(-1);
} else {
  main(process.argv[2], process.argv[3]);
}
