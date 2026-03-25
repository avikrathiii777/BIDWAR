function generateTeams(){
  const n=document.getElementById("teams").value;
  const d=document.getElementById("teamInputs");
  d.innerHTML="";
  for(let i=1;i<=n;i++){
    d.innerHTML+=`Team name:<input>Captain:<input><br>`;
  }
}

function nextPage(){
  const arr=[];
  const inputs=document.querySelectorAll("#teamInputs input");
  for(let i=0;i<inputs.length;i+=2){
    arr.push({name:inputs[i].value,captain:inputs[i+1].value});
  }
  localStorage.setItem("teams",JSON.stringify(arr));
  window.location.href="auctionpage3.html";
}
