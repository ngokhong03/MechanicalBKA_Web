import https from 'https';

const routes = [
  '/',
  '/projects',
  '/store',
  '/courses',
  '/videos',
  '/search',
  '/cart',
  '/checkout',
  '/admin',
  '/account/library'
];

const BASE = 'https://mechanicalbka-web.vercel.app';

function checkRoute(path) {
  return new Promise((resolve) => {
    const url = BASE + path;
    https.get(url, (res) => {
      resolve({ path, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ path, status: 'ERROR', error: err.message });
    });
  });
}

async function main() {
  console.log('=== ROUTE VERIFICATION ===');
  console.log('Production URL:', BASE);
  console.log('');
  
  for (const route of routes) {
    const result = await checkRoute(route);
    const icon = result.status === 200 ? '✅' : '❌';
    console.log(`${icon} ${result.path} → HTTP ${result.status}`);
  }
  console.log('');
  console.log('=== DONE ===');
}

main();
