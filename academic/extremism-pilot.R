# Website companion to Table 1 and the two OLS regressions in section 4.
# The ten rows are transcribed in the order printed in the December 2024 paper.
pilot <- data.frame(
  posts = c(9799, 9056, 7584, 6052, 6013, 5977, 5832, 5668, 5624, 4428),
  heritage_score = c(100, 90, 57, 77, 85, 98, 71, 60, 92, 98)
)
print(summary(lm(posts ~ heritage_score, data = pilot)))
print(summary(lm(log(posts) ~ heritage_score, data = pilot)))
