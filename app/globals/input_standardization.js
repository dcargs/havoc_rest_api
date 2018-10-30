module.exports = {
  upper_case_first_letter: function(string){
    var x = string.toLowerCase();
    return x.charAt(0).toUpperCase() + x.slice(1);
  },
  lower_case_string: function(string){
    return string.toLowerCase();
  },
  upper_case_string: function(string){
    return string.toUpperCase();
  },
  title_case_string: function(string){
    var splitStr = string.toLowerCase().split(' ');
    for(var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }
}
