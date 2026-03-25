function generatePlayers(){
  const n=document.getElementById("players").value;
  const d=document.getElementById("playerInputs");
  d.innerHTML="";
  for(let i=1;i<=n;i++){
    d.innerHTML+=`Player ${i}:<input><br>`;
  }
}

function nextPage(){
  const names=[];
  document.querySelectorAll("#playerInputs input").forEach(i=>names.push(i.value));
  localStorage.setItem("playerNames",JSON.stringify(names));
  window.location.href="auctionpage2.html";
}
