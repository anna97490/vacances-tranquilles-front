module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    // FILTRER les messages console spécifiques
    client: {
      captureConsole: true,
      clearContext: false,
      // Filtrer les warnings crypto dans les tests
      args: ['--disable-console-warnings']
    },
    
    // REPORTER personnalisé pour ignorer certains warnings
    reporters: ['progress', 'coverage'],
    
    // MIDDLEWARE pour filtrer les logs
    middleware: ['filter-crypto-warnings'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      {
        'middleware:filter-crypto-warnings': ['factory', function() {
          return function(req, res, next) {
            // Filtrer les requêtes contenant des warnings crypto
            if (req.url.includes('crypto') && req.url.includes('fallback')) {
              // Supprimer ou modifier le contenu
            }
            next();
          };
        }]
      }
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    files: [
       { pattern: 'src/assets/**/*', watched: false, included: false, served: true }
    ]
  });
};