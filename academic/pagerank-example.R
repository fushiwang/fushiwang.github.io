# Website companion to the six-page example in section 7 of the survey.
# Each list entry names the destinations linked from one page.
outlinks <- list(c(2, 3, 4), c(1, 3, 4), integer(), integer(), c(4, 6), c(2, 3))
n <- length(outlinks)
transition <- matrix(0, n, n)
for (page in seq_along(outlinks)) {
  destinations <- outlinks[[page]]
  if (!length(destinations)) destinations <- seq_len(n)
  transition[destinations, page] <- 1 / length(destinations)
}
restart_probability <- 0.6
transition <- (1 - restart_probability) * transition + restart_probability / n
probability <- rep(1 / n, n)
repeat {
  updated <- drop(transition %*% probability)
  if (max(abs(updated - probability)) < 1e-12) break
  probability <- updated
}
results <- data.frame(page = seq_len(n), probability = updated)
print(results[order(-results$probability), ], row.names = FALSE)
