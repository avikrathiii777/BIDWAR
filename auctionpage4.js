let teams   = JSON.parse(localStorage.getItem('teams')) || [];
let players = JSON.parse(localStorage.getItem('playerNames')) || [];
let history = [];

const teamSelect   = document.getElementById('teamSelect');
const playerSelect = document.getElementById('playerSelect');
const display      = document.getElementById('teamsDisplay');
const countEl      = document.getElementById('teamCount');

// ── Players dropdown ──
function loadPlayers() {
  playerSelect.innerHTML = '';
  if (players.length === 0) {
    const o = document.createElement('option');
    o.textContent = '🎉 All players assigned!';
    playerSelect.appendChild(o);
    return;
  }
  players.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    playerSelect.appendChild(o);
  });
}

// ── Team cards ──
function loadTeams() {
  teamSelect.innerHTML = '';
  display.innerHTML    = '';
  countEl.textContent  = teams.length + ' team' + (teams.length !== 1 ? 's' : '');

  teams.forEach((t, i) => {
    const o = document.createElement('option');
    o.value = i; o.textContent = t.name;
    teamSelect.appendChild(o);

    const pct      = t.budget > 0 ? Math.round((t.remaining / t.budget) * 100) : 100;
    const barStyle = pct > 50 ? '' : pct > 20 ? 'background:linear-gradient(90deg,#f59e0b,#ef4444)' : 'background:#ef4444';
    const playersHtml = t.players.length
      ? t.players.map(p => `<div class="player-chip">${p}</div>`).join('')
      : '<span class="no-players">No players yet</span>';

    display.innerHTML += `
      <div class="team-card">
        <div class="team-card-header">
          <div>
            <div class="team-name">${t.name}</div>
            <div class="team-captain">👑 ${t.captain}</div>
          </div>
          <div class="budget-chip">
            <div class="budget-amount">₹${t.remaining.toLocaleString()}</div>
            <div class="budget-label">Remaining</div>
          </div>
        </div>
        <div class="budget-bar-wrap">
          <div class="budget-bar-fill" style="width:${pct}%;${barStyle}"></div>
        </div>
        <div class="players-list">${playersHtml}</div>
      </div>`;
  });
}

// ── Bid ──
function addPlayer() {
  const p   = playerSelect.value;
  const amt = Number(document.getElementById('amount').value);
  const ti  = parseInt(teamSelect.value);
  if (!p || !amt)              return alert('Missing player or bid amount.');
  if (players.length === 0)    return alert('No players left to assign.');
  if (teams[ti].remaining < amt) return alert('Not enough budget for this bid!');

  history.push({ p, amt, ti });
  players = players.filter(x => x !== p);
  teams[ti].players.push(p);
  teams[ti].remaining -= amt;

  save();
  document.getElementById('amount').value = '';
  loadPlayers();
  loadTeams();
}

function undoLastBid() {
  if (history.length === 0) return alert('Nothing to undo.');
  const last = history.pop();
  teams[last.ti].players = teams[last.ti].players.filter(x => x !== last.p);
  teams[last.ti].remaining += last.amt;
  players.push(last.p);
  save();
  loadPlayers();
  loadTeams();
}

function selectRandomPlayer() {
  if (players.length === 0) return alert('No players left!');
  playerSelect.value = players[Math.floor(Math.random() * players.length)];
}

function save() {
  localStorage.setItem('teams', JSON.stringify(teams));
  localStorage.setItem('playerNames', JSON.stringify(players));
}

function toggleFullScreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

// ── Finish Auction ──
function finishAuction() {
  if (!confirm('End the auction and show final results?')) return;
  document.getElementById('auctionScreen').style.display = 'none';
  document.getElementById('endScreen').style.display = 'block';

  const unsold = players.length;
  document.getElementById('endSub').textContent =
    teams.length + ' teams finalised' + (unsold > 0 ? ' · ' + unsold + ' player' + (unsold !== 1 ? 's' : '') + ' unsold' : ' · All players sold!');

  const container = document.getElementById('endTeams');
  container.innerHTML = '';

  teams.forEach((t, i) => {
    const spent = t.budget - t.remaining;
    const playerLines = t.players.length
      ? t.players.map(p => `<div class="end-player-line">${p}</div>`).join('')
      : '<div style="color:var(--muted);font-style:italic;font-size:13px">No players assigned</div>';

    const copyText = buildTeamCopyText(t);

    container.innerHTML += `
      <div class="end-team-card">
        <div class="end-team-header">
          <div>
            <div class="end-team-name">${t.name}</div>
            <div class="end-team-meta">👑 ${t.captain || '—'} &nbsp;·&nbsp; ₹${spent.toLocaleString()} spent &nbsp;·&nbsp; ₹${t.remaining.toLocaleString()} left</div>
          </div>
        </div>
        <div class="end-team-body">
          <div class="end-players-list">${playerLines}</div>
          <div class="copy-box" id="copyBox${i}">${copyText}</div>
          <button class="btn-copy" id="copyBtn${i}" onclick="copyTeam(${i})">📋 Copy this team</button>
        </div>
      </div>`;
  });
}

function buildTeamCopyText(t) {
  const lines = [
    `Team: ${t.name}`,
    `Captain: ${t.captain || '—'}`,
    `Budget Remaining: ₹${t.remaining.toLocaleString()}`,
    `Players (${t.players.length}):`,
    ...t.players.map((p, i) => `  ${i + 1}. ${p}`)
  ];
  return lines.join('\n');
}

function copyTeam(i) {
  const text = document.getElementById('copyBox' + i).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn' + i);
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 Copy this team'; btn.classList.remove('copied'); }, 2000);
  });
}

function copyAllTeams() {
  const allText = teams.map(t => buildTeamCopyText(t)).join('\n\n' + '─'.repeat(30) + '\n\n');
  navigator.clipboard.writeText(allText).then(() => {
    const btn = document.getElementById('btnCopyAll');
    btn.textContent = '✓ All Teams Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy All Teams'; }, 2500);
  });
}

// ── Event Listeners ──
document.getElementById('btnAdd').addEventListener('click', addPlayer);
document.getElementById('btnUndo').addEventListener('click', undoLastBid);
document.getElementById('btnRandom').addEventListener('click', selectRandomPlayer);
document.getElementById('btnFullscreen').addEventListener('click', toggleFullScreen);
document.getElementById('btnFinish').addEventListener('click', finishAuction);
document.getElementById('btnCopyAll').addEventListener('click', copyAllTeams);

document.querySelectorAll('.qb').forEach(btn => {
  btn.addEventListener('click', () => { document.getElementById('amount').value = btn.dataset.amt; });
});

// ── Boot ──
loadPlayers();
loadTeams();
