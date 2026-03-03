// gen-data.cjs — generates synthetic dashboard-data.json
// Deliberately uneven coverage to exercise animation thresholds:
//   - Gender: F=34% → warning; Senior age bucket: 5% → critical
//   - BMI Slim: 4% → critical; Skin tone Light: 14% → critical
'use strict';
const fs = require('fs');

const rnd = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const uuid = () => 'dat-' + Math.random().toString(36).slice(2, 10);

// ── Config ──
const N_DATS = 420;
const PROJECTS = ['GTI-Alpha', 'GTI-Beta', 'GTI-Gamma'];
const FEATURES  = {
    'GTI-Alpha': ['FrontCamera', 'SideCamera', 'DepthSensor'],
    'GTI-Beta':  ['NightMode', 'LowLight', 'HDR'],
    'GTI-Gamma': ['MultiOccupant', 'ChildDetect'],
    'All':       ['FrontCamera', 'SideCamera', 'DepthSensor', 'NightMode', 'LowLight', 'HDR', 'MultiOccupant', 'ChildDetect']
};
const USAGE_TYPES = ['Nominal', 'OOP', 'SBM'];
const CAR_TYPES   = ['Sedan', 'SUV', 'Pickup', 'Van', 'Coupe'];
const CRS_TYPES   = ['Rear-Facing Infant', 'Rear-Facing Convertible', 'Forward-Facing', 'Booster Belt', 'Booster High-Back'];
const CRS_DIRS    = ['Center', 'Driver Side', 'Passenger Side'];
const CRS_TILTS   = ['Reclined', 'Upright', 'Semi-Reclined'];
const CRS_CANOPY  = ['No Canopy', 'Partial', 'Full'];
const CRS_OCC     = ['Occupied', 'Empty'];
const OOP_POSE    = ['Standard', 'Reclined', 'Slouched', 'Feet-Up'];
const OOP_LEGS    = ['No', 'Yes'];
const SBM_MISUSE  = ['None', 'Behind Back', 'Under Arm', 'Inverted'];

// ── Generate DAT files ──
const datFiles = [];
const featureDatMap = {};
for (let i = 0; i < N_DATS; i++) {
    const id      = uuid();
    const project = pick(PROJECTS);
    const feats   = FEATURES[project];
    const feature_names = [pick(feats)];
    feature_names.forEach(f => { featureDatMap[f] = featureDatMap[f] || []; featureDatMap[f].push(id); });
    const usageType = pick(USAGE_TYPES);
    const day = `2024-${String(rnd(1,12)).padStart(2,'0')}-${String(rnd(1,28)).padStart(2,'0')}`;
    datFiles.push({
        dat_id: id,
        project_name: project,
        feature_names,
        usage_type: usageType,
        recording_date: day,
        car_type: pick(CAR_TYPES),
        dat_duration: rnd(1800, 7200),   // seconds
        dat_size_gb: +(Math.random() * 8 + 0.5).toFixed(2)
    });
}

// ── Generate Drivers with intentionally skewed demographics ──
// Age distribution: Young(18-30)=30%, Middle(31-50)=50%, Older(51-70)=15%, Senior(71+)=5%
// Gender: Female=34%, Male=66%
// Height: Short(<163)=18%, Medium(163-175)=52%, Tall(>175)=30%
// Weight: realistic range 50-130 kg
// BMI: Slim(<18.5)=4%, Average(18.5-25)=52%, Overweight(25-30)=30%, Obese(30+)=14%
// Skin tone: 1=14%, 2=22%, 3=28%, 4=20%, 5=10%, 6=6%  → Light=14%(critical), Med=50%, Dark=36%

function randAge() {
    const r = Math.random();
    if (r < 0.30) return rnd(18, 30);
    if (r < 0.80) return rnd(31, 50);
    if (r < 0.95) return rnd(51, 70);
    return rnd(71, 82);
}
function randGender() { return Math.random() < 0.34 ? 'Female' : 'Male'; }
function randHeight(gender) {
    // male mean 176, female mean 163
    const mean = gender === 'Female' ? 162 : 176;
    const sd = 7;
    const n = () => { let u=0,v=0; while(u===0)u=Math.random(); while(v===0)v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
    return Math.round(mean + sd * n());
}
function randBMI() {
    const r = Math.random();
    if (r < 0.04) return +(Math.random() * 2 + 16).toFixed(1);   // Slim
    if (r < 0.56) return +(Math.random() * 6 + 18.5).toFixed(1); // Average
    if (r < 0.86) return +(Math.random() * 5 + 25).toFixed(1);   // Overweight
    return +(Math.random() * 8 + 30).toFixed(1);                  // Obese
}
function randSkinTone() {
    const r = Math.random();
    if (r < 0.14) return 1;
    if (r < 0.36) return 2;
    if (r < 0.64) return 3;
    if (r < 0.84) return 4;
    if (r < 0.94) return 5;
    return 6;
}

const N_DRIVERS = 180;
const datIds = datFiles.map(d => d.dat_id);
const drivers = [];
for (let i = 0; i < N_DRIVERS; i++) {
    const gender = randGender();
    const height = randHeight(gender);
    const bmi    = randBMI();
    const hm     = height / 100;
    const weight = Math.round(bmi * hm * hm);
    const assignedDats = [pick(datIds), pick(datIds)].filter((v,i,a)=>a.indexOf(v)===i);
    drivers.push({
        driver_id: 'drv-' + String(i+1).padStart(3,'0'),
        dat_ids: assignedDats,
        driver_gender: gender,
        driver_age: randAge(),
        driver_height: height,
        driver_weight: weight,
        driver_skin_tone: randSkinTone()
    });
}

// ── Generate CRS scenarios (subset of DAT files) ──
const crsDats = datFiles.filter(d => d.usage_type === 'Nominal').slice(0, 120);
const crsScenarios = crsDats.map(d => ({
    dat_id: d.dat_id,
    crs_type: pick(CRS_TYPES),
    crs_direction: pick(CRS_DIRS),
    crs_tilt: pick(CRS_TILTS),
    crs_canopy: pick(CRS_CANOPY),
    crs_occupancy: pick(CRS_OCC)
}));

// ── OOP scenarios ──
const oopDats = datFiles.filter(d => d.usage_type === 'OOP').slice(0, 60);
const oopScenarios = oopDats.map(d => ({
    dat_id: d.dat_id,
    passenger_pose_group: pick(OOP_POSE),
    legs_elevated: pick(OOP_LEGS),
    single_leg_side: pick(['Left', 'Right', 'None'])
}));

// ── SBM scenarios ──
const sbmDats = datFiles.filter(d => d.usage_type === 'SBM').slice(0, 40);
const sbmScenarios = sbmDats.map(d => ({
    dat_id: d.dat_id,
    driver_belt_misuse: pick(SBM_MISUSE)
}));

// ── Filter options ──
const allDates = datFiles.map(d => d.recording_date).sort();
const filter_options = {
    projects: PROJECTS,
    features_by_project: {
        'All':       FEATURES['All'],
        'GTI-Alpha': FEATURES['GTI-Alpha'],
        'GTI-Beta':  FEATURES['GTI-Beta'],
        'GTI-Gamma': FEATURES['GTI-Gamma']
    },
    usage_types: USAGE_TYPES,
    date_range: { min: allDates[0], max: allDates[allDates.length - 1] }
};

// ── Assemble ──
const output = {
    generated_at: new Date().toISOString(),
    filter_options,
    dat_files: datFiles,
    drivers,
    feature_dat_map: featureDatMap,
    scenarios: {
        crs: crsScenarios,
        oop: oopScenarios,
        sbm: sbmScenarios
    }
};

fs.writeFileSync('dashboard-data.json', JSON.stringify(output, null, 2));
console.log(`Generated dashboard-data.json: ${datFiles.length} DATs, ${drivers.length} drivers`);
