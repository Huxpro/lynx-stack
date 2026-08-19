// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { describe, expect, it, vi } from 'vitest';

import { display } from '../../plugins/lynx/display.js';
import { runPlugin } from '../utils/run-plugin.js';

describe('display plugin', () => {
  it('registers grid-lanes', () => {
    const { api } = runPlugin(display);
    expect(vi.mocked(api.addUtilities)).toHaveBeenCalledWith(
      expect.objectContaining({
        '.grid-lanes': { display: 'grid-lanes' },
      }),
    );
  });
});
