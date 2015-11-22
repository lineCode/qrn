/**
 * Created by caoyawen-gongzuo on 15/11/21.
 */
var isString = function (s) {
  return typeof(s) === 'string' || s instanceof String;
};

exports.checkString = function (s, default_value){
  if (isString(s) === true){
    return s;
  }else{
    return default_value;
  }
};

exports.checkUndefined = function (v, default_value){
  return typeof v === "undefined" ? default_value : v;
};
