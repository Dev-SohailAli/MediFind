import { spawnSync } from 'node:child_process';

const result = spawnSync(
  'expo',
  ['export', '--platform', 'ios', '--platform', 'android', '--output-dir', 'dist'],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      EXPO_OFFLINE: '1',
      EXPO_NO_TELEMETRY: '1',
    },
  },
);

process.exit(result.status ?? 1);
