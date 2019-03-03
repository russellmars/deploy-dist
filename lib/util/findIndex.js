module.exports = function (arr, callback) {
  var length = arr == null ? 0 : arr.length;
  for (var i = 0; i < length; i++) {
    if (callback(arr[i])) {
      return i
    }
  }
  return -1
}