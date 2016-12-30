function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(true);
    }, ms);
  });
}


module.exports = wait;
