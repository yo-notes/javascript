/**
 * ignore any call of `func` during pre truly called timestamp `ms`(expect last) 
 * @param {*} func 
 * @param {*} ms 
 */
function throttle(func, ms) {
  let isCoolDown = true
  let _args = _this = null

  function wraper() {
    if(!isCoolDown) {
      _args = arguments
      _this = this
      return
    }

    isCoolDown = false
    func.apply(this, arguments)

    setTimeout(() => {
      isCoolDown = true
      if(_args) { // call the last ignored `callling func`
        wraper.apply(_this, _args)
        _this = _args = null
      }
    }, ms);
  }

  return wraper
}


// test
function f(a) {
  console.log(a)
};

// f1000 passes calls to f at maximum once per 1000 ms
let f1000 = throttle(f, 1000);

f1000(1); // shows 1
f1000(2); // (throttling, 1000ms not out yet)
f1000(3); // (throttling, 1000ms not out yet)