/*
 * Filename: index.js
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

const strFunctions = {
    "none": (s) => s,
    "base64-decode": (s) => atob(s),
    "base64-encode": (s) => btoa(s),

    "regex-literal-jsflavour-encode": (s) => {
        return RegExp.escape(s);
    },
    // hmm there's an interesting idea here with the modified version.
    // I'll keep it commented out for now until I've figured out a use for it.
    //"regex-literal-jsflavour-encode-modified": (s) => {
    //    const a = RegExp.escape("a");
    //    const chars = [];
    //    for (const c of s) {
    //        const x = RegExp.escape("a" + c);
    //        chars.push(x);
    //    }
    //    return chars.join("");
    //},

    // escape() and unescape() are non-standard browser functions.
    // Consider replacing with something better-supported.
    "url-decode": (s) => unescape(s),
    "url-encode": (s) => escape(s),

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

    "experimental-regex-escape-by-character": (s) => {
        const chars = [];
        for (const c of s) {
            chars.push(RegExp.escape(c));
        }
        return chars.join("");
    },
    "experimental-exception": () => {
        null.foobar()
    },
}


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
        outputElement.classList.remove("error");
    } catch (e) {
        console.error(e);
        outputElement.value = String(e);
        outputElement.classList.add("error");
    }
}

inputElement.addEventListener("change", render);
fnSelect.addEventListener("change", render);

runButton.addEventListener("click", render);

render();

