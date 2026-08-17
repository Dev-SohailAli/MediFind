import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const mobileRoot = fileURLToPath(new URL('..', import.meta.url));
const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url));
const appJsonPath = fileURLToPath(new URL('../app.json', import.meta.url));
const appSourcePath = fileURLToPath(new URL('../App.tsx', import.meta.url));
const stringsSourcePath = fileURLToPath(new URL('../src/content/strings.ts', import.meta.url));

/**
 * Every .ts/.tsx source file that ships in the app, excluding tests and the
 * Vitest-only react-native shim (test-support/ is never bundled by
 * Expo/Metro; it exists only to let Vitest render RN primitives without
 * parsing react-native's Flow-typed source).
 */
function readAllAppSource(): string {
  return readdirSync(mobileRoot, { recursive: true, withFileTypes: true })
    .filter((entry) => {
      if (!entry.isFile()) return false;
      if (!/\.(ts|tsx)$/.test(entry.name)) return false;
      const fullPath = `${entry.parentPath}/${entry.name}`;
      if (fullPath.includes('__tests__')) return false;
      if (fullPath.includes('node_modules')) return false;
      if (fullPath.includes('test-support')) return false;
      if (fullPath.includes(`${mobileRoot}dist`) || fullPath.includes(`${mobileRoot}.expo`))
        return false;
      return true;
    })
    .map((entry) => readFileSync(`${entry.parentPath}/${entry.name}`, 'utf8'))
    .join('\n');
}

describe('mobile Task 2 prototype boundary', () => {
  it('keeps the local synthetic development build label defined and wired into App.tsx', () => {
    const stringsSource = readFileSync(stringsSourcePath, 'utf8');
    const appSource = readFileSync(appSourcePath, 'utf8');

    expect(stringsSource).toMatch(/local synthetic development build/i);
    expect(appSource).toContain('strings.localDevBuildLabel');
  });

  it('requests no platform permission, persistence, analytics or network capability anywhere in app source', () => {
    const source = readAllAppSource();
    const forbiddenPatterns = [
      // network
      /fetch\(/,
      /XMLHttpRequest/,
      /WebSocket/,
      /http:\/\//,
      /https:\/\//,
      // provider/cloud
      /firebase/i,
      /firestore/i,
      // permissions
      /requestPermission/i,
      /Permissions\./,
      /PermissionsAndroid/,
      /expo-location/i,
      /expo-camera/i,
      /expo-notifications/i,
      /expo-media-library/i,
      // persistence/cache
      /AsyncStorage/,
      /SecureStore/,
      /expo-sqlite/i,
      // analytics/telemetry
      /analytics/i,
      /amplitude/i,
      /segment\.io/i,
      /mixpanel/i,
      // out-of-scope product surfaces
      /notification/i,
      /\bsign[- ]?in\b/i,
      /credential/i,
      /\bsecret\b/i,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(source).not.toMatch(pattern);
    }

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

  it('declares no dependency on the api package', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    expect(Object.keys(allDeps)).not.toContain('@medifind/worker');
  });

  it('keeps the test-only renderer as a devDependency, never a runtime dependency', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    expect(pkg.dependencies ?? {}).not.toHaveProperty('react-test-renderer');
  });

  it('does not declare a custom icon, splash or public-release configuration', () => {
    const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8')) as {
      expo: Record<string, unknown>;
    };

    expect(appJson.expo.icon).toBeUndefined();
    expect(appJson.expo.splash).toBeUndefined();
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
});
