/**
 * debounce `func`, ignore next call when during cool down (the `ms`)
 * 
 * @param {*} func 
 * @param {*} ms 
 */
function debounce(func, ms) {
  let isCoolDown = true
  return function() {
    if (!isCoolDown) return

    isCoolDown = false
    func.apply(this, arguments)

    setTimeout(() => {
      isCoolDown = true
    }, ms);
  }
}

let f = debounce(alert, 1000);

f(1); // runs immediately
f(2); // ignored

setTimeout(() => f(3), 100); // ignored ( only 100 ms passed )
setTimeout(() => f(4), 1100); // runs
setTimeout(() => f(5), 1500); // ignored (less than 1000 ms from the last run)

