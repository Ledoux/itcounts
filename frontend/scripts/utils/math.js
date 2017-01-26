// Given two quantities a and b, returns the fraction to split the circle a + b.
export function fraction (a, b) {
  var k = a / (a + b)
  if (k > 0 && k < 1) {
    var t0, t1 = Math.pow(12 * k * Math.PI, 1 / 3);
    for (var i = 0; i < 10; ++i) { // Solve for theta numerically.
      t0 = t1
      t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0))
    }
    k = (1 - Math.cos(t1 / 2)) / 2
  }
  return k
}
