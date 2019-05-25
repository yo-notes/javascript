/**
 * write your own Promise
 */

const State = {
  Pending: 'Pendding',
  Fulfilled: 'Fulfilled',
  Rejected: 'Rejected'
};
class JPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw TypeError(`Promise resolver ${executor} is not a function`);
    }
    this._state = State.Pending;
    this._chains = []; // for multi `.then`: promise.then(callback1); promise.then(callback2)

    const resolve = res => {
      if (this._state !== State.Pending) {
        return;
      }

      if (res && (typeof res.then === 'function')) {
        return res.then(resolve, reject);
      }

      this._state = State.Fulfilled;
      this._value = res;
      this._chains.forEach(({ onFulfilled }) => {
        // multi then's callbacks
        onFulfilled && onFulfilled(this._value);
      });
      return res;
    };

    const reject = err => {
      if (this._state !== State.Pending) {
        return;
      }

      this._state = State.Rejected;
      this._reason = err;
      this._chains.forEach(({ onRejected }) => {
        onRejected && onRejected(this._reason);
      });
    };

    // call the executor
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    return new JPromise((resolve, reject) => {
      const _onFulfilled = res => {
        try {
          resolve(onFulfilled(res));
        } catch (e) {
          reject(e);
        }
      };

      const _onRejected = err => {
        try {
          reject(onRejected(err));
        } catch (e) {
          reject(e);
        }
      };

      if (this._state === State.Fulfilled) {
        _onFulfilled(this._value);
      } else if (this._state === State.Rejected) {
        _onRejected(this._reason);
      } else {
        this._chains.push({
          onFulfilled: _onFulfilled,
          onRejected: _onRejected
        });
      }
    });
  }
  catch(onRejected) {
    this.then(null, onRejected);
  }
  finally(cb) {
    return this.then(
      res => {
        cb();
        return res;
      },
      err => {
        console.log(err)
        cb();
        throw err;
      }
    );
  }

  static all(list) {}

  static any(list) {}

  static race(list) {}

  static resolve(value) {
    if (value instanceof Promise) {
    }
  }
}

exports.JPromise = JPromise;
