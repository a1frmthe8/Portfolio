document.addEventListener('DOMContentLoaded', function() {
  const terminal = document.getElementById('terminal');

  // Sequence for your scenario
  const lines = [
    { type: 'command', text: 'npm install website' },
    { type: 'output', text: 'Installing website dependencies...' },
    { type: 'output', text: '- core v1.0.0 installed.' },
    { type: 'output', text: '- style v3.2.6 installed.' },
    { type: 'output', text: '- markup v0.1.0 installed.' },
    { type: 'output', text: 'website dependencies installed.' },
    { type: 'command', text: 'npm install skill' },
    { type: 'output', text: 'Installing skill dependencies...' },
    { type: 'output', text: '- python_skill v1.0.0 installed.' },
    { type: 'output', text: '- html_skill v3.2.6 installed.' },
    { type: 'output', text: '- javascript_skill v0.1.0 installed.' },
    { type: 'output', text: 'skill dependencies installed.' },
    { type: 'prompt', text: 'Make website responsive? (y/n)' },
    { type: 'user', text: 'y', delay: 1000 },
    { type: 'prompt', text: 'Make website accessible? (y/n)' },
    { type: 'user', text: 'y', delay: 1000 },
    { type: 'output', text: 'finalizing...' },
    { type: 'output', text: 'Website complete!' }
  ];

  let line = 0;

  function createCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    return cursor;
  }

  function removeExistingCursor() {
    const existing = terminal.querySelector('.cursor');
    if (existing) existing.remove();
  }

  function randomDelay(min = 400, max = 900) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function typeLine() {
    if (line > lines.length) return;

    // If we've finished all lines, show the progress bar and stop
    if (line === lines.length) {
      removeExistingCursor();
      setTimeout(showProgressBar, randomDelay());
      return;
    }

    const current = lines[line];
    const outputLines = current.text.split('\n');
    let outputIndex = 0;

    function typeOutputLine() {
      removeExistingCursor();
      let char = 0;
      const div = document.createElement('div');
      if (current.type === 'command' || current.type === 'user') {
        div.className = 'terminal_emulator__field';
    } else if (current.type === 'output') {
        div.className = 'terminal_emulator__field output';
    } else if (current.type === 'prompt') {
        div.className = 'terminal_emulator__field prompt';
    } else {
        div.className = 'terminal_emulator__command';
    }
      terminal.appendChild(div);

      const textNode = document.createTextNode('');
      const cursor = createCursor();
      div.appendChild(textNode);
      div.appendChild(cursor);

      let initialDelay = 0;
      if (current.type === 'user' && current.delay) {
        initialDelay = current.delay;
      }

      function typeChar() {
        if (char < outputLines[outputIndex].length) {
          textNode.textContent += outputLines[outputIndex][char++];
          setTimeout(typeChar, 70 + Math.random() * 110);
        } else {
          cursor.remove();
          outputIndex++;
          if (outputIndex < outputLines.length) {
            typeOutputLine();
          } else {
            line++;
            setTimeout(typeLine, randomDelay());
          }
        }
      }

      // For output and prompt, show instantly with random delay before next line
      if (current.type === 'output' || current.type === 'prompt') {
        textNode.textContent = outputLines[outputIndex];
        cursor.remove();
        outputIndex++;
        if (outputIndex < outputLines.length) {
          typeOutputLine();
        } else {
          line++;
          setTimeout(typeLine, randomDelay());
        }
      } else if (initialDelay > 0) {
        setTimeout(typeChar, initialDelay);
      } else {
        typeChar();
      }
    }
    typeOutputLine();
  }

  // Progress bar logic
  function showProgressBar() {
    // Create the container
    const barDiv = document.createElement('div');
    barDiv.className = 'terminal_emulator__field progress';
    barDiv.style.display = 'flex';
    barDiv.style.alignItems = 'center';

    // Create the progress bar
    const progressBar = document.createElement('div');
    progressBar.style.background = '#222';
    progressBar.style.border = '1px solid #99ff99';
    progressBar.style.width = '200px';
    progressBar.style.height = '1.2em';
    progressBar.style.marginRight = '1em';
    progressBar.style.position = 'relative';

    const progressFill = document.createElement('div');
    progressFill.style.background = '#99ff99';
    progressFill.style.height = '100%';
    progressFill.style.width = '0%';
    progressFill.style.transition = 'width 0.1s linear';

    progressBar.appendChild(progressFill);

    // Create the label
    const label = document.createElement('span');
    label.textContent = 'Development skills loading...';
    label.style.color = '#99ff99';
    label.style.fontFamily = 'monospace';
    label.style.fontSize = '1em';

    barDiv.appendChild(progressBar);
    barDiv.appendChild(label);
    terminal.appendChild(barDiv);

    // Animate the progress bar
    let percent = 0;
    function fill() {
      percent += 2;
      progressFill.style.width = percent + '%';
      if (percent < 100) {
        setTimeout(fill, 40 + Math.random() * 60); // randomize fill speed a bit
      } else {
        progressFill.style.width = '100%';
        setTimeout(() => {
          // After progress bar is full, add empty line with blinking cursor
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'terminal_emulator__field';
          emptyDiv.appendChild(createCursor());
          terminal.appendChild(emptyDiv);
        }, randomDelay(600, 1200));
      }
    }
    fill();
  }

  terminal.innerHTML = '';
  typeLine();
});