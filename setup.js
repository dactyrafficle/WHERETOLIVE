

let SETS = [];
let count = 0;
let n_sets = 10;

let n_permut = 1;

window.addEventListener("load", function() {
  
  let setRatingsTable = document.getElementById("setRatingsTable");
  
   let p1 = fetch("./living_criteria.json?x="+Math.random())
    .then((r) => r.json())
    .then((arr) => {
 
      console.log(arr);
      
      let keys = Object.keys(arr);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (arr[key]["Type"] == "Discrete") {
          let k = arr[key]["Values"].length;
          n_permut *= k;
          console.log(n_permut);
        }
      }
      
      let mytable = document.getElementById("mytable");
      generateTable(arr_=arr, table_=mytable)
      
      for (let i = 0; i < n_sets; i++) {
        SETS.push(generateSet(arr_=arr, id_=count));
        count++;
      }
      
      
      fight(SETS_=SETS);
      updateSetRankings(SETS_=SETS, parentTable_=setRatingsTableBody);
      
      
    });
    
    
    myDataSetDownloadBtn.addEventListener("click", function() {
      // DOWNLOADFILE(SETS_=SETS);
      // SETS
      download_from_browser(str_=JSON.stringify(SETS), file_name_="sets.json")
    }); // closing downloadBtn
    
    myResultsDownloadBtn.addEventListener("click", function() {
      DOWNLOADFILE(SETS_=SETS);
    }); // closing downloadBtn
  
}); // closing window.onload


function DOWNLOADFILE(SETS_) {
  let csv_string = "";
  let HEADER = KEYS2CSVROW(SETS_[0]);
  
  csv_string += HEADER["csvrow"] + "\n";
  
  let keys = HEADER["keys"];
  for (let i = 0; i < SETS_.length; i++) {
    csv_string += setToCSVRow(keys, SETS_[i]);
    csv_string += "\n";
  }
  download_from_browser(str_=csv_string, file_name_="sets.csv")
}; // closing downloadFile


function updateSetRankings(SETS_, parentTable_) {
  
  parentTable_.innerHTML = "";
  
  SETS_.sort((a,b) => {
    return b["Score"] - a["Score"];
  });
  
  for (let y = 0; y < SETS_.length; y++) {
    let s = SETS_[y];
    let tr = document.createElement("tr");
    parentTable_.appendChild(tr);
    
    {
      let td = document.createElement("td");
      td.innerHTML = s["Set id"];
      tr.appendChild(td);
    }
    
    {
      let td = document.createElement("td");
      td.innerHTML = s["Number of fights"];
      tr.appendChild(td);
    }
    
    {
      let td = document.createElement("td");
      td.innerHTML = s["Score"];
      tr.appendChild(td);
    }
    
  }
  
}; // closing fn

function updateScoresUsingELO(winner_, other_) {
  
  // update scores
  let K = 32;   // K is some constant
  let R = winner_["Score"];
  let R_other = other_["Score"]
  let E_inv = 1+10**((R_other-R)/400);
  let E = 1/E_inv;
  
  // R_new = R_old + K*(S-E)
  // S is the outcome S=(1=win, 0.5=draw, 0 = loss)
  winner_["Score"] = Math.floor( (R + K*(1-E))*100)/100;
  other_["Score"] = Math.floor( (R_other + K*(0-E))*100)/100;
  
  winner_["Number of fights"]++;
  other_["Number of fights"]++;

}; // closing fn

function fight(SETS_) {
  
  shuffle(SETS_);
  let s1=SETS[0];
  let s2=SETS[1];
  
  console.log("fight");
  console.log(s1);
  console.log(s2);
  
  addSetToTable(s_=s1, table_=mytable, col_=1, other_=s2);
  addSetToTable(s_=s2, table_=mytable, col_=2, other_=s1);
  
  let btn1 = document.createElement("div");
  btnContainer1.appendChild(btn1);
  btn1.innerHTML = "set 1";
  btn1.classList.add("btn");
  btn1.addEventListener("click", function() {
    console.log("fight over");
    btn1.remove();
    btn2.remove();
    updateScoresUsingELO(winner_=s1, other_=s2);
    console.log(s1);
    console.log(s2);
    fight(SETS_);
    updateSetRankings(SETS_=SETS, parentTable_=setRatingsTableBody);
  });
  
  let btn2 = document.createElement("div");
  btnContainer2.appendChild(btn2);
  btn2.innerHTML = "set 2";
  btn2.classList.add("btn");
  btn2.addEventListener("click", function() {
    console.log("fight over");
    btn1.remove();
    btn2.remove();
    updateScoresUsingELO(winner_=s2, other_=s1);
    console.log(s1);
    console.log(s2);
    fight(SETS_);
    updateSetRankings(SETS_=SETS, parentTable_=setRatingsTableBody);
  });
  
};


function generateSet(arr_, id_) {
  
  let s = {
    "Values":{},
    "Set id":id_,
    "Number of fights":0,
    "Score":100
  };
  
  Object.keys(arr_).forEach((a,b,c) => {
    
    s["Values"][a] = null;
    let obj = arr_[a];
    
    if (obj["Type"] == "Continuous") {
      let min = obj["Min"];
      let max = obj["Max"];
      s["Values"][a] = Math.floor((Math.random()*(max-min)+min));
    }
    
    if (obj["Type"] == "Discrete") {
      let n = obj["Values"].length;
      let index = Math.floor(Math.random()*n);
      s["Values"][a] = obj["Values"][index];
    }
     
  });
  
  return s;
}; // closing generate set

function addSetToTable(s_, table_, col1_, other_) {
  
  // Number of fights
  {
    let row = document.getElementById("Set id");
    let cells = row.children;
    cells[col1_].innerHTML = s_["Set id"];
  }
  
  Object.keys(s_["Values"]).forEach((a,b,c) => {

    let row = document.getElementById(a);
    let cells = row.children;
    cells[col1_].innerHTML = s_["Values"][a];

  }); // closing forEach
  
  // Number of fights
  {
    let row = document.getElementById("Number of fights");
    let cells = row.children;
    cells[col1_].innerHTML = s_["Number of fights"];
  }
  
  // Score
  {
    let row = document.getElementById("Score");
    let cells = row.children;
    cells[col1_].innerHTML = s_["Score"];
  }
  
  /*
  // calculate their Pr(Win)
  let score1 = s_["Score"];
  let score_other = other_["Score"];
  {
    let row = document.getElementById("Pr(Win)");
    let cells = row.children;
    cells[col1_].innerHTML = s_["Score"];
  }
  */
  
}; // closing fn

function generateTable(arr_, table_) {
  
  // SCORE
  {
    let tr = document.createElement("tr");
    table_.appendChild(tr);
    tr.id = "Set id";
    
    let td = document.createElement("td");
    td.innerHTML = "Set id";
    tr.appendChild(td);
    
    let td1 = document.createElement("td");
    td1.innerHTML = null;
    tr.appendChild(td1);
    
    let td2 = document.createElement("td");
    td2.innerHTML = null;
    tr.appendChild(td2);
  }
  
  Object.keys(arr_).forEach((a,b,c) => {
    
    let tr = document.createElement("tr");
    table_.appendChild(tr);
    tr.id = a;
    
    let categories = arr_[a]["Categories"];
    // console.log(categories);
    
    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i]
      if (cat !== "") {tr.classList.add(cat);}
    }
    
    
    let td = document.createElement("td");
    td.innerHTML = a;
    if (arr_[a]["Type"] == "Discrete") { td.innerHTML += " (" + arr_[a]["Values"].length + ")"}
    tr.appendChild(td);
    
    let td1 = document.createElement("td");
    td1.innerHTML = null;
    tr.appendChild(td1);
    
    let td2 = document.createElement("td");
    td2.innerHTML = null;
    tr.appendChild(td2);
    
  });
  
  // SCORE
  {
    let tr = document.createElement("tr");
    table_.appendChild(tr);
    tr.id = "Number of fights";
    
    let td = document.createElement("td");
    td.innerHTML = "Number of fights";
    tr.appendChild(td);
    
    let td1 = document.createElement("td");
    td1.innerHTML = null;
    tr.appendChild(td1);
    
    let td2 = document.createElement("td");
    td2.innerHTML = null;
    tr.appendChild(td2);
  }
  
  
  // SCORE
  {
    let tr = document.createElement("tr");
    table_.appendChild(tr);
    tr.id = "Score";
    
    let td = document.createElement("td");
    td.innerHTML = "Score";
    tr.appendChild(td);
    
    let td1 = document.createElement("td");
    td1.innerHTML = null;
    tr.appendChild(td1);
    
    let td2 = document.createElement("td");
    td2.innerHTML = null;
    tr.appendChild(td2);
  }
  
  // Pr(Win)
  /*
  {
    let tr = document.createElement("tr");
    table_.appendChild(tr);
    tr.id = "Pr(Win)";
    
    let td = document.createElement("td");
    td.innerHTML = "Pr(Win)";
    tr.appendChild(td);
    
    let td1 = document.createElement("td");
    td1.innerHTML = null;
    tr.appendChild(td1);
    
    let td2 = document.createElement("td");
    td2.innerHTML = null;
    tr.appendChild(td2);
  }
  */
  
}; // closing fn

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
};

/*

R_new = R_old + K*(S-E)
K is some constant
S is the outcome S=(1=win, 0.5=draw, 0 = loss)

E_inv = 1+10**((R2-R1)/400) 
E = 1/E_inv


*/