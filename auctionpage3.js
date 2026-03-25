function startAuction(){
  const b=Number(document.getElementById("budget").value);
  const teams=JSON.parse(localStorage.getItem("teams"));
  teams.forEach(t=>{
    t.budget=b;
    t.remaining=b;
    t.players=[];
  });
  localStorage.setItem("teams",JSON.stringify(teams));
  window.location.href="auctionpage4.html";
}
