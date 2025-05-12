// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Chemin vers votre application Next.js pour charger next.config.js et .env
  dir: './',
});

// Configuration personnalisée pour Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Gestion des imports CSS/SCSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

// createJestConfig est exporté de cette façon pour s'assurer que next/jest peut charger la configuration Next.js
module.exports = createJestConfig(customJestConfig);
