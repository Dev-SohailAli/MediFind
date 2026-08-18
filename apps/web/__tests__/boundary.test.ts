// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const webRoot = fileURLToPath(new URL('..', import.meta.url));
const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url));
const appSourcePath = fileURLToPath(new URL('../src/App.tsx', import.meta.url));
const stringsSourcePath = fileURLToPath(new URL('../src/content/strings.ts', import.meta.url));
const workerClientSourcePath = fileURLToPath(
  new URL('../src/search/searchClient.ts', import.meta.url),
);

/**
 * Every .ts/.tsx source file that ships in the app, excluding tests, the
 * icon-generator script and build output.
 */
function readAllAppSource(): string {
  return readdirSync(webRoot, { recursive: true, withFileTypes: true })
    .filter((entry) => {
      if (!entry.isFile()) return false;
      if (!/\.(ts|tsx)$/.test(entry.name)) return false;
      const fullPath = `${entry.parentPath}/${entry.name}`;
      if (fullPath.includes('__tests__')) return false;
      if (fullPath.includes('node_modules')) return false;
      if (fullPath.includes(`${webRoot}dist`)) return false;
      if (fullPath.endsWith('vite.config.ts')) return false;
      if (fullPath === workerClientSourcePath) return false;
      return true;
    })
    .map((entry) => readFileSync(`${entry.parentPath}/${entry.name}`, 'utf8'))
    .join('\n');
}

describe('web buyer-search prototype boundary', () => {
  it('keeps the local synthetic development build label defined and wired into App.tsx', () => {
    const stringsSource = readFileSync(stringsSourcePath, 'utf8');
    const appSource = readFileSync(appSourcePath, 'utf8');

    expect(stringsSource).toMatch(/local synthetic development build/i);
    expect(appSource).toContain('strings.localDevBuildLabel');
  });

  it('keeps the default app offline-safe and isolates network access to the opt-in Worker adapter', () => {
    const source = readAllAppSource();
    const forbiddenPatterns = [
      // network
      /fetch\(/,
      /XMLHttpRequest/,
      /WebSocket/,
      /http:\/\//,
      /https:\/\//,
      // provider/cloud
      /provider[- ]?sdk/i,
      /database[- ]?sdk/i,
      // permissions
      /requestPermission/i,
      /Notification\.permission/,
      /navigator\.geolocation/i,
      /navigator\.mediaDevices/i,
      // persistence/cache the app itself must never write to
      /localStorage/,
      /sessionStorage/,
      /document\.cookie/,
      /indexedDB/i,
      // analytics/telemetry
      /analytics/i,
      /amplitude/i,
      /segment\.io/i,
      /mixpanel/i,
      // out-of-scope product surfaces
      /\bnotification\b/i,
      /\bsign[- ]?in\b/i,
      /credential/i,
      /\bsecret\b/i,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(source).not.toMatch(pattern);
    }

    const workerClient = readFileSync(workerClientSourcePath, 'utf8');
    expect(workerClient).toMatch(/fetchImpl/);
    expect(workerClient).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
    expect(workerClient).not.toMatch(/requestPermission|geolocation|mediaDevices/);

    // "prescription"/"reservation" legitimately appear inside the required
    // safety copy (e.g. "A reservation is not a guarantee..."), so they are
    // not blanket-banned words. Instead, forbid the actual out-of-scope
    // capability: no code may create, submit or track a
    // reservation/prescription request.
    const forbiddenFeaturePatterns = [
      /createReservation/i,
      /submitReservation/i,
      /confirmReservation/i,
      /reservationStatus/i,
      /uploadPrescription/i,
      /submitPrescription/i,
      /prescriptionStatus/i,
      /prescriptionRequest/i,
    ];

    for (const pattern of forbiddenFeaturePatterns) {
      expect(source).not.toMatch(pattern);
    }
  });

  it('declares no dependency on the server-only Worker package', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    expect(Object.keys(allDeps)).not.toContain('@medifind/worker');
  });

  it('required safety copy strings are present verbatim', () => {
    const source = readAllAppSource();

    expect(source).toContain('Availability and price are provided by the pharmacy and may change.');
    expect(source).toContain('A reservation is not a guarantee of supply or dispensing.');
    expect(source).toContain(
      'A valid prescription may be required. The pharmacy makes the final dispensing decision.',
    );
    expect(source).toContain('MediFind does not provide medical advice.');
    expect(source).toContain('No matching medicine listed in this prototype.');
    expect(source).toContain('MediFind does not recommend substitutes.');
  });

  it('every icon referenced by the manifest is procedurally generated, not fetched or imported from a designed asset library', () => {
    const generatorSource = readFileSync(`${webRoot}scripts/generate-icons.mjs`, 'utf8');

    expect(generatorSource).toMatch(/placeholder/i);
    // The icon generator must synthesize pixels itself (flat colour via
    // zlib), never fetch a remote asset or depend on an image/logo library.
    // (The SVG's xmlns URI legitimately contains "http://" and is not a
    // fetch target, so this checks for an actual network call, not the
    // substring.)
    expect(generatorSource).not.toMatch(/fetch\(|http\.get\(|https\.get\(/);
    expect(generatorSource).not.toMatch(/require\(['"](sharp|canvas|jimp)['"]\)/);
    expect(generatorSource).not.toMatch(/from ['"](sharp|canvas|jimp)['"]/);
  });
});
