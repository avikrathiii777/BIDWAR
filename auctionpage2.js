let teamCount = 0;

function addTeamRow() {
  teamCount++;
  const div = document.createElement('div');
  div.className = 'team-row';
  div.innerHTML = `
    <div class="team-row-header">
      <div class="team-label">🏆 Team ${teamCount}</div>
      <button class="btn-remove" onclick="removeTeamRow(this)">×</button>
    </div>
    <input type="text" placeholder="Team name">
    <input type="text" placeholder="Captain name">
  `;
  document.getElementById('teamInputs').appendChild(div);
  div.querySelector('input').focus();
  updateCount();
}

function removeTeamRow(btn) {
  btn.closest('.team-row').remove();
  renumberTeams();
  updateCount();
}

function renumberTeams() {
  document.querySelectorAll('.team-row').forEach((row, i) => {
    row.querySelector('.team-label').textContent = '🏆 Team ' + (i + 1);
  });
  teamCount = document.querySelectorAll('.team-row').length;
}

function updateCount() {
  const n = document.querySelectorAll('.team-row').length;
  document.getElementById('teamCount').textContent = n + ' team' + (n !== 1 ? 's' : '') + ' added';
}

function nextPage() {
  const arr = [];
  document.querySelectorAll('.team-row').forEach(row => {
    const inputs = row.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const captain = inputs[1].value.trim();
    if (name) arr.push({ name, captain });
  });
  if (arr.length === 0) return alert('Please add at least one team.');
  localStorage.setItem('teams', JSON.stringify(arr));
  window.location.href = 'auctionpage3.html';
}

document.getElementById('btnAddTeam').addEventListener('click', addTeamRow);
document.getElementById('btnNext').addEventListener('click', nextPage);

// Start with one row ready
addTeamRow();
