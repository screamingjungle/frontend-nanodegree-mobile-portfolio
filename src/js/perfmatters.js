// Measuring the Critical Rendering Path with Navigation Timing
// https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp

function l() {
  var t = window.performance.timing,
    d = t.domContentLoadedEventStart - t.domLoading,
    c = t.domComplete - t.domLoading;
  var s = document.getElementById("crp-stats");
  s.textContent = 'DCL: ' + d + 'ms, onload: ' + c + 'ms';
}

window.addEventListener("load", function(e) {
  l();
});
