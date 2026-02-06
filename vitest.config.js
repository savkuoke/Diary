import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup-vitest.js'],
    include: ['test/**/*.vitest.*', 'test/**/*.test.jsx']
  }
  ,
  coverage: {
    provider: 'c8',
    reporter: ['text', 'lcov'],
    reportsDirectory: 'coverage/',
    all: true,
    lines: 80,
    functions: 80,
    branches: 70,
    statements: 80
  }
})
