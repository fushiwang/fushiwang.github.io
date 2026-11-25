import { tallyURL } from "./tally-config.js";

export async function recordFirst(box, entryKey, path, firstResult, render) {
  if (!tallyURL) {
    box.textContent = "The shared tally hasn’t opened yet.";
    return;
  }
  let entry;
  try {
    entry = JSON.parse(localStorage.getItem(entryKey));
    if (!entry) {
      entry = { id: crypto.randomUUID(), ...firstResult };
      localStorage.setItem(entryKey, JSON.stringify(entry));
    }
  } catch {
    box.textContent = "Browser storage is unavailable. Your round could not be added to the tally.";
    return;
  }
  async function submit() {
    box.textContent = "Checking the shared tally…";
    try {
      const response = await fetch(new URL(path, tallyURL), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry), signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error("Tally unavailable");
      render(await response.json());
    } catch {
      box.textContent = "The shared tally couldn’t be reached. ";
      const retry = document.createElement("button");
      retry.textContent = "Retry tally";
      retry.onclick = submit;
      box.append(retry);
    }
  }
  await submit();
}
