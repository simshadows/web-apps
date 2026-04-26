import { defineConfig } from "astro/config";

import {
    SITE,
} from "./src/constants";

// https://astro.build/config
export default defineConfig({
    site: SITE,
    integrations: [],
});

