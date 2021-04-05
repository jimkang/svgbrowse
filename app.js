var d3 = require('d3-selection');
var Zoom = require('d3-zoom');
var handleError = require('handle-error-web');
var { version } = require('./package.json');

var board = d3.select('#board');
var contentSVG = d3.select('#content-svg');

(function go() {
  d3.select('#svg-file').on('change', onFileChange);

  board.attr('width', document.body.getBoundingClientRect().width - 10);
  board.attr('height', document.body.getBoundingClientRect().height - 20);
  var zoomLayer = board.select('#board .zoom-layer');
  var zoom = Zoom.zoom().scaleExtent([0.1, 4]).on('zoom', zoomed);

  board.call(zoom);

  var initialZoomParams = Zoom.zoomIdentity.translate(120, -29).scale(0.29);
  zoomLayer.transition().duration(750).call(zoom.transform, initialZoomParams);

  onFileChange();

  renderVersion();

  function zoomed() {
    zoomLayer.attr('transform', d3.event.transform);
  }
})();

function onFileChange() {
  var files = this.files;
  if (!files || files.length < 1) {
    return;
  }

  var file = files[0];
  file.text().then(loadSVGString).catch(handleError);
}

function loadSVGString(svgString) {
  contentSVG.html(svgString);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
