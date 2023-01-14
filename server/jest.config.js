module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};