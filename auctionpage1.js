let playerCount = 0;

function addPlayerRow() {
  playerCount++;
  const div = document.createElement('div');
  div.className = 'player-row';
  div.dataset.id = playerCount;
  div.innerHTML = `
    <div class="player-num">${playerCount}</div>
    <input type="text" placeholder="Player ${playerCount} name">
    <button class="btn-remove" onclick="removeRow(this, 'player')">×</button>
  `;
  document.getElementById('playerInputs').appendChild(div);
  div.querySelector('input').focus();
  updateCount();
}

function removeRow(btn, type) {
  btn.closest('.' + type + '-row').remove();
  renumberRows('player');
  updateCount();
}

function renumberRows(type) {
  document.querySelectorAll('.' + type + '-row').forEach((row, i) => {
    row.querySelector('.' + type + '-num').textContent = i + 1;
  });
  playerCount = document.querySelectorAll('.player-row').length;
}

function updateCount() {
  const n = document.querySelectorAll('.player-row').length;
  document.getElementById('playerCount').textContent = n + ' player' + (n !== 1 ? 's' : '') + ' added';
}

function nextPage() {
  const names = [];
  document.querySelectorAll('#playerInputs input').forEach(i => {
    if (i.value.trim()) names.push(i.value.trim());
  });
  if (names.length === 0) return alert('Please add at least one player.');
  localStorage.setItem('playerNames', JSON.stringify(names));
  window.location.href = 'auctionpage2.html';
}

document.getElementById('btnAddPlayer').addEventListener('click', addPlayerRow);
document.getElementById('btnNext').addEventListener('click', nextPage);

// Start with one row ready
addPlayerRow();
