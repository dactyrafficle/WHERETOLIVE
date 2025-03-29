function download_from_browser(str_, file_name_="abc.txt") {
  let a = document.createElement("a");
  a.href = "data:," + encodeURI(str_);
  a.target = "_blank";
  a.download = file_name_;
  a.click();
  a.remove();
};

function escapeString(str) {
  let output = '"' + str + '"';
  return output;
};

function KEYS2CSVROW(s_) {
  
  let csvrow = "";
  csvrow += escapeString("Set id") + ",";
  csvrow += escapeString("Number of fights") + ",";
  csvrow += escapeString("Score") + ","; 
  
  let keys = Object.keys(s_["Values"]);
  console.log(keys);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    csvrow += escapeString(key);
    if (i < (keys.length-1)) {csvrow += ",";}
  }
  return {
    "keys":keys,
    "csvrow":csvrow
  };
}; // closing fn

function setToCSVRow(keys, s_) {
  
  let csvrow = "";
  csvrow += s_["Set id"] + ",";
  csvrow += s_["Number of fights"] + ",";
  csvrow += s_["Score"] + ","; 

  //let keys = Object.keys(s_["Values"]);
  //console.log(keys);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = s_["Values"][key];

    csvrow += escapeString(value);
    if (i < (keys.length-1)) {csvrow += ","; continue;}
  }
  return csvrow;
}; // closing fn