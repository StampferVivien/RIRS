const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Inicializacija za Jest
  testEnvironment: "jsdom", // Simulirano DOM okolje
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy", // Ignoriranje CSS datotek
  },
};

module.exports = createJestConfig(customJestConfig);
