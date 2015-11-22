'use strict';

exports.object2form = function(obj){
  return Object.keys(obj).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(obj[keyName])
  }).join('&');
};

exports.removeA = function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
