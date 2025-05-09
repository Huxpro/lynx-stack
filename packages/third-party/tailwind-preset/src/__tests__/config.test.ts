// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, test } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Lynx Tailwind Preset', () => {
  let compiledCSS = '';
  let generatedClasses = new Set<string>();
  let usedProperties = new Set<string>();

  beforeAll(() => {
    try {
      const cwd = path.resolve(__dirname, '../../');
      const configPath = path.resolve(__dirname, 'tailwind.config.ts');
      const inputPath = path.resolve(__dirname, 'styles.css');
      const outputPath = path.resolve(__dirname, 'output.css');

      // console.log('Working directory:', cwd);
      // console.log('Config path:', configPath);
      // console.log('Input path:', inputPath);
      // console.log('Output path:', outputPath);

      // Use Tailwind CLI to build CSS
      execSync(
        `npx tailwindcss -i ${inputPath} -o ${outputPath} -c ${configPath}`,
        {
          cwd,
        },
      );

      // Read the generated CSS
      compiledCSS = fs.readFileSync(outputPath, 'utf-8');
      console.log('Generated CSS length:', compiledCSS.length);

      // Extract classes and properties
      generatedClasses = extractClassesFromCSS(compiledCSS);
      usedProperties = extractPropertiesFromCSS(compiledCSS);

      // Cleanup only if file exists
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch (error) {
      console.error('Failed to generate CSS:', error);
      throw error;
    }
  });

  describe('CSS Properties Coverage', () => {
    test('each supported CSS property value has a corresponding Tailwind utility', () => {
      // For each supported CSS property and value, verify its utility class exists
      for (
        const [property, valueMap] of Object.entries(
          cssPropertyValueToTailwindUtility,
        )
      ) {
        for (const [value, utility] of Object.entries(valueMap)) {
          expect(compiledCSS).toContain(`.${utility}`);
        }
      }
    });

    test('no unsupported CSS properties have Tailwind utilities', () => {
      // Get all supported CSS properties from @lynx-js/types
      const allowedProperties = [
        ...supportedProperties,
        ...allowedUnsupportedProperties,
      ];

      // Check that all used properties are supported
      for (const property of usedProperties) {
        expect(allowedProperties).toContain(property);
      }
    });
  });
});

// Helper function to convert kebab-case to camelCase
function kebabToCamel(str: string): string {
  return str.replace(
    /-([a-z])/g,
    (_: string, letter: string) => letter.toUpperCase(),
  );
}

// Helper function to extract CSS property names from generated utilities
function extractPropertiesFromCSS(css: string): Set<string> {
  const properties = new Set<string>();
  const propertyRegex = /([a-z-]+):/gi;
  let match;

  while ((match = propertyRegex.exec(css)) !== null) {
    if (match[1] && !match[1].startsWith('--tw-')) {
      properties.add(kebabToCamel(match[1]));
    }
  }

  return properties;
}

// Helper function to extract class names from CSS
function extractClassesFromCSS(css: string): Set<string> {
  const classes = new Set<string>();
  const classRegex = /\.([\w-]+)/g;
  let match;

  while ((match = classRegex.exec(css)) !== null) {
    if (match[1]) {
      classes.add(match[1]);
    }
  }

  return classes;
}

// Helper to get property names from CSSProperties type
const supportedProperties = [
  'position',
  'boxSizing',
  'display',
  'overflow',
  'whiteSpace',
  'textAlign',
  'textOverflow',
  'fontWeight',
  'flexDirection',
  'flexWrap',
  'alignContent',
  'alignItems',
  'justifyContent',
  'fontStyle',
  'transform',
  'animationTimingFunction',
  'borderStyle',
  'transformOrigin',
  'linearOrientation',
  'linearGravity',
  'linearLayoutGravity',
  'layoutAnimationCreateTimingFunction',
  'layoutAnimationCreateProperty',
  'layoutAnimationDeleteTimingFunction',
  'layoutAnimationDeleteProperty',
  'layoutAnimationUpdateTimingFunction',
  'textDecoration',
  'visibility',
  'transitionProperty',
  'transitionTimingFunction',
  'borderLeftStyle',
  'borderRightStyle',
  'borderTopStyle',
  'borderBottomStyle',
  'overflowX',
  'overflowY',
  'wordBreak',
  'outlineStyle',
  'verticalAlign',
  'direction',
  'relativeCenter',
  'linearCrossGravity',
  'listMainAxisGap',
];

const allowedUnsupportedProperties = [
  'overflowWrap',
];

// Mapping of CSS properties and their valid values to Tailwind utilities
const cssPropertyValueToTailwindUtility: Record<
  string,
  Record<string, string>
> = {
  // Layout
  position: {
    absolute: 'absolute',
    relative: 'relative',
    fixed: 'fixed',
    sticky: 'sticky',
  },
  display: {
    none: 'hidden',
    flex: 'flex',
    grid: 'grid',
    block: 'block',
  },
  boxSizing: {
    'border-box': 'box-border',
    'content-box': 'box-content',
  },
  overflow: {
    hidden: 'overflow-hidden',
    visible: 'overflow-visible',
  },
  overflowX: {
    hidden: 'overflow-x-hidden',
    visible: 'overflow-x-visible',
  },
  overflowY: {
    hidden: 'overflow-y-hidden',
    visible: 'overflow-y-visible',
  },

  // Flex box
  flexDirection: {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  },
  flexWrap: {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  },
  alignContent: {
    'flex-start': 'content-start',
    'flex-end': 'content-end',
    center: 'content-center',
    stretch: 'content-stretch',
    'space-between': 'content-between',
    'space-around': 'content-around',
    start: 'content-start',
    end: 'content-end',
  },
  justifyContent: {
    'flex-start': 'justify-start',
    center: 'justify-center',
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
    stretch: 'justify-stretch',
    start: 'justify-start',
    end: 'justify-end',
  },
  alignItems: {
    'flex-start': 'items-start',
    center: 'items-center',
    'flex-end': 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  },

  // Typography
  textAlign: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    start: 'text-start',
    end: 'text-end',
  },
  fontWeight: {
    normal: 'font-normal',
    bold: 'font-bold',
  },
  fontStyle: {
    normal: 'not-italic',
    italic: 'italic',
  },
  textDecoration: {
    none: 'no-underline',
    underline: 'underline',
    'line-through': 'line-through',
  },
  whiteSpace: {
    normal: 'whitespace-normal',
    nowrap: 'whitespace-nowrap',
  },
  wordBreak: {
    normal: 'break-normal',
    'break-all': 'break-all',
    'keep-all': 'break-keep',
  },
  textOverflow: {
    clip: 'truncate',
    ellipsis: 'truncate',
  },

  // Border
  borderStyle: {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
    none: 'border-none',
  },

  // Visibility
  visibility: {
    visible: 'visible',
    hidden: 'invisible',
    none: 'hidden',
    collapse: 'collapse',
  },
};
