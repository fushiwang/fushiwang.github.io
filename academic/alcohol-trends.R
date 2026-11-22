# Save this script and alcohol-consumption.csv in the same directory.
# From that directory, run Rscript alcohol-trends.R (base R).
observations <- read.csv("alcohol-consumption.csv")
series <- aggregate(cbind(beer, wine, spirits) ~ year, observations, mean)
colors <- c("#7c3434", "#526f78", "#595448")
pdf("alcohol-trends.pdf", width = 7, height = 4)
matplot(series$year, series[c("beer", "wine", "spirits")], type = "l",
        lty = 1:3, lwd = 2, col = colors, xlab = "Year",
        ylab = "Gallons of ethanol per capita",
        main = "Mean consumption across states and D.C.")
legend("topright", legend = c("Beer", "Wine", "Spirits"), col = colors,
       lty = 1:3, lwd = 2, bty = "n")
dev.off()
