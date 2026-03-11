import {seed} from "./seed";
import {reset} from "./reset";

export async function setup() {
    await reset();
    await seed();
}

