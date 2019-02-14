const config = {
    verbose: true,
    notifyMode: 'success-change',
    notify: true,
    clearMocks: true,
    resetMocks: true,
    resetModules: true,
    testMatch: ['tests/**.js'],
    transformIgnorePatterns: ['node_modules/(?!(underscore-es)/)'],
    bail: true
};