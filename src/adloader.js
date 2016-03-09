var utils = require('./utils');

//add a script tag to the page, used to add /jpt call to page
exports.loadScript = function (tagSrc, callback) {
  if (!tagSrc) {
    utils.logError('Error attempting to request empty URL', 'adloader.js:loadScript');
    return;
  }

  var jptScript = document.createElement('script');
  jptScript.type = 'text/javascript';
  jptScript.async = true;

  // Execute a callback if necessary
  if (callback && typeof callback === 'function') {
    if (jptScript.readyState) {
      jptScript.onreadystatechange = function () {
        if (jptScript.readyState === 'loaded' || jptScript.readyState === 'complete') {
          jptScript.onreadystatechange = null;
          callback();
        }
      };
    } else {
      jptScript.onload = function () {
        callback();
      };
    }
  }

  //call function to build the JPT call
  jptScript.src = tagSrc;

  //add the new script tag to the page
	var topElement = document.head || document.body;
	topElement.insertBefore(jptScript, topElement.firstChild);
};

//track a impbus tracking pixel
//TODO: Decide if tracking via AJAX is sufficent, or do we need to
//run impression trackers via page pixels?
exports.trackPixel = function (pixelUrl) {
  let delimiter;
  let trackingPixel;

  if (!pixelUrl || typeof (pixelUrl) !== 'string') {
    utils.logMessage('Missing or invalid pixelUrl.');
    return;
  }

  delimiter = pixelUrl.indexOf('?') > 0 ? '&' : '?';

  //add a cachebuster so we don't end up dropping any impressions
  trackingPixel = pixelUrl + delimiter + 'rnd=' + Math.floor(Math.random() * 1E7);
  (new Image()).src = trackingPixel;
  return trackingPixel;
};
