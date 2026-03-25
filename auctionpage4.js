let teams=JSON.parse(localStorage.getItem("teams"));
let players=JSON.parse(localStorage.getItem("playerNames"))||[];
let history=[];
let wakeLock=null;

const teamSelect=document.getElementById("teamSelect");
const playerSelect=document.getElementById("playerSelect");
const display=document.getElementById("teamsDisplay");

function loadPlayers(){
  playerSelect.innerHTML="";
  players.forEach(p=>{
    const o=document.createElement("option");
    o.value=p;o.textContent=p;
    playerSelect.appendChild(o);
  });
}

function loadTeams(){
  teamSelect.innerHTML="";
  display.innerHTML="";
  teams.forEach((t,i)=>{
    const o=document.createElement("option");
    o.value=i;o.textContent=t.name;
    teamSelect.appendChild(o);

    display.innerHTML+=`
    <div class="card">
    <b>${t.name}</b><br>
    Captain: ${t.captain}<br>
    Remaining: ₹${t.remaining}<br>
    Players: ${t.players.join(", ") || "None"}
    </div>`;
  });
}

function addPlayer(){
  const p=playerSelect.value;
  const amt=Number(amount.value);
  const ti=teamSelect.value;
  if(!p||!amt)return alert("Missing data");
  if(teams[ti].remaining<amt)return alert("Not enough budget");

  history.push({p,amt,ti});

  players=players.filter(x=>x!==p);
  teams[ti].players.push(p);
  teams[ti].remaining-=amt;

  save();
  amount.value="";
  loadPlayers();loadTeams();
}

function undoLastBid(){
  if(history.length==0)return alert("Nothing to undo");
  const last=history.pop();
  teams[last.ti].players=
    teams[last.ti].players.filter(x=>x!==last.p);
  teams[last.ti].remaining+=last.amt;
  players.push(last.p);
  save();
  loadPlayers();loadTeams();
}

function selectRandomPlayer(){
  if(players.length==0)return alert("No players left");
  const r=Math.floor(Math.random()*players.length);
  playerSelect.value=players[r];
}

function save(){
  localStorage.setItem("teams",JSON.stringify(teams));
  localStorage.setItem("playerNames",JSON.stringify(players));
}

function toggleFullScreen(){
  if(!document.fullscreenElement)
    document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

async function enableWakeLock(){
  if("wakeLock"in navigator){
    wakeLock=await navigator.wakeLock.request("screen");
    alert("Screen will stay awake");
  }
}

loadPlayers();
loadTeams();
