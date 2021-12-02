const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(resolver) {
    // 初始化数据
    // 存放状态
    this._status = PENDING;
    // 存放返回值
    this._value = undefined;
    // 存放错误返回值
    this._reason = undefined;
    if (typeof resolver !== "function") throw new Error("promise argument must be a function!");
    let resolve = (value) => {
      final.apply(this, ["FULFILLED"].concat([value]));
    };
    let reject = (err) => {
      final.apply(this, ["REJECTED"].concat([err]));
    };
    let final = (status, value) => {
      if (this._status !== PENDING) return;
      this._status = status;
      this[status === FULFILLED ? "_value" : "_reason"] = value;
    };
    try {
      resolver(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  // 实现then
  then(fuledFn, rejectedFn) {
    if (this._status === FULFILLED) {
      fuledFn(this._value);
    } else if (this._status === REJECTED) {
      rejectedFn(this._reason);
    } else {
      return new Promise(fuledFn);
    }
  }
}
 new Promise((resolve) => {
    resolve('成功');
  }).then(
    (data) => {
      console.log('success', data)
    },
    (err) => {
      console.log('faild', err)
    }
  )



