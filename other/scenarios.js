// Each scenario uses the same three offers throughout all three matchups.
export const scenarios = [
  {
    title: "The conference hotel",
    prompt: "You’re paying out of pocket. Pick a room for the night before your talk.",
    offers: [
      ["The Arbitrage Inn", "$95 · 12-minute walk · above a karaoke bar"],
      ["Hotel Ceteris Paribus", "$165 · 3-minute walk · occasional hallway chatter"],
      ["The Silent Partner", "$130 · 25-minute walk · blissfully quiet courtyard room"]
    ]
  },
  {
    title: "The departmental die-off",
    prompt: "Pick your die. A rival rolls the other one. Higher roll gets the last conference brownie. All six faces are equally likely.",
    offers: [
      ["Keynes", "Faces: 2, 2, 4, 4, 9, 9"],
      ["Hayek", "Faces: 1, 1, 6, 6, 8, 8"],
      ["Pareto", "Faces: 3, 3, 5, 5, 7, 7"]
    ],
    note: "Each die beats one rival on 20 of 36 rolls. Trying to win the brownie can itself produce a cycle."
  },
  {
    title: "Lunch under scarcity",
    prompt: "Your seminar starts in 30 minutes. All lunches are equally filling. Which one gets your order?",
    offers: [
      ["The Sunk-Cost Sandwich", "$5 · 8-minute wait · yesterday’s bread"],
      ["The Efficient Frontier Falafel", "$9 · 4-minute wait · made this morning"],
      ["The Nash Equili-burrito", "$13 · 15-minute wait · rolled fresh with guacamole"]
    ]
  },
  {
    title: "The replication crisis",
    prompt: "You have one afternoon to start a paper. Which dataset would you take home?",
    offers: [
      ["The Unicorn Panel", "20 years of observations · 400 firms · names change spelling every quarter"],
      ["The Tidy Census", "1 year · 40,000 firms · pristine IDs and a codebook with page numbers"],
      ["The Goldilocks Sample", "8 years · 4,000 firms · clean IDs, but the codebook is in your advisor’s handwriting"]
    ]
  },
  {
    title: "An economist walks into a gig",
    prompt: "Same pianist, same set, same Friday night. Which ticket would you buy?",
    offers: [
      ["The Liquidity Trap", "$12 · back row · nonrefundable"],
      ["The Real Option", "$30 · middle row · fully refundable until showtime"],
      ["The Invisible Hand", "$23 · front row with a view of both hands · nonrefundable"]
    ]
  }
];
