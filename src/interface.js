import { Box } from "./js";
import { rgba } from "./js/utils";

const TOPBAR = document.querySelector(".topbar");
const buttons = {
};

function renderUI() {
  for (const button in buttons) {
    TOPBAR.appendChild(buttons[button]);
  }
}

function createStyles(styles) 
{
    return Object.entries(styles)
    .filter(([key]) => CSS.supports(key, "initial"))
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}


function renderParticleBox(particle, renderer) {
 
  const color = Array.isArray(particle.color) ? rgba(particle.color) : rgba(particle.color())
  console.log(color)
  const name = particle.name
  const element = document.createElement('div')
  const styles = createStyles({
    background: color,
    padding: '20px',
    margin: '5px',
    cursor: 'pointer'
  })
  element.addEventListener('click', () => {
    if (particle === -1) {
      renderer.target = 0
      return
    }
    renderer.target = renderer.targets.indexOf(particle)
  })
  element.style.cssText = styles
  buttons[name] = element
}
export { buttons, renderUI, renderParticleBox };
