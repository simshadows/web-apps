/*
 * Filename: index.js
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

//const assert = console.assert;

/*
 * Encoders/Decoders
 */

function passthrough(s) {
    return s;
}

const decoders = {
    "none": passthrough,
    "base64": function(s) {
        return atob(s);
    },
    "url": function(s) {
        // unescape() is a non-standard browser function.
        // Consider replacing with something better-supported.
        return unescape(s);
    },
    "xml-entities": function(s) {
        // We first do a quick test to see if this is unsafe
        const e = document.createElement("textarea");
        e.innerHTML = "<script>alert('Error: Your browser failed a compatibility test. Please report this bug on GitHub, or email <contact@simshadows.com>.')</script>";
        e;
        // I'm actually not entirely sure if that would ever work.
        // Better to give it a try and be safe than sorry though.
        e.innerHTML = s;
        return e.value;
    },
}

const encoders = {
    "none": passthrough,
    "base64": function(s) {
        return btoa(s);
    },
    "url": function(s) {
        // escape() is a non-standard browser function.
        // Consider replacing with something better-supported.
        return escape(s);
    },
    "xml-entities": function(s) {
        const e = document.createElement("textarea");
        e.innerText = s;
        return e.innerHTML;
    },
    "calc-string-length": function(s) {
        return s.length;
    },
}

/*
 * Rendering
 */

const inputElement = document.querySelector("#input");
const outputElement = document.querySelector("#output");
const inputDecodeSelect = document.querySelector("#decode-select");
const outputEncodeSelect = document.querySelector("#encode-select");
const runButton = document.querySelector("#run-button");

function render() {
    try {
        const inputMode = inputDecodeSelect.value;
        const outputMode = outputEncodeSelect.value;

        const decoder = decoders[inputMode];
        const encoder = encoders[outputMode];

        const inputValue = String(inputElement.value);
        const outputValue = String(encoder(String(decoder(inputValue))));
        outputElement.value = outputValue;
    } catch (e) {
        console.error(e);
        outputElement.value = String(e);
    }
}

[
    inputElement,
    //outputElement
    inputDecodeSelect,
    outputEncodeSelect,
].forEach(x => x.addEventListener("change", render));

runButton.addEventListener("click", render);

render();

