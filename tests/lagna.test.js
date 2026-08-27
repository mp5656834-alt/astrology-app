const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function loadAstronomy(fileName) {
  const context = {
    console,
    Math,
    Date,
    Intl,
    JSON,
    Number,
    String,
    Object,
    Array,
    RegExp,
    setTimeout,
    clearTimeout,
    window: {},
    document: { addEventListener() {}, querySelectorAll() { return []; } },
    localStorage: { getItem() { return null; }, setItem() {} },
    fetch: async () => { throw new Error('network unavailable in unit tests'); }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', fileName), 'utf8'), context, { filename: fileName });
  return context.window.__PROPHECY_ASTRONOMY__;
}

const astronomy = loadAstronomy('car.js');
const jd = (date, hour, minute = 0, second = 0, offsetMinutes = 0) => {
  const [year, month, day] = date.split('-').map(Number);
  return astronomy.julianDay(year, month, day, hour - offsetMinutes / 60, minute, second);
};
const ascendant = (date, time, latitude, longitude, offsetMinutes) => {
  const [hour, minute, second = 0] = time.split(':').map(Number);
  return astronomy.calcAscendant(jd(date, hour, minute, second, offsetMinutes), longitude, latitude);
};
const separation = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// These are behavioral regression checks: the result must respond to every astronomical input.
const mumbai = ascendant('1998-05-20', '14:35:00', 19.076, 72.8777, 330);
assert.equal(astronomy.getSignIndex(mumbai), Math.floor(mumbai / 30));
assert.ok(mumbai >= 0 && mumbai < 360);
assert.ok(separation(mumbai, ascendant('1998-05-20', '14:36:00', 19.076, 72.8777, 330)) > 0.05, 'one minute must move the ascendant');
assert.ok(separation(mumbai, ascendant('1998-05-20', '18:35:00', 19.076, 72.8777, 330)) > 20, 'several hours must materially move the ascendant');
assert.ok(separation(mumbai, ascendant('1998-05-20', '14:35:00', 28.6139, 77.209, 330)) > 0.01, 'latitude must be used');
assert.ok(separation(mumbai, ascendant('1998-05-20', '14:35:00', 19.076, 72.8777, 0)) > 20, 'UTC offset must affect UT');
assert.ok(separation(mumbai, ascendant('1998-05-20', '14:35:00', 19.076, 72.8777, -240)) > 20, 'negative offsets must affect UT');
assert.ok(separation(mumbai, ascendant('1998-05-20', '14:35:00', 51.5074, -0.1278, 60)) > 0.01, 'longitude and country must be used');
assert.ok(separation(ascendant('2020-02-29', '00:01:00', 19.076, 72.8777, 330), ascendant('2020-02-29', '12:01:00', 19.076, 72.8777, 330)) > 20, 'leap-day midnight/noon must work');
assert.equal(astronomy.estimateUTCOffsetMinutes('Europe/London', '2020-01-15', '12:00'), 0);
assert.equal(astronomy.estimateUTCOffsetMinutes('Europe/London', '2020-07-15', '12:00'), 60, 'DST offset must be historical');
assert.equal(astronomy.estimateUTCOffsetMinutes('Asia/Kolkata', '1942-01-15', '12:00'), 390, 'historical Indian offset must be respected');
assert.throws(() => astronomy.calcAscendant(jd('1998-05-20', 14, 35, 0, 330), 181, 19), /valid birth coordinates/);

console.log('Lagna regression tests passed');
