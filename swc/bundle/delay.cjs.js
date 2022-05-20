module.exports = function delay (t = 2000) {
  return new Promise((r) => {
    setTimeout(r, t);
  });
}