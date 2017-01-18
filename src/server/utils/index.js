const jsonp = (callback, obj) => {
  const json = JSON.stringify(obj);
  if (callback)
    return callback + '(' + json + ')';
  return json;
};

module.exports = {jsonp};