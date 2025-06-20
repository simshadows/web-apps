/*
 * Filename: index.js
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

//const assert = console.assert;

/*
 * Encoders/Decoders
 */

const strFunctions = {
    "none": (s) => s,
    "base64-decode": (s) => atob(s),
    "base64-encode": (s) => btoa(s),
    "regex-literal-encode-jsflavour": (s) => RegExp.escape(s),
    "url-decode": (s) => {
        // unescape() is a non-standard browser function.
        // Consider replacing with something better-supported.
        return unescape(s);
    },
    "url-encode": (s) => {
        // escape() is a non-standard browser function.
        // Consider replacing with something better-supported.
        return escape(s);
    },
    "xml-entities-decode": (s) => {
        // We first do a quick test to see if this is unsafe
        const e = document.createElement("textarea");
        e.innerHTML = "<script>alert('Error: Your browser failed a compatibility test. Please report this bug on GitHub, or email <contact@simshadows.com>.')</script>";
        e;
        // I'm actually not entirely sure if that would ever work.
        // Better to give it a try and be safe than sorry though.
        e.innerHTML = s;
        return e.value;
    },
    "xml-entities-encode": (s) => {
        const e = document.createElement("textarea");
        e.innerText = s;
        return e.innerHTML;
    },
    "calc-string-length": (s) => s.length,
}

/*
 * Rendering
 */

const inputElement = document.querySelector("#input");
const outputElement = document.querySelector("#output");
const fnSelect = document.querySelector("#fn-select");
const runButton = document.querySelector("#run-button");

function render() {
    try {
        const fn = strFunctions[fnSelect.value];
        const inputValue = String(inputElement.value);
        const outputValue = String(fn(inputValue));
        outputElement.value = outputValue;
    } catch (e) {
        console.error(e);
        outputElement.value = String(e);
    }
}

[
    inputElement,
    //outputElement
    fnSelect,
].forEach(x => x.addEventListener("change", render));

runButton.addEventListener("click", render);

render();

