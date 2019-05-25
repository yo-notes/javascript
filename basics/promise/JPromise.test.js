const { JPromise } = require('./JPromise');

new JPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('2 seconds later, fulfilled.');
  }, 2000);
})
  .then(res => {
    console.log(res);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('1 seconds later, then reurned promise fulfilled.');
      }, 1000);
    });
  })
  .then(res => {
    console.log(res);
  })
  .finally(() => {
    // throw new Error('hhahahaha')
    console.log('finally called');
  }).catch(err=>{
    console.log('Got a error: ', err)
  });
