const games = {
  game: {
    title: "The Preference Cycle",
    body: `<p>Pick whichever you prefer each time. Your first round counts toward the shared tally.</p>
      <div id="round" aria-live="polite"></div>`,
    async load() {
      const { start } = await import("./game.js?v=dialogs");
      start();
    }
  },
  coin: {
    title: "The Referee’s Coin",
    body: `<p>The coin is fair… or is it? Its chance of heads is either 40%, 50%, or 60%, each equally likely. Flip as often as you like, then call it fair or biased.</p>
      <button type="button" id="flip">Flip the coin</button>
      <p id="ledger" role="status"></p>
      <div id="verdict" hidden>
        <button type="button" data-fair="yes">I call it fair</button>
        <button type="button" data-fair="no">I call it biased</button>
      </div>
      <div id="finding" aria-live="polite"></div>`,
    load: () => import("./coin.js")
  }
};

async function openGame(key) {
  const game = games[key];
  let dialog = document.getElementById(key + "-window");
  if (dialog) {
    if (!dialog.open) dialog.showModal();
    return;
  }
  dialog = document.createElement("dialog");
  dialog.id = key + "-window";
  dialog.className = "game-window";
  dialog.setAttribute("aria-labelledby", key + "-window-title");
  dialog.innerHTML = `<form method="dialog"><button type="submit" aria-label="Close game">Close</button></form>
    <h2 id="${key}-window-title">${game.title}</h2>
    <div class="margin-note">${game.body}</div>`;
  document.body.append(dialog);
  dialog.showModal();
  try {
    await game.load();
  } catch {
    dialog.querySelector(".margin-note").textContent = "The game couldn’t load. Please refresh the page and try again.";
  }
}

for (const link of document.querySelectorAll("[data-play]")) {
  link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openGame(link.dataset.play);
  });
}

// Existing links to the games on the Other page also open the corresponding window.
const linkedGame = location.hash.slice(1);
if (Object.hasOwn(games, linkedGame) && document.getElementById(linkedGame)) openGame(linkedGame);
