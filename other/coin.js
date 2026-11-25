import { recordFirst } from "./tally.js";

const flip = document.querySelector("#flip");
const ledger = document.querySelector("#ledger");
const verdict = document.querySelector("#verdict");
const finding = document.querySelector("#finding");
const rates = [40, 50, 60];
let rate, heads, tails;

function reset() {
  rate = rates[Math.floor(Math.random() * rates.length)];
  heads = tails = 0;
  ledger.textContent = "";
  finding.replaceChildren();
  verdict.hidden = true;
  flip.hidden = false;
  flip.textContent = "Flip the coin";
}

flip.onclick = () => {
  const isHeads = Math.random() < rate / 100;
  if (isHeads) heads++;
  else tails++;
  ledger.textContent = `Flip ${heads + tails} came up ${isHeads ? "heads" : "tails"}. Heads: ${heads}. Tails: ${tails}.`;
  verdict.hidden = false;
  flip.textContent = "Flip again";
};

for (const button of verdict.querySelectorAll("button")) {
  button.onclick = () => {
    const fair = button.dataset.fair === "yes";
    const correct = fair === (rate === 50);
    flip.hidden = verdict.hidden = true;
    const title = document.createElement("h3");
    title.tabIndex = -1;
    title.textContent = correct ? "Your verdict stands." : "The coin fooled you.";
    const details = document.createElement("p");
    const count = heads + tails;
    details.textContent = `You called it ${fair ? "fair" : "biased"} after ${count} ${count === 1 ? "flip" : "flips"}. Its true chance of heads was ${rate}%. Your sample came in at ${Math.round(heads / count * 100)}% heads.`;
    const tally = document.createElement("div");
    tally.className = "tally";
    const again = document.createElement("button");
    again.textContent = "Draw another coin";
    again.onclick = () => { reset(); flip.focus(); };
    finding.replaceChildren(title, details, tally, again);
    title.focus({ preventScroll: true });
    recordFirst(tally, "referees-coin-first-result-v1", "/coin", { rate, heads, tails, fair }, result => {
      const { total, correct, fairCalls, flips } = result;
      if (![total, correct, fairCalls, flips].every(Number.isSafeInteger) || total < 1 || correct < 0 || correct > total || fairCalls < 0 || fairCalls > total || flips < total) throw new Error("Invalid coin tally");
      tally.textContent = `From the referees’ notebooks: ${correct} of ${total} first verdicts were correct (${Math.round(correct / total * 100)}%). Fair calls: ${fairCalls}. Biased calls: ${total - fairCalls}. Average flips before deciding: ${(flips / total).toFixed(1)}. Each browser contributes once.`;
    });
  };
}
reset();
