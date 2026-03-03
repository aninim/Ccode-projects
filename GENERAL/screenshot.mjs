// screenshot.mjs — serves GENERAL/ on a local port, opens dashboard, captures screenshots
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

const MIME = {
    '.html': 'text/html',
    '.json': 'application/json',
    '.js':   'application/javascript',
    '.css':  'text/css',
};

const server = createServer((req, res) => {
    const safePath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = join(__dir, safePath);
    if (existsSync(filePath)) {
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(readFileSync(filePath));
    } else {
        res.writeHead(404);
        res.end('Not found: ' + safePath);
    }
});

await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const BASE = `http://127.0.0.1:${port}`;
console.log(`Server: ${BASE}`);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();

const pageErrors = [];
page.on('console', msg => {
    if (msg.type() === 'error') pageErrors.push('CONSOLE ERROR: ' + msg.text());
    if (msg.type() === 'warning') console.log('WARN:', msg.text());
});
page.on('pageerror', err => pageErrors.push('PAGE ERROR: ' + err.message));

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 20000 });

// Wait for dashboard-content to appear (data loaded successfully)
try {
    await page.waitForSelector('#dashboard-content', { state: 'visible', timeout: 20000 });
} catch (e) {
    await page.screenshot({ path: join(__dir, 'ss_error_state.png'), fullPage: false });
    console.log('ERROR: dashboard-content never became visible. Saved ss_error_state.png');
    const loadingText = await page.$eval('#loading', el => el.innerHTML).catch(() => '(not found)');
    console.log('Loading element:', loadingText);
    pageErrors.forEach(e => console.log(e));
    await browser.close(); server.close(); process.exit(1);
}

// Let all Plotly renders + animations settle
await page.waitForTimeout(3500);

// Helper: screenshot a named element by selector
async function shotElement(selector, filename) {
    const el = await page.$(selector);
    if (!el) { console.log(`  SKIP ${filename} — ${selector} not found`); return; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: join(__dir, filename) });
    console.log(`  ✓ ${filename}`);
}

console.log('\n── Capturing screenshots ──');

// 1. Top of page: topbar + KPI cards
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
await page.screenshot({
    path: join(__dir, 'ss_01_topbar_kpi.png'),
    clip: { x: 0, y: 0, width: 1600, height: 480 }
});
console.log('  ✓ ss_01_topbar_kpi.png');

// 2. §12.1 Subjects & Vehicle Overview — donuts row
await shotElement('.subjects-vehicle-grid:nth-of-type(2)', 'ss_02_subjects_vehicle_donuts.png');

// 3. Gender donut + needle
await shotElement('#gender-chart', 'ss_03_gender_donut.png');

// 4. Skin tone donut + needle
await shotElement('#skin-tone-chart', 'ss_04_skintone_donut.png');

// 5. Car type donut + needle
await shotElement('#car-type-chart', 'ss_05_car_type_donut.png');

// 6. §12.2 Height × Weight scatter
await shotElement('#height-weight-scatter', 'ss_06_scatter.png');

// 7. BMI histogram (zone overlay + gaussian)
await shotElement('#bmi-chart', 'ss_07_bmi_hist.png');

// 8. §12.3 Mini summary row
await shotElement('.chart-row-3', 'ss_08_mini_row.png');

// 9. Age histogram (full, with zones + gaussian)
await shotElement('#age-chart', 'ss_09_age_hist.png');

// 10. Height histogram
await shotElement('#height-chart', 'ss_10_height_hist.png');

// 11. Weight histogram
await shotElement('#weight-chart', 'ss_11_weight_hist.png');

// 12. §12.4 Feature Drill Down grid
await shotElement('.feature-drill-grid', 'ss_12_drill_grid.png');

// 13. CRS Type donut + needle
await shotElement('#crs-type-chart', 'ss_13_crs_type.png');

// 14. CRS Orientation donut + needle
await shotElement('#crs-orientation-chart', 'ss_14_crs_orient.png');

// 15. OOP + SBM
await shotElement('#oop-pose-chart', 'ss_15_oop.png');
await shotElement('#sbm-misuse-chart', 'ss_16_sbm.png');

// 17. Full page
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({
    path: join(__dir, 'ss_17_fullpage.png'),
    fullPage: true
});
console.log('  ✓ ss_17_fullpage.png');

// ── Report JS errors ──
console.log('\n── JS Error Report ──');
if (pageErrors.length === 0) {
    console.log('  No errors detected ✓');
} else {
    pageErrors.forEach(e => console.log('  ' + e));
}

// ── Animation class audit ──
console.log('\n── Animation Class Audit ──');
const animReport = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('[data-coverage-pct]').forEach(el => {
        const pct = parseFloat(el.dataset.coveragePct);
        const kpiId = el.dataset.kpiId || el.id || el.className.split(' ')[0];
        const cls = el.classList.contains('anim-critical') ? 'anim-critical'
                  : el.classList.contains('anim-warning')  ? 'anim-warning'
                  : 'none';
        results.push({ kpiId, pct: pct.toFixed(1), animClass: cls });
    });
    return results;
});
animReport.forEach(r =>
    console.log(`  [${r.kpiId}] coverage=${r.pct}% → ${r.animClass}`)
);

// ── Needle dial audit ──
const needleCount = await page.evaluate(() =>
    document.querySelectorAll('.needle-overlay').length
);
console.log(`\n── Needle Dials: ${needleCount} rendered ──`);

// ── Section header sweep ──
const headerCount = await page.evaluate(() =>
    document.querySelectorAll('.section-header-animate').length
);
console.log(`\n── Section Header Sweep: ${headerCount} headers animated ──`);

await browser.close();
server.close();
console.log('\nDone. Screenshots saved to GENERAL/');
