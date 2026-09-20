import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**', '**/.claude/**'],
    // Silences production logging from the modules under test.
    // VITEST_VERBOSE=1 restores it.
    setupFiles: ['./tests/setup.js'],
    // The two .tsx tests keep their `// @vitest-environment jsdom` pragmas.
    // environmentMatchGlobs was removed in Vitest 4 and the replacement is a
    // `projects` array — worth it for a real split, not for two files.
    coverage: {
      provider: 'v8',
      include: ['app/**', 'api/**', 'scripts/**', 'middleware.ts'],
      exclude: [
        'app/routeTree.gen.ts',
        'app/**/*.html',
        'scripts/prompts/**',
        'scripts/templates/**',
        '**/*.d.ts',
      ],
      reporter: ['text-summary', 'html'],
      // A floor, not a target. Measured 2026-09-20 on 63b3e21e: 71.79%
      // statements, 62.84% branches. The thresholds sit about two points under
      // that because the nightly rewrites untested route pages and components
      // (#432), and 100 extra statements at 0% cost about 0.7 points. A pull
      // request that deletes tests fails; a normal one does not. Raise these
      // when the measured numbers rise, never to chase a night's drift.
      // Enforced only where coverage runs: `pnpm test:coverage`, which the
      // CI test job uses. `pnpm test` (the nightly's gate) collects none.
      thresholds: {
        statements: 70,
        branches: 61,
      },
    },
  },
})
