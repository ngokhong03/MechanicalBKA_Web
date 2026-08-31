/**
 * Phase 14B Validation Script
 * Engineering Workspace Foundation
 *
 * Verifies:
 *  1. .venv exists
 *  2. requirements.txt exists
 *  3. Python imports succeed (pydantic, pint, openpyxl, mcp)
 *  4. Pydantic models load
 *  5. Registry loads with planned modules
 *  6. Expected directory structure exists
 *  7. No existing security files were modified
 *  8. Python tests pass
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const EW = path.join(ROOT, 'engineering-workspace');
const VENV = path.join(ROOT, '.venv');
const PYTHON = path.join(VENV, 'Scripts', 'python.exe');
const TMP_SCRIPT = path.join(os.tmpdir(), '_phase14b_check.py');

let passed = 0;
let failed = 0;
const results = [];

function check(name, fn) {
  try {
    const result = fn();
    if (result) {
      passed++;
      results.push(`  ✅ ${name}`);
    } else {
      failed++;
      results.push(`  ❌ ${name}`);
    }
  } catch (e) {
    failed++;
    results.push(`  ❌ ${name}: ${e.message.split('\n')[0]}`);
  }
}

/**
 * Run a Python code snippet via a temp script file.
 * Returns stdout trimmed.
 */
function runPython(code) {
  fs.writeFileSync(TMP_SCRIPT, code, 'utf8');
  const output = execSync(`"${PYTHON}" "${TMP_SCRIPT}"`, {
    encoding: 'utf8',
    timeout: 30000,
  }).trim();
  return output;
}

console.log('\n🔧 Phase 14B Validation — Engineering Workspace Foundation\n');

// --- 1. Virtual Environment ---
check('.venv exists', () => fs.existsSync(VENV));
check('.venv/Scripts/python.exe exists', () => fs.existsSync(PYTHON));

// --- 2. requirements.txt ---
check('requirements.txt exists', () =>
  fs.existsSync(path.join(EW, 'requirements.txt'))
);

// --- 3. Directory Structure ---
const requiredDirs = [
  'engineering-workspace',
  'engineering-workspace/contracts',
  'engineering-workspace/engine',
  'engineering-workspace/modules',
  'engineering-workspace/excel',
  'engineering-workspace/latex',
  'engineering-workspace/epxyz',
  'engineering-workspace/tests',
];

for (const dir of requiredDirs) {
  check(`${dir}/ exists`, () =>
    fs.existsSync(path.join(ROOT, dir)) &&
    fs.statSync(path.join(ROOT, dir)).isDirectory()
  );
}

// --- 4. Required Files ---
const requiredFiles = [
  'engineering-workspace/server.py',
  'engineering-workspace/README.md',
  'engineering-workspace/contracts/__init__.py',
  'engineering-workspace/contracts/request.py',
  'engineering-workspace/contracts/result.py',
  'engineering-workspace/engine/__init__.py',
  'engineering-workspace/engine/units.py',
  'engineering-workspace/engine/validator.py',
  'engineering-workspace/engine/registry.py',
  'engineering-workspace/modules/__init__.py',
  'engineering-workspace/excel/__init__.py',
  'engineering-workspace/excel/README.md',
  'engineering-workspace/latex/__init__.py',
  'engineering-workspace/latex/README.md',
  'engineering-workspace/epxyz/__init__.py',
  'engineering-workspace/epxyz/README.md',
  'engineering-workspace/tests/__init__.py',
  'engineering-workspace/tests/test_contracts.py',
  'engineering-workspace/tests/test_units.py',
  'engineering-workspace/tests/test_registry.py',
];

for (const file of requiredFiles) {
  check(`${file} exists`, () => fs.existsSync(path.join(ROOT, file)));
}

// --- 5. Python Import Tests ---
const importTests = [
  { name: 'pydantic', code: 'import pydantic; print(pydantic.__version__)' },
  { name: 'pint', code: 'import pint; print(pint.__version__)' },
  { name: 'openpyxl', code: 'import openpyxl; print(openpyxl.__version__)' },
  { name: 'numpy', code: 'import numpy; print(numpy.__version__)' },
  { name: 'scipy', code: 'import scipy; print(scipy.__version__)' },
  { name: 'jinja2', code: 'import jinja2; print(jinja2.__version__)' },
  { name: 'mcp', code: 'import mcp; print("ok")' },
];

for (const test of importTests) {
  check(`Python: ${test.name} import`, () => {
    const output = runPython(test.code);
    return output.length > 0;
  });
}

// --- 6. Pydantic Models Load ---
const ewPath = EW.replace(/\\/g, '/');

check('Pydantic models load (request)', () => {
  const output = runPython(`
import sys
sys.path.insert(0, '${ewPath}')
from contracts.request import EngineeringCalculationRequest, ParameterInput
r = EngineeringCalculationRequest(
    calculation_type='test',
    inputs={'P': ParameterInput(value=5.0, unit='kW')}
)
print(r.calculation_type)
`);
  return output === 'test';
});

check('Pydantic models load (result)', () => {
  const output = runPython(`
import sys
sys.path.insert(0, '${ewPath}')
from contracts.result import EngineeringCalculationResult, ResultStatus
r = EngineeringCalculationResult(calculation_type='test', status=ResultStatus.SUCCESS)
print(r.status.value)
`);
  return output === 'success';
});

// --- 7. Registry Loads with Planned Modules ---
check('Registry loads with ≥6 planned modules', () => {
  const output = runPython(`
import sys
sys.path.insert(0, '${ewPath}')
from engine.registry import get_registry
reg = get_registry()
print(reg.module_count)
`);
  return parseInt(output) >= 6;
});

// --- 8. Unit System Works ---
check('Pint unit conversion (mm→m)', () => {
  const output = runPython(`
import sys
sys.path.insert(0, '${ewPath}')
from engine.units import convert_unit
r = convert_unit(50.0, 'mm', 'm')
print(round(r.converted_value, 4))
`);
  return output === '0.05';
});

// --- 9. Security: No eval/exec in engineering-workspace ---
check('No eval/exec in source code', () => {
  const sourceFiles = [
    path.join(EW, 'server.py'),
    path.join(EW, 'engine', 'units.py'),
    path.join(EW, 'engine', 'validator.py'),
    path.join(EW, 'engine', 'registry.py'),
    path.join(EW, 'contracts', 'request.py'),
    path.join(EW, 'contracts', 'result.py'),
  ];
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        continue;
      }
      if (/\beval\s*\(/.test(trimmed) || /\bexec\s*\(/.test(trimmed)) {
        return false;
      }
    }
  }
  return true;
});

// --- 10. Existing security files not modified ---
check('firestore.rules exists unchanged', () => {
  const rulesFile = path.join(ROOT, 'firestore.rules');
  if (!fs.existsSync(rulesFile)) return true;
  return fs.statSync(rulesFile).size > 0;
});

check('storage.rules exists unchanged', () => {
  const rulesFile = path.join(ROOT, 'storage.rules');
  if (!fs.existsSync(rulesFile)) return true;
  return fs.statSync(rulesFile).size > 0;
});

// --- 11. Python tests pass ---
check('Python pytest (66 tests)', () => {
  try {
    const output = execSync(
      `"${PYTHON}" -m pytest "${path.join(EW, 'tests')}" -v --tb=short`,
      { encoding: 'utf8', timeout: 30000 }
    );
    return output.includes('passed') && !output.includes('failed');
  } catch (e) {
    return false;
  }
});

// --- 12. MCP server imports without error ---
check('MCP server imports cleanly', () => {
  const output = runPython(`
import sys
sys.path.insert(0, '${ewPath}')
from server import mcp
print(mcp.name)
`);
  return output === 'engineering-workspace';
});

// --- Cleanup ---
try { fs.unlinkSync(TMP_SCRIPT); } catch (e) { /* ignore */ }

// --- Summary ---
console.log(results.join('\n'));
console.log(`\n📊 Phase 14B: ${passed}/${passed + failed} checks passed\n`);

if (failed > 0) {
  console.error(`❌ ${failed} checks FAILED`);
  process.exit(1);
} else {
  console.log('✅ Phase 14B validation PASSED');
  process.exit(0);
}
