"use server";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAIKpKundliData = fetchAIKpKundliData;
var celestine = require("celestine");
var dasha_1 = require("@/lib/dasha");
var genai_1 = require("@google/genai");
var geoUtils_1 = require("@/lib/geoUtils");
var kpAstrology_1 = require("@/lib/kpAstrology");
var withTimeout = function (promise, ms, fallback) {
    return Promise.race([
        promise,
        new Promise(function (resolve) { return setTimeout(function () { return resolve(fallback); }, ms); })
    ]);
};
function fetchAIKpKundliData(name, dob, tob, pob) {
    return __awaiter(this, void 0, void 0, function () {
        function getSidereal(tropical) {
            var sid = tropical - kpAyanamsa;
            if (sid < 0)
                sid += 360;
            return sid;
        }
        var lat, lon, countryCode, geoRes, geoData, err_1, _a, year, month, day, _b, hour, minute, timezone, birth, chartOptions, chart, kpAyanamsa, cusps, kpPlanets, planetNameMap, northNode, southNode, rahuLon, rahuInfo, ketuLon, ketuInfo, _c, planetSignificators, houseSignificators, ascCusp, moonPlanet, sunPlanet, siderealMoon, siderealSun, tithiDeg, tithiIndex, paksha, tithiNumber, tithi, yogaDeg, dashaData, dashaContext, yogaIndex, yogas, yoga, movableKaranas, karana, karanaNum, rulingPlanets, bpHouses, d1Houses, ascSign, readingData, ai, prompt_1, fallbackModels, aiJson, _i, fallbackModels_1, modelName, aiPromise, response, err_2, err_3;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    lat = 22.5726;
                    lon = 88.3639;
                    countryCode = "in";
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("[https://nominatim.openstreetmap.org/search?q=$](https://nominatim.openstreetmap.org/search?q=$){encodeURIComponent(pob)}&format=json&limit=1&addressdetails=1", {
                            headers: { "User-Agent": "AIAstrology/2.0" }
                        })];
                case 2:
                    geoRes = _k.sent();
                    return [4 /*yield*/, geoRes.json()];
                case 3:
                    geoData = _k.sent();
                    if (geoData && geoData.length > 0) {
                        lat = parseFloat(geoData[0].lat);
                        lon = parseFloat(geoData[0].lon);
                        countryCode = ((_d = geoData[0].address) === null || _d === void 0 ? void 0 : _d.country_code) || "";
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _k.sent();
                    console.error("Geocoding failed for KP:", err_1);
                    return [3 /*break*/, 5];
                case 5:
                    _a = dob.split("-").map(Number), year = _a[0], month = _a[1], day = _a[2];
                    _b = tob.split(":").map(Number), hour = _b[0], minute = _b[1];
                    return [4 /*yield*/, (0, geoUtils_1.getAccurateTimezone)(lat, lon, countryCode, pob)];
                case 6:
                    timezone = _k.sent();
                    birth = { year: year, month: month, day: day, hour: hour, minute: minute, latitude: lat, longitude: lon, timezone: timezone };
                    chartOptions = { includeNodes: "true", houseSystem: "placidus" };
                    chart = celestine.calculateChart(birth, chartOptions);
                    kpAyanamsa = (0, kpAstrology_1.getKpAyanamsa)(year, month, day);
                    cusps = [];
                    chart.houses.cusps.forEach(function (c) {
                        var siderealLon = getSidereal(c.longitude);
                        var kpInfo = (0, kpAstrology_1.getKpDetailsForLongitude)(siderealLon);
                        cusps.push({
                            houseNumber: c.house,
                            longitude: siderealLon,
                            signIndex: kpInfo.signIndex,
                            signName: kpInfo.signName,
                            signLord: kpInfo.signLord,
                            degreeInSign: kpInfo.degreeInSign,
                            degFormatted: kpInfo.degFormatted,
                            nakshatraName: kpInfo.nakshatraName,
                            starLord: kpInfo.starLord,
                            subLord: kpInfo.subLord
                        });
                    });
                    cusps.sort(function (a, b) { return a.houseNumber - b.houseNumber; });
                    kpPlanets = [];
                    planetNameMap = {
                        Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
                        Venus: "Ve", Saturn: "Sa", "North Node": "Ra", "South Node": "Ke"
                    };
                    chart.planets.forEach(function (p) {
                        if (planetNameMap[p.name]) {
                            var siderealLon = getSidereal(p.longitude);
                            var kpInfo = (0, kpAstrology_1.getKpDetailsForLongitude)(siderealLon);
                            var houseOccupied = (0, kpAstrology_1.getHouseForLongitude)(siderealLon, cusps);
                            kpPlanets.push({
                                name: p.name,
                                vedicName: planetNameMap[p.name] || p.name,
                                longitude: siderealLon,
                                signIndex: kpInfo.signIndex,
                                signName: kpInfo.signName,
                                signLord: kpInfo.signLord,
                                degreeInSign: kpInfo.degreeInSign,
                                degFormatted: kpInfo.degFormatted,
                                nakshatraName: kpInfo.nakshatraName,
                                nakshatraPada: kpInfo.nakshatraPada,
                                starLord: kpInfo.starLord,
                                subLord: kpInfo.subLord,
                                houseOccupied: houseOccupied,
                                isRetrograde: Boolean(p.isRetrograde)
                            });
                        }
                    });
                    if (chart.nodes && chart.nodes.length >= 2) {
                        northNode = chart.nodes.find(function (n) { return n.name === "North Node"; }) || chart.nodes[0];
                        southNode = chart.nodes.find(function (n) { return n.name === "South Node"; }) || chart.nodes[1];
                        if (northNode) {
                            rahuLon = getSidereal(northNode.longitude);
                            rahuInfo = (0, kpAstrology_1.getKpDetailsForLongitude)(rahuLon);
                            kpPlanets.push({
                                name: "Rahu", vedicName: "Ra", longitude: rahuLon, signIndex: rahuInfo.signIndex,
                                signName: rahuInfo.signName, signLord: rahuInfo.signLord, degreeInSign: rahuInfo.degreeInSign,
                                degFormatted: rahuInfo.degFormatted, nakshatraName: rahuInfo.nakshatraName,
                                nakshatraPada: rahuInfo.nakshatraPada, starLord: rahuInfo.starLord, subLord: rahuInfo.subLord,
                                houseOccupied: (0, kpAstrology_1.getHouseForLongitude)(rahuLon, cusps), isRetrograde: true
                            });
                        }
                        if (southNode) {
                            ketuLon = getSidereal(southNode.longitude);
                            ketuInfo = (0, kpAstrology_1.getKpDetailsForLongitude)(ketuLon);
                            kpPlanets.push({
                                name: "Ketu", vedicName: "Ke", longitude: ketuLon, signIndex: ketuInfo.signIndex,
                                signName: ketuInfo.signName, signLord: ketuInfo.signLord, degreeInSign: ketuInfo.degreeInSign,
                                degFormatted: ketuInfo.degFormatted, nakshatraName: ketuInfo.nakshatraName,
                                nakshatraPada: ketuInfo.nakshatraPada, starLord: ketuInfo.starLord, subLord: ketuInfo.subLord,
                                houseOccupied: (0, kpAstrology_1.getHouseForLongitude)(ketuLon, cusps), isRetrograde: true
                            });
                        }
                    }
                    // Untenanted Planets & Independent Houses Logic
                    kpPlanets.forEach(function (p) {
                        p.isUntenanted = !kpPlanets.some(function (otherP) { return otherP.starLord === p.name.substring(0, 3) || otherP.starLord === p.name; });
                    });
                    cusps.forEach(function (cusp) {
                        cusp.occupantCount = kpPlanets.filter(function (p) { return p.houseOccupied === cusp.houseNumber; }).length;
                        var lordPlanet = kpPlanets.find(function (p) { return p.name === cusp.signLord || p.vedicName === cusp.signLord; });
                        cusp.isIndependent = lordPlanet ? (cusp.occupantCount === 0 && lordPlanet.isUntenanted) : false;
                    });
                    _c = (0, kpAstrology_1.buildKpSignificators)(kpPlanets, cusps), planetSignificators = _c.planetSignificators, houseSignificators = _c.houseSignificators;
                    ascCusp = cusps[0];
                    moonPlanet = kpPlanets.find(function (p) { return p.name === "Moon"; });
                    sunPlanet = kpPlanets.find(function (p) { return p.name === "Sun"; });
                    siderealMoon = moonPlanet ? moonPlanet.longitude : 0;
                    siderealSun = sunPlanet ? sunPlanet.longitude : 0;
                    tithiDeg = siderealMoon - siderealSun;
                    if (tithiDeg < 0)
                        tithiDeg += 360;
                    tithiIndex = Math.floor(tithiDeg / 12) + 1;
                    paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
                    tithiNumber = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
                    tithi = "".concat(paksha, " Paksha, Tithi ").concat(tithiNumber);
                    yogaDeg = siderealMoon + siderealSun;
                    if (yogaDeg >= 360)
                        yogaDeg -= 360;
                    dashaData = (0, dasha_1.calculateVimshottariDasha)(siderealMoon, dob);
                    dashaContext = dashaData.currentMahadasha ?
                        "Current Dasha (DBA): Mahadasha Lord is ".concat(dashaData.currentMahadasha.planet, ", Antardasha (Bhukti) Lord is ").concat((_e = dashaData.currentAntardasha) === null || _e === void 0 ? void 0 : _e.planet, ". Use these Dasha lords along with their KP significators to predict current events.") :
                        'Dasha timeline completed.';
                    yogaIndex = Math.floor(yogaDeg / (360 / 27));
                    yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
                    yoga = yogas[yogaIndex];
                    movableKaranas = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti (Bhadra)"];
                    karana = "";
                    karanaNum = Math.floor(tithiDeg / 6) + 1;
                    if (karanaNum === 1)
                        karana = "Kintughna";
                    else if (karanaNum >= 58) {
                        if (karanaNum === 58)
                            karana = "Shakuni";
                        else if (karanaNum === 59)
                            karana = "Chatushpada";
                        else
                            karana = "Naga";
                    }
                    else {
                        karana = movableKaranas[(karanaNum - 2) % 7];
                    }
                    rulingPlanets = {
                        ascendantSignLord: ascCusp.signLord,
                        ascendantStarLord: ascCusp.starLord,
                        ascendantSubLord: ascCusp.subLord,
                        moonSignLord: (moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.signLord) || "Unknown",
                        moonStarLord: (moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.starLord) || "Unknown",
                        moonSubLord: (moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.subLord) || "Unknown",
                        dayLord: new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "long" })
                    };
                    bpHouses = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
                    d1Houses = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
                    ascSign = ascCusp.signIndex;
                    kpPlanets.forEach(function (p) {
                        if (bpHouses[p.houseOccupied])
                            bpHouses[p.houseOccupied].push("".concat(p.vedicName).concat(p.isRetrograde ? "(R)" : ""));
                        var houseNum = p.signIndex - ascSign + 1;
                        if (houseNum <= 0)
                            houseNum += 12;
                        d1Houses[houseNum].push("".concat(p.vedicName).concat(p.isRetrograde ? "(R)" : ""));
                    });
                    readingData = {
                        reading: "[AI BUSY] Generating KP Analysis...", education: "", family: "", career: "", wealth: "", relationships: "", health: "", fullLife: "", breakthroughs: ""
                    };
                    if (!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here")) return [3 /*break*/, 15];
                    _k.label = 7;
                case 7:
                    _k.trys.push([7, 14, , 15]);
                    ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    prompt_1 = "Act as a world-renowned Grand Master of Krishnamurti Paddhati (KP) Astrology.\n  Analyze this exact KP Chart for ".concat(name, " born in ").concat(year, ":\n  - Asc CSL: ").concat(ascCusp.subLord, "\n  - Moon CSL: ").concat(moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.subLord, "\n  - 10th CSL (Career): ").concat((_f = cusps[9]) === null || _f === void 0 ? void 0 : _f.subLord, "\n  - 7th CSL (Marriage): ").concat((_g = cusps[6]) === null || _g === void 0 ? void 0 : _g.subLord, "\n  - 2nd/11th CSL (Wealth): ").concat((_h = cusps[1]) === null || _h === void 0 ? void 0 : _h.subLord, " / ").concat((_j = cusps[10]) === null || _j === void 0 ? void 0 : _j.subLord, "\n  \n    CRITICAL RULES FOR ZERO VARIANCE:\n  CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):\n  Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., \"The Moon makes you emotional\", \"Jupiter brings expansion\", \"You will feel a shift in energy\"). \n  You MUST translate every single astrological placement into STRICT, CONCRETE, REAL-WORLD EVENTS. \n  - Instead of \"intellectual growth\", specify \"securing a corporate job, publishing a paper, or passing a competitive exam.\"\n  - Instead of \"relationship harmony\", specify \"getting married, finding a high-value business partner, or resolving a legal dispute.\"\n  - Instead of \"financial expansion\", specify \"buying real estate, getting a promotion, or starting a new business venture.\"\n  Every single user expects extreme clarity, practical life events, and absolute unvarnished truth. Anchor your entire reading in specific, real-world outcomes.\n  1. INDEPENDENT HOUSES: If a house is empty and its lord is untenanted, it is extremely powerful.\n  2. STRICT BREAKTHROUGHS MATHEMATICS: You MUST NOT perform any math or calculations yourself. Breakthroughs ONLY happen at the exact Vedic Planetary Maturity Age of the CSLs (Sub-Lords). \n     You MUST use EXACTLY this pre-calculated table for the breakthrough years based on the birth year:\n     - Jupiter: Year ").concat(year + 16, " (Age 16)\n     - Sun: Year ").concat(year + 22, " (Age 22)\n     - Moon: Year ").concat(year + 24, " (Age 24)\n     - Venus: Year ").concat(year + 25, " (Age 25)\n     - Mars: Year ").concat(year + 28, " (Age 28)\n     - Mercury: Year ").concat(year + 32, " (Age 32)\n     - Saturn: Year ").concat(year + 36, " (Age 36)\n     - Rahu: Year ").concat(year + 42, " (Age 42)\n     - Ketu: Year ").concat(year + 48, " (Age 48)\n     CRITICAL: Just copy the Exact Year from the table above. Do not show your math.\n  3. SPECIFIC HOUSE MANIFESTATION (NO GENERIC READINGS): When describing a breakthrough, do NOT just give generic planetary traits (e.g., Moon = emotions, Mars = drive). You MUST explicitly connect the planet to the HOUSES it rules as a CSL in this exact chart! If a planet is the 10th CSL, 2nd CSL, 6th CSL, or 11th CSL, its maturity year MUST be explicitly described as a major CAREER, JOB, or FINANCIAL breakthrough (e.g., getting a first major job, corporate success, or huge wealth). \n  4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a bulleted or numbered list with double line breaks (\n\n) between items. Clearly state the Exact Year, the Planetary Trigger, and provide a highly detailed, extensive explanation of what will happen in their career, wealth, and life.");
                    fallbackModels = [
                        "gemini-3.5-flash-lite",
                        "gemini-3.1-flash-lite",
                        "gemini-flash-lite-latest",
                        "gemini-3.8-flash",
                        "gemini-3.7-flash",
                        "gemini-3.6-flash",
                        "gemini-3.5-flash",
                        "gemini-3-flash",
                        "gemini-2.5-flash"
                    ];
                    aiJson = null;
                    _i = 0, fallbackModels_1 = fallbackModels;
                    _k.label = 8;
                case 8:
                    if (!(_i < fallbackModels_1.length)) return [3 /*break*/, 13];
                    modelName = fallbackModels_1[_i];
                    _k.label = 9;
                case 9:
                    _k.trys.push([9, 11, , 12]);
                    aiPromise = ai.models.generateContent({
                        model: modelName,
                        contents: prompt_1,
                        config: {
                            temperature: 0.2,
                            responseMimeType: "application/json",
                            // Forcing 100% Valid JSON Structure
                            responseSchema: {
                                type: "OBJECT",
                                properties: {
                                    reading: { type: "STRING" },
                                    education: { type: "STRING" },
                                    family: { type: "STRING" },
                                    career: { type: "STRING" },
                                    wealth: { type: "STRING" },
                                    relationships: { type: "STRING" },
                                    health: { type: "STRING" },
                                    fullLife: { type: "STRING" },
                                    breakthroughs: { type: "STRING" }
                                },
                                required: ["reading", "education", "family", "career", "wealth", "relationships", "health", "fullLife", "breakthroughs"]
                            }
                        }
                    });
                    return [4 /*yield*/, withTimeout(aiPromise, 45000, null)];
                case 10:
                    response = _k.sent();
                    if (response && response.text) {
                        aiJson = JSON.parse(response.text);
                        return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _k.sent();
                    console.warn("[Model ".concat(modelName, "] failed. Trying next..."));
                    return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 8];
                case 13:
                    if (aiJson) {
                        readingData = __assign(__assign({}, readingData), aiJson);
                    }
                    else {
                        throw new Error("All fallback AI models failed or timed out.");
                    }
                    return [3 /*break*/, 15];
                case 14:
                    err_3 = _k.sent();
                    console.error("KP AI Generation completely failed:", err_3);
                    readingData.reading = "[AI ERROR] AI generation failed: ".concat((err_3 === null || err_3 === void 0 ? void 0 : err_3.message) || 'Unknown error', ". Please refresh to try again.");
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/, __assign({ name: name, dob: dob, tob: tob, pob: pob, houses: bpHouses, d1Houses: d1Houses, ascendant: "".concat(ascCusp.signName, " (").concat(ascCusp.degFormatted, ")"), ascendantLord: ascCusp.signLord, ascendantSubLord: ascCusp.subLord, moonSign: "".concat(moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.signName, " (").concat(moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.degFormatted, ")"), moonSignLord: moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.signLord, moonSubLord: moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.subLord, sunSign: "".concat(sunPlanet === null || sunPlanet === void 0 ? void 0 : sunPlanet.signName, " (").concat(sunPlanet === null || sunPlanet === void 0 ? void 0 : sunPlanet.degFormatted, ")"), sunSignLord: sunPlanet === null || sunPlanet === void 0 ? void 0 : sunPlanet.signLord, sunSubLord: sunPlanet === null || sunPlanet === void 0 ? void 0 : sunPlanet.subLord, nakshatra: (moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.nakshatraName) || "Rohini", nakshatraPada: (moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.nakshatraPada) || 1, nakshatraLord: (moonPlanet === null || moonPlanet === void 0 ? void 0 : moonPlanet.starLord) || "Moon", tithi: tithi, yoga: yoga, karana: karana, ayanamsaVal: "KP New (".concat((0, kpAstrology_1.formatDMS)(kpAyanamsa), ")"), kpAyanamsa: (0, kpAstrology_1.formatDMS)(kpAyanamsa), ascendantCusp: ascCusp, dashaData: dashaData, moonInfo: moonPlanet, cusps: cusps, planets: kpPlanets, planetSignificators: planetSignificators, houseSignificators: houseSignificators, rulingPlanets: rulingPlanets, bpHouses: bpHouses }, readingData)];
            }
        });
    });
}
