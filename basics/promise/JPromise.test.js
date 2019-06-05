const { JPromise } = require('./JPromise');

/*
// 
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
*/

/*
// Promise.all
const p1 = new JPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('1s later, resovled.');
  }, 1000);
});

const p2 = JPromise.resolve('resolved immediately');

JPromise.all([p1, p2]).then(
  list => {
    console.log('ALL-resolved: ', list);
  },
  error => {
    console.log('ALL-rejected: ', error);
  }
);
*/

// Promise.race
const p1 = new JPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('1s later, resovled.');
  }, 1000);
});

const p2 = new JPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('2s later, resovled.');
  }, 2000);
});

JPromise.race([p1, p2]).then(
  res => {
    console.log('RACE-resolved: ', res);
  },
  error => {
    console.log('RACE-rejected: ', error);
  }
);