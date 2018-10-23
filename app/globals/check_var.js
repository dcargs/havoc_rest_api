module.exports.check_var = function(x){
  if(x == "" || x == undefined){
    // console.log("x type: "+typeof x);
    return false;//bad
  } else {
    return true;
  }
};
