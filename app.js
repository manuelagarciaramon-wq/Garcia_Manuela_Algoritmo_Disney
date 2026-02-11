// =====================
// 1) Datos
// =====================

const peliculas = [
"El Rey León",
"Frozen",
"Moana",
"Aladdín",
"La Bella y la Bestia",
"Mulan",
"Toy Story",
"Encanto",
"Hércules",
"Coco"
];

const segmentos = {
"NI": "Niños (5–10 años)",
"AD": "Adolescentes",
"FA": "Familiar",
"NO": "Nostalgia 90s–2000s",
"MU": "Amantes de los musicales"
};

const contextos = {
"DI": "¿Cuál es MÁS DIVERTIDA?",
"EM": "¿Cuál es MÁS EMOTIVA?",
"MU": "¿Cuál tiene MEJOR MÚSICA?",
"HI": "¿Cuál tiene MEJOR HISTORIA?",
"RE": "¿Cuál volverías a ver MÁS veces?"
};

// Elo
const RATING_INICIAL = 1000;
const K = 32;

const STORAGE_KEY = "disneymash_state_v1";

function defaultState(){
const buckets = {};
for (const seg of Object.keys(segmentos)){
for (const ctx of Object.keys(contextos)){
const key = `${seg}__${ctx}`;
buckets[key] = {};
peliculas.forEach(p => buckets[key][p] = RATING_INICIAL);
}
}
return { buckets, votes: [] };
}

function loadState(){
const raw = localStorage.getItem(STORAGE_KEY);
if (!raw) return defaultState();
try { return JSON.parse(raw); }
catch { return defaultState(); }
}

function saveState(){
localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

function expectedScore(ra, rb){
return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function updateElo(bucket, a, b, winner){
const ra = bucket[a], rb = bucket[b];
const ea = expectedScore(ra, rb);
const sa = (winner === "A") ? 1 : 0;
bucket[a] = ra + K * (sa - ea);
bucket[b] = rb + K * ((1 - sa) - (1 - ea));
}

function randomPair(){
const a = peliculas[Math.floor(Math.random() * peliculas.length)];
let b = a;
while (b === a){
b = peliculas[Math.floor(Math.random() * peliculas.length)];
}
return [a, b];
}

function bucketKey(seg, ctx){ return `${seg}__${ctx}`; }

function topN(bucket, n=10){
const arr = Object.entries(bucket).map(([pelicula, rating]) => ({pelicula, rating}));
arr.sort((x,y) => y.rating - x.rating);
return arr.slice(0, n);
}

// UI wiring igual que base CourseMash...
// (Se mantiene idéntico en comportamiento)
