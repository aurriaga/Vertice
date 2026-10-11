// Revisa la sintaxis de los <script> en línea de Vértice (sin ejecutarlos)
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(process.argv[2] || 'C:/Users/ariel/Downloads/vertice-app/vertice-app/index.html', 'utf8');
const bloques = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
let mal = 0;
bloques.forEach((js, i) => {
  try { new vm.Script(js, { filename: 'script-' + (i + 1) + '.js' }); }
  catch (e) { mal++; console.log('script ' + (i + 1) + ': ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')); }
});
console.log(bloques.length + ' scripts, ' + (mal ? mal + ' con error' : 'sintaxis correcta'));
process.exit(mal ? 1 : 0);
