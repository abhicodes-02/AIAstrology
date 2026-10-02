"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVimshottariDasha = calculateVimshottariDasha;
var DASHA_ORDER = [
    { planet: "Ketu", years: 7 },
    { planet: "Venus", years: 20 },
    { planet: "Sun", years: 6 },
    { planet: "Moon", years: 10 },
    { planet: "Mars", years: 7 },
    { planet: "Rahu", years: 18 },
    { planet: "Jupiter", years: 16 },
    { planet: "Saturn", years: 19 },
    { planet: "Mercury", years: 17 },
];
function addDaysToDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function calculateVimshottariDasha(moonLongitude, birthDateStr) {
    // Nakshatra span is 13°20' = 13.3333... degrees
    var NAKSHATRA_SPAN = 13 + 20 / 60;
    // Find which Nakshatra the Moon is in (0 to 26)
    var nakshatraIndex = Math.floor(moonLongitude / NAKSHATRA_SPAN);
    // Find exact degree passed inside the Nakshatra
    var degreePassed = moonLongitude % NAKSHATRA_SPAN;
    var fractionPassed = degreePassed / NAKSHATRA_SPAN;
    var fractionRemaining = 1 - fractionPassed;
    // Each group of 9 Nakshatras maps to the 9 planets in order
    var dashaLordIndex = nakshatraIndex % 9;
    var firstDasha = DASHA_ORDER[dashaLordIndex];
    // Calculate Balance of Dasha at birth
    var totalDaysInFirstDasha = firstDasha.years * 365.25;
    var daysRemaining = Math.floor(totalDaysInFirstDasha * fractionRemaining);
    var yearsRem = Math.floor(daysRemaining / 365.25);
    var monthsRem = Math.floor((daysRemaining % 365.25) / 30.44);
    var daysRem = Math.floor((daysRemaining % 365.25) % 30.44);
    var birthDate = new Date(birthDateStr);
    var mahadashas = [];
    var currentStartDate = new Date(birthDate);
    var firstDashaEndDate = addDaysToDate(currentStartDate, daysRemaining);
    mahadashas.push({
        planet: firstDasha.planet,
        start: currentStartDate.toISOString().split('T')[0],
        end: firstDashaEndDate.toISOString().split('T')[0],
        duration: firstDasha.years
    });
    currentStartDate = new Date(firstDashaEndDate);
    // Calculate the rest of the 120 years
    var nextIndex = (dashaLordIndex + 1) % 9;
    for (var i = 0; i < 8; i++) {
        var dasha = DASHA_ORDER[nextIndex];
        var daysInDasha = dasha.years * 365.25;
        var endDate = addDaysToDate(currentStartDate, daysInDasha);
        mahadashas.push({
            planet: dasha.planet,
            start: currentStartDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0],
            duration: dasha.years
        });
        currentStartDate = new Date(endDate);
        nextIndex = (nextIndex + 1) % 9;
    }
    // Find Current Mahadasha
    var now = new Date();
    var currentMahadasha = mahadashas.find(function (md) { return new Date(md.start) <= now && new Date(md.end) >= now; }) || null;
    // Calculate Antardashas for the Current Mahadasha
    var currentAntardashas = [];
    var currentAntardasha = null;
    if (currentMahadasha) {
        var mahadashaLordIndex = DASHA_ORDER.findIndex(function (d) { return d.planet === currentMahadasha.planet; });
        var adIndex = mahadashaLordIndex; // Antardasha always starts with the Mahadasha lord
        var adStartDate = new Date(currentMahadasha.start);
        for (var i = 0; i < 9; i++) {
            var adPlanet = DASHA_ORDER[adIndex];
            // Formula for Antardasha: (MD Years * AD Years) / 120 = length in years
            // Length in days: (MD Years * AD Years * 365.25) / 120
            var adDays = (currentMahadasha.duration * adPlanet.years * 365.25) / 120;
            var adEndDate = addDaysToDate(adStartDate, adDays);
            var period = {
                planet: adPlanet.planet,
                start: adStartDate.toISOString().split('T')[0],
                end: adEndDate.toISOString().split('T')[0]
            };
            currentAntardashas.push(period);
            if (now >= adStartDate && now <= adEndDate) {
                currentAntardasha = period;
            }
            adStartDate = new Date(adEndDate);
            adIndex = (adIndex + 1) % 9;
        }
    }
    return {
        balance: {
            planet: firstDasha.planet,
            yearsRemaining: yearsRem,
            monthsRemaining: monthsRem,
            daysRemaining: daysRem
        },
        mahadashas: mahadashas,
        currentMahadasha: currentMahadasha,
        currentAntardashas: currentAntardashas,
        currentAntardasha: currentAntardasha
    };
}
