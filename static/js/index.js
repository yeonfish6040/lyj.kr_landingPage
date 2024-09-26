
const $ = (query) => { return document.querySelector(query) };
const animation_index = {
    intro: {
        init: (callback, ...args) => {
            $(".container>.main").animate([ { height: "100%" }, { height: "12%" } ], { duration: 1500, fill: "both", easing: "ease-in-out" });
            $(".container>.main>.subtitle>.inner").animate([ { maxHeight: "100%" }, { maxHeight: "0%" } ], { duration: 1500, fill: "both", easing: "ease-in-out" });
        }
    },
    events: {}
}

function init() {
    animation_index.intro.init();

    Object.keys(animation_index.events).forEach(eventName => {
        Array.from(animation_index.events[eventName]).forEach(eventHandler => {
            let animation = eventHandler.animation;
            if (eventHandler.hasOwnProperty("nomobile")) animation = (...args) => {if (window.innerWidth <= 720) return; eventHandler.animation(...args);};
            if (eventHandler.selector === "document") {
                document.addEventListener(eventName, (e) => animation(e, document));
                return;
            }
            if (eventHandler.hasOwnProperty("all"))
                document.querySelectorAll(eventHandler.selector).forEach(element => element.addEventListener(eventName, (e) => animation(e, element)));
            else
                document.querySelector(eventHandler.selector).addEventListener(eventName, (e) => animation(e, document.querySelector(eventHandler.selector)));
        });
    });
}