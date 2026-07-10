const { spawn } = require('child_process');
const path = require('path');

// Ensure SystemRoot and PATH are present (critical for Node child_process spawn on Windows)
const currentPath = process.env.Path || process.env.PATH || '';
const systemPath = `C:\\Windows\\System32;C:\\Windows;C:\\Windows\\System32\\wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;${currentPath}`;
const env = {
  ...process.env,
  SystemRoot: process.env.SystemRoot || 'C:\\Windows',
  Path: systemPath,
  PATH: systemPath
};

function runService(name, command, args, cwd) {
  console.log(`[${name}] Starting...`);
  const proc = spawn(command, args, {
    cwd: path.resolve(__dirname, cwd),
    shell: true,
    env
  });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`[${name} ERROR] ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`[${name}] Exited with code ${code}`);
  });

  return proc;
}

// 1. Python AI service
runService('Python AI', 'venv\\Scripts\\python', ['-m', 'app.main'], 'python-backend');

// 2. Node Backend
runService('Node Backend', 'npm', ['run', 'dev'], 'backend');

// 3. React Frontend
runService('React Frontend', 'npm', ['run', 'dev'], 'frontend');
