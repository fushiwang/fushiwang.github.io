import { recordFirst } from "./tally.js";
import { scenarios } from "./scenarios.js?v=dialogs";


const round = document.querySelector("#round");
const pairs = [[0, 1], [1, 2], [2, 0]];
const entryKey = "preference-cycle-first-result-v1";
let games, questions, step;

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(label, action) {
  const node = element("button", label);
  node.type = "button";
  node.addEventListener("click", action, { once: true });
  return node;
}

function heading(title) {
  const node = element("h3", title);
  node.tabIndex = -1;
  round.append(node);
  node.focus({ preventScroll: true });
}

export function start() {
  games = shuffled(scenarios).slice(0, 2).map(scenario => ({ scenario, wins: [0, 0, 0] }));
  questions = shuffled(games.flatMap(game => pairs.map(pair => ({ game, pair }))));
  step = 0;
  ask();
}

function ask() {
  const { game, pair } = questions[step];
  round.replaceChildren(element("p", `Choice ${step + 1} of 6`, "label"));
  heading(game.scenario.title);
  const choices = element("div", "", "choices");
  round.append(element("p", game.scenario.prompt), choices);
  for (const index of shuffled(pair)) {
    const name = game.scenario.offers[index];
    const choice = button("", () => {
      game.wins[index]++;
      if (pair[0] === 0) game.firstBeatSecond = index === 0;
      step++;
      if (step === questions.length) finish();
      else ask();
    });
    choice.append(element("strong", name));
    choices.append(choice);
  }
}

function finish() {
  const cyclic = games.some(game => game.wins.every(n => n === 1));
  round.replaceChildren();
  heading(cyclic ? "Your choices formed a cycle." : "Your choices were transitive.");
  round.append(element("p", cyclic
    ? "At least one set of three picks loops back on itself. Follow the arrows below from each winner to the option it beat."
    : "In both dilemmas, your first choice beat your second and third, and your second beat your third. A theorist can put the chalk down."));
  for (const { scenario, wins, firstBeatSecond } of games) {
    const names = scenario.offers;
    const line = element("p", "");
    line.append(element("strong", scenario.title + " · "));
    // A triangle has one win per offer exactly when it contains a cycle.
    if (wins.every(n => n === 1)) {
      const order = firstBeatSecond ? [0, 1, 2, 0] : [0, 2, 1, 0];
      line.append(order.map(i => names[i]).join(" → "));
    } else {
      line.append([0, 1, 2].sort((a, b) => wins[b] - wins[a]).map(i => names[i]).join(" → "));
    }
    round.append(line);
  }
  const tally = element("div", "", "tally");
  round.append(tally, button("Play another round", start));
  showTally(tally, !cyclic);
}

function showTally(box, transitive) {
  return recordFirst(box, entryKey, "/", { transitive }, ({ transitive: consistent, total }) => {
    if (!Number.isSafeInteger(total) || total < 1 || !Number.isSafeInteger(consistent) || consistent < 0 || consistent > total) throw new Error("Invalid totals");
    const percent = Math.round(1000 * consistent / total) / 10;
    box.replaceChildren(element("strong", "The shared tally"), element("p",
      `${percent}% transitive (${consistent}) · ${(1000 - Math.round(percent * 10)) / 10}% with a cycle (${total - consistent})`),
      element("p", `${total} first ${total === 1 ? "round" : "rounds"} recorded. Each browser contributes its first result once.`, "meta"));
  });
}
