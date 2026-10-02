"use server";
"use strict";
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
exports.fetchAIVarshaphalData = fetchAIVarshaphalData;
var celestine = require("celestine");
var genai_1 = require("@google/genai");
var withTimeout = function (promise, ms, fallback) {
    return Promise.race([
        promise,
        new Promise(function (resolve) { return setTimeout(function () { return resolve(fallback); }, ms); })
    ]);
};
function fetchAIVarshaphalData(name, dob, tob, pob, targetYear) {
    return __awaiter(this, void 0, void 0, function () {
        var lat, lon, geoRes, geoData, err_1, _a, year, month, day, _b, hour, minute, timezone, birth, chartOptions, chart, ayanamsa, swisseph, localDate, julday, getSidereal, sunData, siderealSun, signs, sunSign, moonData, siderealMoon, moonSign, ascSidereal, ascSignIdx, ascendantName, d1Houses, planetsData, varshaphalData, ai, yearToGenerate, nextYear, prompt_1, fallbackModels, aiJson, _i, fallbackModels_1, modelName, aiPromise, response, err_2, err_3;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    lat = 0;
                    lon = 0;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://nominatim.openstreetmap.org/search?q=".concat(encodeURIComponent(pob), "&format=json&limit=1"), {
                            headers: { "User-Agent": "AIAstrology/2.0" }
                        })];
                case 2:
                    geoRes = _e.sent();
                    return [4 /*yield*/, geoRes.json()];
                case 3:
                    geoData = _e.sent();
                    if (geoData && geoData.length > 0) {
                        lat = parseFloat(geoData[0].lat);
                        lon = parseFloat(geoData[0].lon);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _e.sent();
                    console.error("Geocoding failed", err_1);
                    return [3 /*break*/, 5];
                case 5:
                    _a = dob.split("-").map(Number), year = _a[0], month = _a[1], day = _a[2];
                    _b = tob.split(":").map(Number), hour = _b[0], minute = _b[1];
                    timezone = Math.round(lon / 15);
                    birth = { year: year, month: month, day: day, hour: hour, minute: minute, latitude: lat || 22.5726, longitude: lon || 88.3639, timezone: timezone };
                    chartOptions = { includeNodes: "true" };
                    chart = celestine.calculateChart(birth, chartOptions);
                    ayanamsa = 23.85 + (year - 2000) * (50.29 / 3600);
                    try {
                        swisseph = require("sweph-wasm");
                        localDate = new Date("".concat(dob, "T").concat(tob, ":00.000").concat(timezone >= 0 ? '+' : '-').concat(Math.abs(Math.floor(timezone)).toString().padStart(2, '0'), ":").concat((Math.abs(timezone % 1) * 60).toString().padStart(2, '0')));
                        julday = swisseph.swe_julday(localDate.getUTCFullYear(), localDate.getUTCMonth() + 1, localDate.getUTCDate(), localDate.getUTCHours() + localDate.getUTCMinutes() / 60, swisseph.SE_GREG_CAL);
                        swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
                        ayanamsa = swisseph.swe_get_ayanamsa_ut(julday);
                    }
                    catch (e) {
                        console.warn("[Varshaphal] sweph-wasm not available, using fallback.");
                    }
                    getSidereal = function (tropical) {
                        var sidereal = tropical - ayanamsa;
                        if (sidereal < 0)
                            sidereal += 360;
                        return sidereal;
                    };
                    sunData = (_c = chart.planets) === null || _c === void 0 ? void 0 : _c.find(function (b) { return b.name === "Sun"; });
                    siderealSun = sunData ? getSidereal(sunData.longitude) : 0;
                    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                    sunSign = signs[Math.floor(siderealSun / 30)];
                    moonData = (_d = chart.planets) === null || _d === void 0 ? void 0 : _d.find(function (b) { return b.name === "Moon"; });
                    siderealMoon = moonData ? getSidereal(moonData.longitude) : 0;
                    moonSign = signs[Math.floor(siderealMoon / 30)];
                    ascSidereal = getSidereal(chart.angles.ascendant.longitude);
                    ascSignIdx = Math.floor(ascSidereal / 30);
                    ascendantName = signs[ascSignIdx];
                    d1Houses = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
                    planetsData = chart.planets || [];
                    planetsData.forEach(function (planet) {
                        if (["Uranus", "Neptune", "Pluto", "Chiron", "Sirius"].includes(planet.name))
                            return;
                        var shortName = planet.name;
                        if (planet.name === "North Node")
                            shortName = "Rahu";
                        if (planet.name === "South Node")
                            shortName = "Ketu";
                        var pSidereal = getSidereal(planet.longitude);
                        var pSign = Math.floor(pSidereal / 30);
                        var d1House = pSign - ascSignIdx + 1;
                        if (d1House <= 0)
                            d1House += 12;
                        d1Houses[d1House].push(shortName);
                    });
                    varshaphalData = {
                        varshaphal: "[AI BUSY] Analyzing your Solar Return (Varshaphal) for the upcoming year...",
                        monthlyPredictions: [
                            { month: "Loading", theme: "Please Wait", prediction: "Generating deep insights...", career: "Loading...", relationships: "Loading..." }
                        ]
                    };
                    if (!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here")) return [3 /*break*/, 14];
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 13, , 14]);
                    ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    yearToGenerate = targetYear || new Date().getFullYear();
                    nextYear = yearToGenerate + 1;
                    prompt_1 = "Act as an expert Vedic Astrologer. A user named ".concat(name, " was born on ").concat(dob, " in ").concat(pob, ". \n  Here is their exact Natal Chart (D-1) data:\n  - Ascendant (Lagna): ").concat(ascendantName, "\n  - Moon Sign: ").concat(moonSign, "\n  - Sun Sign: ").concat(sunSign, "\n  - Planetary Houses: ").concat(JSON.stringify(d1Houses), "\n  \n  CRITICAL TIME ANCHOR: The USER HAS EXPLICITLY REQUESTED THE VARSHAPHAL FOR THE YEAR ").concat(yearToGenerate, ".\n  You MUST generate the Varshaphal strictly starting from their birthday in the year ").concat(yearToGenerate, " to their birthday in the year ").concat(nextYear, ". \n  Calculate their exact age for the year ").concat(yearToGenerate, " (").concat(yearToGenerate, " - Birth Year). Do NOT generate predictions for any other years. You must map the planetary transits for the 12 months starting from their solar return in ").concat(yearToGenerate, ". \n  Generate a deeply detailed Varshaphal (Solar Return Annual Forecast) for their current year of life, incorporating transits and planetary returns.\n  \n  CRITICAL RULES:\n  CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):\n  Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., \"The Moon makes you emotional\", \"Jupiter brings expansion\", \"You will feel a shift in energy\"). \n  You MUST translate every single astrological placement into STRICT, CONCRETE, REAL-WORLD EVENTS. \n  - Instead of \"intellectual growth\", specify \"securing a corporate job, publishing a paper, or passing a competitive exam.\"\n  - Instead of \"relationship harmony\", specify \"getting married, finding a high-value business partner, or resolving a legal dispute.\"\n  - Instead of \"financial expansion\", specify \"buying real estate, getting a promotion, or starting a new business venture.\"\n  Every single user expects extreme clarity, practical life events, and absolute unvarnished truth. Anchor your entire reading in specific, real-world outcomes.\n  1. MASSIVE DETAIL REQUIRED: For the overall yearly prediction and EVERY SINGLE MONTH, you MUST write at least 150-200 words per section.\n  2. Dive deeply into the transit dynamics, psychological shifts, career hurdles, and relationship developments for each month.\n  3. FORMATTING: You MUST use double line breaks (\n\n) between paragraphs to format your text beautifully. Avoid giant walls of text.");
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
                    _e.label = 7;
                case 7:
                    if (!(_i < fallbackModels_1.length)) return [3 /*break*/, 12];
                    modelName = fallbackModels_1[_i];
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 10, , 11]);
                    aiPromise = ai.models.generateContent({
                        model: modelName,
                        contents: prompt_1,
                        config: {
                            temperature: 0.2,
                            responseMimeType: "application/json",
                            // Forcing 100% Valid JSON Structure for 12 months
                            responseSchema: {
                                type: "OBJECT",
                                properties: {
                                    varshaphal: { type: "STRING", description: "Massive, deeply analyzed Yearly Prediction." },
                                    monthlyPredictions: {
                                        type: "ARRAY",
                                        items: {
                                            type: "OBJECT",
                                            properties: {
                                                month: { type: "STRING", description: "e.g., January 2024" },
                                                theme: { type: "STRING", description: "A 3-5 word theme for this month" },
                                                prediction: { type: "STRING", description: "Detailed transit impact for this month" },
                                                career: { type: "STRING" },
                                                relationships: { type: "STRING" }
                                            },
                                            required: ["month", "theme", "prediction", "career", "relationships"]
                                        }
                                    }
                                },
                                required: ["varshaphal", "monthlyPredictions"]
                            }
                        }
                    });
                    return [4 /*yield*/, withTimeout(aiPromise, 45000, null)];
                case 9:
                    response = _e.sent();
                    if (response && response.text) {
                        aiJson = JSON.parse(response.text);
                        return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _e.sent();
                    console.warn("[Model ".concat(modelName, "] failed. Trying next..."));
                    return [3 /*break*/, 11];
                case 11:
                    _i++;
                    return [3 /*break*/, 7];
                case 12:
                    if (aiJson) {
                        varshaphalData.varshaphal = aiJson.varshaphal;
                        varshaphalData.monthlyPredictions = aiJson.monthlyPredictions;
                    }
                    else {
                        throw new Error("All fallback AI models failed or timed out.");
                    }
                    return [3 /*break*/, 14];
                case 13:
                    err_3 = _e.sent();
                    console.error("Varshaphal AI Generation failed:", err_3);
                    varshaphalData.varshaphal = "[AI ERROR] The AI generation failed: ".concat((err_3 === null || err_3 === void 0 ? void 0 : err_3.message) || 'Unknown error', ". Please try again later.");
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/, varshaphalData];
            }
        });
    });
}
