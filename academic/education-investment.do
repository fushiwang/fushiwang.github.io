//////////////////////////
***SETTING UP DATA
//////////////////////////

capture log close
* Run from a working directory containing the IPUMS-CPS extract new_data.dta.
* Install outreg2 before running this archived analysis.
clear all
use "new_data.dta"
log using "new_data.log", replace


//////////
***KEEPING ONLY THE 6 YEARS WE USE
//////////
capture egen keep_year = anymatch(year), values(2007 2008 2010 2019 2020 2022)
keep if keep_year == 1
//modify above if need to change years


//////////
***SIMPLE LINEAR MODEL
***CREATING VARIABLES TO ADJUST FOR LOG AND DROPPING OBSERVATIONS

cap gen int_la = incint + 1 // Income from Interest LOG adjusted
cap gen inc_la = inctot + 1 // Income Total LOG adjusted

drop if incint == 9999999 // 9999999 = N.I.U. (Not in Universe).
drop if inctot == 999999999 // 999999999 = N.I.U (Not in Universe).


//////////
***QUANTIFY EDUCATION LEVELS TO YEARS 
//////////

cap gen educ_rev = educ 
replace educ_rev = 0 if educ == 2
replace educ_rev = 2.5 if educ == 10
replace educ_rev = 5.5 if educ == 20
replace educ_rev = 7.5 if educ == 30
replace educ_rev = 9 if educ == 40
replace educ_rev = 10 if educ == 50
replace educ_rev = 11 if educ == 60
replace educ_rev = 12 if educ == 71 // no diploma
replace educ_rev = 12 if educ == 73
replace educ_rev = 14 if educ == 81 // no degree
replace educ_rev = 14 if educ == 91
replace educ_rev = 14 if educ == 92
replace educ_rev = 16 if educ == 111
replace educ_rev = 18 if educ == 123
replace educ_rev = 19 if educ == 124 // professional school average
replace educ_rev = 20 if educ == 125

cap gen educ_sq = educ_rev * educ_rev
cap gen educ_cb = educ_rev * educ_rev * educ_rev
cap gen educ_log = log(educ_rev)
cap gen incint_log = log(int_la)
cap gen inctot_log = log(inc_la)


/////////////
***SIMPLE LINEAR REGRESSIONS
/////////////

reg int_la educ_rev
outreg2 using myreg.doc, replace ctitle(Linear)

reg int_la educ_sq
outreg2 using myreg.doc, append ctitle(Quadratic)

reg int_la educ_cb
outreg2 using myreg.doc, append ctitle(Cubic)

reg int_la educ_log
outreg2 using myreg.doc, append ctitle(Lin-Log)

reg incint_log educ
outreg2 using myreg.doc, append ctitle(Log-Lin)

reg incint_log educ_log
outreg2 using myreg.doc, append ctitle(Log-Log)

bys educ_rev: outreg2 using summary2.doc, replace sum(log) eqkeep(N mean) keep(int_la int_la_log)

outreg2 using summary.doc, replace sum(log) keep(educ_rev educ_sq educ_cb educ_rev_log int_la int_la_log ehat)


//////////
***DUMMY VARIABLE / INTERACTION TERM CREATION
//////////

capture generate male = 1 
replace male = 0 if sex == 2
// gender dummy

capture generate white = 0
replace white = 1 if race == 100

capture generate black = 0
replace black = 1 if race == 200

capture generate asian = 0
replace asian = 1 if race == 651
// race dummies


capture generate educ_cat = 1 if educ_rev < 12
replace educ_cat = 2 if educ_rev >= 12 & educ_rev < 16
replace educ_cat = 3 if educ_rev == 16
replace educ_cat = 4 if educ_rev > 16 & educ_rev <= 20
label define educ_cat1 1 "Before Graduating High School" 2 "High School Graduate" 3 "College Graduate(Bachelor's Degree)" 4 "Pursuing trade school/Masters/PHD"
label values educ_cat educ_cat1
label variable educ_cat educ_cat1
// education dummies 


capture gen y_2008 = 1 if year == 2008
replace y_2008 = 0 if year != 2008

capture gen y_2019 = 1 if year == 2019
replace y_2019 = 0 if year != 2019

capture gen y_2022 = 1 if year == 2022
replace y_2022 = 0 if year != 2022

capture gen y_2010 = 1 if year == 2010
replace y_2010 = 0 if year != 2010

capture gen y_2009 = 1 if year == 2009
replace y_2009 = 0 if year != 2009

capture gen y_2020 = 1 if year == 2020
replace y_2020 = 0 if year != 2020
// year dummies


capture gen married = 1 if marst == 1
replace married = 0 if married ==.
// married dummies

capture gen working = 1 if labforce == 2
replace working = 0 if labforce == 1
drop if labforce == 0
// labor force dummies

capture gen northeast = 0
replace northeast = 1 if region == 11
replace northeast = 1 if region == 12

capture gen midwest = 0
replace midwest = 1 if region == 21
replace midwest = 1 if region == 22

capture gen south = 0
replace south = 1 if region == 31
replace south = 1 if region == 32
replace south = 1 if region == 33

capture gen west = 0
replace west = 1 if region == 41
replace west = 1 if region == 42
// region dummies

capture gen male_inc = male*inc_la
capture gen male_educ = male*educ_rev
