import { spawn } from 'child_process';

function npmStart(prefix, directory) {
  const process = spawn('npm', ['start'], { cwd: directory, shell: true });

  process.stdout.on('data', data => {
      console.log(`${prefix}: ${data}`);
  });

  process.stderr.on('data', data => {
      console.error(`${prefix}: ${data}`);
  });

  process.on('close', code => {
      console.log(`child process exited with code ${code}`);
  });

  process.on('error', err => {
      console.error(`Failed to start subprocess in ${directory}. Error:`, err);
  });
}

function tsNodeStart(prefix, directory) {
    const process = spawn('npx tsx src/index.ts', { cwd: directory, shell: true });

    process.stdout.on('data', data => {
        console.log(`${prefix}: ${data}`);
    });
  
    process.stderr.on('data', data => {
        console.error(`${prefix}: ${data}`);
    });
  
    process.on('close', code => {
        console.log(`child process exited with code ${code}`);
    });
  
    process.on('error', err => {
        console.error(`Failed to start subprocess in ${directory}. Error:`, err);
    });
}

npmStart('CLIENT','./client');
tsNodeStart('SERVER','./server');