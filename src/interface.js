import { rgba } from "./js/utils";

const TOPBAR = document.querySelector(".topbar");
const buttons = {
  // rain: (() => {
  //   const l = Object.assign(document.createElement("label"), {
  //     htmlFor: "should_rain",
  //   });
  //   l.append(
  //     Object.assign(document.createElement("input"), {
  //       type: "checkbox",
  //       id: "should_rain",
  //       name: "should_rain",
  //     }),
  //     document.createTextNode(" Enable Rain")
  //   );
  //   return l;
  // })(),

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
  const name = particle.name
  console.log(name)
  const color = rgba(particle.color)
  console.log(color)
  const element = document.createElement('div')
  const styles = createStyles({
    background: color,
    padding: '20px',
    margin: '5px',
    cursor: 'pointer'
  })
  element.addEventListener('click', () => {
    renderer.target = renderer.targets.indexOf(particle)
  })
  element.style.cssText = styles
  buttons[name] = element
}
export { buttons, renderUI, renderParticleBox };
