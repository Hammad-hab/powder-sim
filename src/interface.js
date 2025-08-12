const TOPBAR = document.querySelector(".topbar");
const buttons = {
  rain: (() => {
    const l = Object.assign(document.createElement("label"), {
      htmlFor: "should_rain",
    });
    l.append(
      Object.assign(document.createElement("input"), {
        type: "checkbox",
        id: "should_rain",
        name: "should_rain",
      }),
      document.createTextNode(" Enable Rain")
    );
    return l;
  })(),
  sand: (() => {
     const btn = (document.createElement("button"))
     btn.appendChild(document.createTextNode('Sand'))
     return btn 
  })(),
  water: (() => {
     const btn = (document.createElement("button"))
     btn.appendChild(document.createTextNode('Water'))
     return btn 
  })()
};

for (const button in buttons) {
  console.log(button);
  TOPBAR.appendChild(buttons[button]);
}


export {
    buttons
}