{{flutter_js}}
{{flutter_build_config}}

(function () {
  // Guard against malformed build candidates injected by Flutter web toolchain.
  try {
    if (_flutter && _flutter.buildConfig && Array.isArray(_flutter.buildConfig.builds)) {
      _flutter.buildConfig.builds = _flutter.buildConfig.builds.filter(function (b) {
        return b && typeof b === 'object' && !!b.compileTarget && !!b.mainJsPath;
      });
    }
  } catch (_) {}

  function showOverlay(message) {
    try {
      var id = 'flutter-bootstrap-debug-overlay';
      var existing = document.getElementById(id);
      if (existing) {
        existing.textContent = message;
        return;
      }

      var div = document.createElement('pre');
      div.id = id;
      div.style.position = 'fixed';
      div.style.left = '0';
      div.style.right = '0';
      div.style.bottom = '0';
      div.style.maxHeight = '45vh';
      div.style.overflow = 'auto';
      div.style.margin = '0';
      div.style.padding = '12px';
      div.style.background = 'rgba(0,0,0,0.85)';
      div.style.color = '#00FF9D';
      div.style.fontSize = '12px';
      div.style.lineHeight = '1.4';
      div.style.zIndex = '2147483647';
      div.style.whiteSpace = 'pre-wrap';
      div.textContent = message;
      document.body.appendChild(div);
    } catch (_) {}
  }

  function log(msg) {
    try { console.log('[FLUTTER_BOOT]', msg); } catch (_) {}
    showOverlay(msg);
  }

  window.addEventListener('error', function (e) {
    log('window.error: ' + (e && e.message ? e.message : String(e)));
  });

  window.addEventListener('unhandledrejection', function (e) {
    var reason = e && e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : 'unknown';
    log('unhandledrejection: ' + reason);
  });

  var bootTimer = setTimeout(function () {
    log('BOOT TIMEOUT: Flutter engine not initialized in 12s');
  }, 12000);

  try {
    log('loader.load() start');
    _flutter.loader.load({
      onEntrypointLoaded: async function (engineInitializer) {
        try {
          log('onEntrypointLoaded');
          var appRunner = await engineInitializer.initializeEngine();
          log('initializeEngine ok');
          await appRunner.runApp();
          clearTimeout(bootTimer);
          var overlay = document.getElementById('flutter-bootstrap-debug-overlay');
          if (overlay) overlay.remove();
          try { console.log('[FLUTTER_BOOT] runApp ok'); } catch (_) {}
        } catch (err) {
          var msg = err && err.stack ? err.stack : String(err);
          log('runApp/init error: ' + msg);
        }
      }
    });
  } catch (err) {
    var msg = err && err.stack ? err.stack : String(err);
    log('loader.load fatal: ' + msg);
  }
})();
