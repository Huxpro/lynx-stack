// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { describe, expect, it, vi } from 'vitest';

import { flowTolerance } from '../../plugins/lynx/flowTolerance.js';
import { runPlugin } from '../utils/run-plugin.js';

describe('flowTolerance plugin', () => {
  it('registers theme-backed utilities', () => {
    const { api } = runPlugin(flowTolerance, {
      theme: {
        flowTolerance: {
          normal: 'normal',
          infinite: 'infinite',
          4: '4px',
        },
      },
    });

    const matchUtilities = vi.mocked(api.matchUtilities);
    expect(matchUtilities).toHaveBeenCalledTimes(1);

    const [utilities, options] = matchUtilities.mock.calls[0] as [
      Record<string, (value: string) => Record<string, string>>,
      { values: Record<string, string> },
    ];

    expect(options.values).toEqual({
      normal: 'normal',
      infinite: 'infinite',
      4: '4px',
    });
    expect(utilities['flow-tolerance']?.('4px')).toEqual({
      flowTolerance: '4px',
    });
  });
});
