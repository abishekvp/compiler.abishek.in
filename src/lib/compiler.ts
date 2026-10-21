export interface CompilerBundleOptions {
  html: string;
  css: string;
  js: string;
  cdnUrls: string[];
}

export function generateCompleteHtml({
  html,
  css,
  js,
  cdnUrls
}: CompilerBundleOptions): string {
  let cssLinks = '';
  let jsScripts = '';

  cdnUrls.forEach((url) => {
    if (url.endsWith('.css') || url.includes('/css') || url.includes('bootstrap.min.css') || url.includes('fontawesome')) {
      cssLinks += `<link rel="stylesheet" href="${url}">\n  `;
    } else {
      jsScripts += `<script src="${url}"><\/script>\n  `;
    }
  });

  const consoleBridge = `
  <script>
    (function() {
      function send(type, args) {
        try {
          window.parent.postMessage({
            source: 'compiler-sandbox-console',
            type: type,
            args: Array.from(args).map(function(a) {
              if (typeof a === 'function') return a.toString();
              if (a instanceof Error) return a.message + '\\n' + a.stack;
              if (typeof a === 'object' && a !== null) {
                try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
              }
              return a;
            })
          }, '*');
        } catch(e) {}
      }
      var origLog = console.log, origWarn = console.warn, origError = console.error, origInfo = console.info;
      console.log = function() { send('log', arguments); if(origLog) origLog.apply(console, arguments); };
      console.warn = function() { send('warn', arguments); if(origWarn) origWarn.apply(console, arguments); };
      console.error = function() { send('error', arguments); if(origError) origError.apply(console, arguments); };
      console.info = function() { send('info', arguments); if(origInfo) origInfo.apply(console, arguments); };

      window.onerror = function(msg, url, line, col, err) {
        send('error', [msg + ' (Line ' + line + ':' + col + ')']);
        return false;
      };
    })();
  <\/script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cssLinks}
  <style>
    ${css}
  </style>
  ${consoleBridge}
</head>
<body>
  ${html}
  ${jsScripts}
  <script>
    try {
      ${js}
    } catch(err) {
      console.error(err);
    }
  <\/script>
</body>
</html>`;
}

export function downloadHtmlFile(content: string, filename = 'index.html') {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
