const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const removeLastChar = (string) => string.slice(0, -1);

const getRandomElementInArray = (arr) => {
  randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const range = (end, start, step = 1) => {
  if (!start) return [...Array(end).keys()];

  const length = Math.ceil((end - start) / step);

  const arr = [...Array(length).keys()];

  return arr.map((x) => x + start + x * (step - 1));
};

const head = (arr) => arr.slice(0, 1)[0];

const tail = (arr) => arr.slice(1, arr.length);

const decoupleHead = (arr) => [head(arr), tail(arr)];

const evalPredicates = (...fns) => (x) => {
  const [head, tail] = decoupleHead(fns);
  return tail.length === 0
    ? head(x)
    : head(x)
    ? evalPredicates(...tail)(x)
    : false;
};

const pipe = (...fns) => (x) => {
  const [head, ...tail] = fns;
  const res = head(x);
  return tail.length > 0 ? pipe(...tail)(res) : res;
};

const map = (fn) => (x) => x.map(fn);

const filter = (...fns) => (x) =>
  fns.length === 1 ? x.filter(fns[0]) : x.filter(evalPredicates(...fns));

module.exports = {
  timeout,
  removeLastChar,
  getRandomElementInArray,
  range,
  head,
  tail,
  decoupleHead,
  evalPredicates,
  pipe,
  map,
  filter,
};
