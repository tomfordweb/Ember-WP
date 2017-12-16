export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function makeid(amount = 10) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < amount; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export const GetIndexByKey = (key, needle, haystack) => {

  let existingRecord = haystack.find(x => x[key] === needle);

  return haystack.indexOf(existingRecord);
}

export const ReturnArrayIfUndefined = (variable) => {
  const noResults = (typeof variable === 'undefined' || variable === '' || variable === null);

  return (noResults) ? []  : variable;
}