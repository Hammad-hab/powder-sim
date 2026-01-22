import { Box } from "./js";
import { rgba } from "./js/utils";

const TOPBAR = document.querySelector(".topbar");
const buttons = {};
let logPanel = null;
let statsPanel = null;
let controlPanel = null;
let logEntries = [];
let previousParticleCount = 0;
let previousFPS = 0;

function createStatsPanel() {
  const panel = document.createElement('div');
  const styles = createStyles({
    position: 'fixed',
    left: '20px',
    top: '100px',
    'min-width': '200px',
    background: 'rgba(10, 10, 15, 0.9)',
    border: '2px solid rgba(100, 200, 255, 0.3)',
    'border-radius': '16px',
    padding: '20px',
    'font-family': 'monospace',
    color: '#e0e0e0',
    'box-shadow': '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    'backdrop-filter': 'blur(12px)',
    'z-index': '900'
  });
  panel.style.cssText = styles;
  
  panel.innerHTML = `
    <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">Performance</div>
    <div id="fps-display" style="font-size: 42px; font-weight: bold; margin-bottom: 8px; line-height: 1;"></div>
    <div id="particle-display" style="font-size: 18px; margin-bottom: 4px;"></div>
    <div id="particle-trend" style="font-size: 11px; color: rgba(255,255,255,0.6);"></div>
  `;
  
  document.body.appendChild(panel);
  return panel;
}

function createControlPanel() {
  const panel = document.createElement('div');
  const styles = createStyles({
    position: 'fixed',
    left: '20px',
    bottom: '20px',
    'min-width': '200px',
    background: 'rgba(10, 10, 15, 0.9)',
    border: '2px solid rgba(150, 100, 255, 0.3)',
    'border-radius': '16px',
    padding: '20px',
    'font-family': 'monospace',
    color: '#e0e0e0',
    'box-shadow': '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    'backdrop-filter': 'blur(12px)',
    'z-index': '900'
  });
  panel.style.cssText = styles;
  
  const title = document.createElement('div');
  title.textContent = 'Controls';
  const titleStyles = createStyles({
    'font-size': '11px',
    color: 'rgba(255,255,255,0.5)',
    'margin-bottom': '16px',
    'text-transform': 'uppercase',
    'letter-spacing': '1px'
  });
  title.style.cssText = titleStyles;
  
  const clearBtn = createControlButton('Clear Canvas', 'rgba(255, 80, 80, 0.8)');
  const pauseBtn = createControlButton('Pause/Resume', 'rgba(100, 150, 255, 0.8)');
  
  clearBtn.addEventListener('click', () => {
    if (window.renderer) {
      window.renderer.clear();
      addLogEntry('System', 'rgba(255,255,255,0.8)', 'Canvas cleared');
    }
  });
  
  pauseBtn.addEventListener('click', () => {
    const pausedButton = document.querySelector('button#paused');
    if (pausedButton) pausedButton.click();
  });
  
  panel.appendChild(title);
  panel.appendChild(clearBtn);
  panel.appendChild(pauseBtn);
  
  document.body.appendChild(panel);
  return panel;
}

function createControlButton(text, color) {
  const btn = document.createElement('button');
  const styles = createStyles({
    width: '100%',
    padding: '12px',
    margin: '6px 0',
    background: color,
    border: 'none',
    'border-radius': '8px',
    color: 'white',
    'font-family': 'monospace',
    'font-size': '13px',
    'font-weight': 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    'box-shadow': '0 2px 8px rgba(0,0,0,0.3)'
  });
  btn.style.cssText = styles;
  btn.textContent = text;
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  });
  
  return btn;
}

function createLogPanel() {
  const panel = document.createElement('div');
  const styles = createStyles({
    position: 'fixed',
    right: '20px',
    top: '100px',
    width: '320px',
    'max-height': '500px',
    background: 'rgba(10, 10, 15, 0.9)',
    border: '2px solid rgba(255, 200, 100, 0.3)',
    'border-radius': '16px',
    padding: '20px',
    'font-family': 'monospace',
    'font-size': '13px',
    color: '#e0e0e0',
    'overflow-y': 'auto',
    'box-shadow': '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    'backdrop-filter': 'blur(12px)',
    'z-index': '900'
  });
  panel.style.cssText = styles;
  
  const header = document.createElement('div');
  header.style.cssText = createStyles({
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
    'margin-bottom': '16px',
    'padding-bottom': '12px',
    'border-bottom': '1px solid rgba(255, 255, 255, 0.15)'
  });
  
  const title = document.createElement('div');
  title.textContent = 'Activity Log';
  const titleStyles = createStyles({
    'font-weight': 'bold',
    color: '#fff',
    'font-size': '14px',
    'text-transform': 'uppercase',
    'letter-spacing': '1px'
  });
  title.style.cssText = titleStyles;
  
  const badge = document.createElement('div');
  badge.id = 'log-badge';
  badge.textContent = '0';
  badge.style.cssText = createStyles({
    background: 'rgba(255, 200, 100, 0.3)',
    color: '#fff',
    padding: '4px 10px',
    'border-radius': '12px',
    'font-size': '11px',
    'font-weight': 'bold'
  });
  
  header.appendChild(title);
  header.appendChild(badge);
  
  const logContainer = document.createElement('div');
  logContainer.id = 'log-container';
  
  panel.appendChild(header);
  panel.appendChild(logContainer);
  document.body.appendChild(panel);
  
  return panel;
}

function addLogEntry(particleName, color, action = 'Selected') {
  const timestamp = new Date().toLocaleTimeString();
  logEntries.unshift({ name: particleName, color, timestamp, action });
  
  if (logEntries.length > 15) {
    logEntries.pop();
  }
  
  updateLogDisplay();
}

function updateLogDisplay() {
  const container = document.getElementById('log-container');
  const badge = document.getElementById('log-badge');
  if (!container) return;
  
  if (badge) {
    badge.textContent = logEntries.length;
  }
  
  container.innerHTML = '';
  
  logEntries.forEach((entry, index) => {
    const logItem = document.createElement('div');
    const itemStyles = createStyles({
      padding: '10px 12px',
      margin: '8px 0',
      'border-radius': '8px',
      background: index === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${index === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
      transition: 'all 0.3s ease',
      opacity: (1 - index * 0.05).toString(),
      transform: index === 0 ? 'scale(1)' : 'scale(0.98)'
    });
    logItem.style.cssText = itemStyles;
    
    const header = document.createElement('div');
    header.style.cssText = createStyles({
      display: 'flex',
      'align-items': 'center',
      'margin-bottom': '6px'
    });
    
    const colorDot = document.createElement('span');
    const dotStyles = createStyles({
      display: 'inline-block',
      width: '12px',
      height: '12px',
      'border-radius': '50%',
      background: entry.color,
      'margin-right': '10px',
      'box-shadow': `0 0 8px ${entry.color}`,
      flex: 'none'
    });
    colorDot.style.cssText = dotStyles;
    
    const nameAction = document.createElement('div');
    nameAction.style.cssText = createStyles({
      flex: '1'
    });
    
    const name = document.createElement('span');
    name.textContent = entry.name;
    name.style.cssText = createStyles({
      'font-weight': 'bold',
      color: '#fff'
    });
    
    const action = document.createElement('span');
    action.textContent = ` • ${entry.action}`;
    action.style.cssText = createStyles({
      color: 'rgba(255, 255, 255, 0.6)',
      'font-size': '11px'
    });
    
    nameAction.appendChild(name);
    nameAction.appendChild(action);
    
    const time = document.createElement('div');
    time.textContent = entry.timestamp;
    const timeStyles = createStyles({
      'font-size': '10px',
      color: 'rgba(255, 255, 255, 0.4)',
      'margin-top': '2px'
    });
    time.style.cssText = timeStyles;
    
    header.appendChild(colorDot);
    header.appendChild(nameAction);
    
    logItem.appendChild(header);
    logItem.appendChild(time);
    container.appendChild(logItem);
  });
}

function updateStats(fps, particleCount) {
  const fpsDisplay = document.getElementById('fps-display');
  const particleDisplay = document.getElementById('particle-display');
  const trendDisplay = document.getElementById('particle-trend');
  
  if (fpsDisplay) {
    const maxFPS = 60;
    const clampedFPS = Math.min(fps, maxFPS);
    const hueFPS = (clampedFPS / maxFPS) * 120;
    fpsDisplay.textContent = `${Math.round(fps)} FPS`;
    fpsDisplay.style.color = `hsl(${hueFPS}, 85%, 60%)`;
    
    const fpsDelta = fps - previousFPS;
    const arrow = fpsDelta > 1 ? '↗' : fpsDelta < -1 ? '↘' : '→';
    const arrowColor = fpsDelta > 0 ? 'hsl(120, 70%, 60%)' : fpsDelta < 0 ? 'hsl(0, 70%, 60%)' : 'hsl(60, 70%, 60%)';
    fpsDisplay.innerHTML = `${Math.round(fps)} <span style="color: ${arrowColor}; font-size: 28px;">${arrow}</span>`;
    previousFPS = fps;
  }
  
  if (particleDisplay) {
    particleDisplay.textContent = `${particleCount.toLocaleString()} particles`;
  }
  
  if (trendDisplay) {
    const delta = particleCount - previousParticleCount;
    if (delta > 0) {
      trendDisplay.textContent = `+${delta} since last update`;
      trendDisplay.style.color = 'rgba(100, 255, 150, 0.8)';
    } else if (delta < 0) {
      trendDisplay.textContent = `${delta} since last update`;
      trendDisplay.style.color = 'rgba(255, 100, 100, 0.8)';
    } else {
      trendDisplay.textContent = 'No change';
      trendDisplay.style.color = 'rgba(255, 255, 100, 0.8)';
    }
    previousParticleCount = particleCount;
  }
}

function renderUI() {
  for (const button in buttons) {
    TOPBAR.appendChild(buttons[button]);
  }
  
  if (!logPanel) {
    logPanel = createLogPanel();
  }
  
  if (!statsPanel) {
    statsPanel = createStatsPanel();
  }
  
  if (!controlPanel) {
    controlPanel = createControlPanel();
  }
}

function createStyles(styles) {
  return Object.entries(styles)
    .filter(([key]) => CSS.supports(key, "initial"))
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

function renderParticleBox(particle, renderer) {
  const color = Array.isArray(particle.color) ? rgba(particle.color) : rgba(particle.color());
  const name = particle.name;
  const element = document.createElement('div');
  
  const styles = createStyles({
    background: `linear-gradient(135deg, ${color}ee, ${color}cc)`,
    padding: '10px 18px',
    margin: '4px',
    cursor: 'pointer',
    'border-radius': '8px',
    transition: 'all 0.25s ease',
    'font-family': 'system-ui, -apple-system, sans-serif',
    'font-weight': '700',
    'font-size': '13px',
    color: '#ffffff',
    border: '2px solid rgba(255,255,255,0.2)',
    'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    'text-shadow': '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
    'letter-spacing': '0.5px'
  });
  
  element.style.cssText = styles;
  element.textContent = name;
  
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'translateY(-3px) scale(1.05)';
    element.style.boxShadow = `0 6px 20px ${color}80, inset 0 1px 0 rgba(255,255,255,0.3)`;
    element.style.borderColor = color;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translateY(0) scale(1)';
    element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)';
    element.style.borderColor = 'rgba(255,255,255,0.1)';
  });
  
  element.addEventListener('click', () => {
    addLogEntry(name, color, 'Selected');
    
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
    
    Object.values(buttons).forEach(btn => {
      btn.style.opacity = '0.6';
    });
    element.style.opacity = '1';
    
    if (particle === -1) {
      renderer.target = 0;
      return;
    }
    renderer.target = renderer.targets.indexOf(particle);
  });
  
  buttons[name] = element;
}

export { buttons, renderUI, renderParticleBox, updateStats };