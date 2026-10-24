import { describe, expect, it } from 'vitest';
import { isIOSDevice, isRunningStandalone } from './detect.ts';

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPAD_DESKTOP_MODE =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const ANDROID =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';

describe('isIOSDevice', () => {
  it('CA01.2 · reconhece iPhone e iPad', () => {
    expect(isIOSDevice({ userAgent: IPHONE, maxTouchPoints: 5 })).toBe(true);
    expect(isIOSDevice({ userAgent: IPHONE.replace('iPhone', 'iPad'), maxTouchPoints: 5 })).toBe(
      true,
    );
  });

  it('CA01.2 · reconhece iPad em modo desktop (UA de Mac com toque)', () => {
    expect(isIOSDevice({ userAgent: IPAD_DESKTOP_MODE, maxTouchPoints: 5 })).toBe(true);
    expect(isIOSDevice({ userAgent: IPAD_DESKTOP_MODE, maxTouchPoints: 0 })).toBe(false);
  });

  it('CA01.2 · Android e desktop não são iOS', () => {
    expect(isIOSDevice({ userAgent: ANDROID, maxTouchPoints: 5 })).toBe(false);
  });
});

describe('isRunningStandalone', () => {
  it('CA01.2 · app instalado: display-mode standalone ou navigator.standalone (iOS)', () => {
    expect(isRunningStandalone({ displayModeStandalone: true })).toBe(true);
    expect(isRunningStandalone({ displayModeStandalone: false, iosStandalone: true })).toBe(true);
    expect(isRunningStandalone({ displayModeStandalone: false })).toBe(false);
  });
});
