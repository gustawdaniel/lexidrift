const W: number[] = [
    0.40255, // 0
    1.18385, // 1
    3.173,   // 2
    15.69105,// 3
    7.1949,  // 4
    0.5345,  // 5
    1.4604,  // 6
    0.0046,  // 7
    1.54575, // 8
    0.1192,  // 9
    1.01925, // 10
    1.9395,  // 11
    0.11,    // 12
    0.29605, // 13
    2.2698,  // 14
    0.2315,  // 15
    2.9898,  // 16
    0.51655, // 17
    0.6621   // 18
];

type R = number;
type S = number;
type D = number;
export type Grade = number; // Grade is now a continuous value between 0.0 and 1.0

type T = number;

const F: number = 19.0 / 81.0;
const C: number = -0.5;

// const minimalStability = 1 / 86400; //1 second per day

export function retrievability(t: T, s: S): R {
    // if(s < minimalStability) s = minimalStability;

    return Math.pow(1.0 + F * (t / s), C);
}

function interval(r_d: R, s: S): T {
    return (s / F) * (Math.pow(r_d, 1.0 / C) - 1.0);
}

export function s_0(g: Grade): S {
    return W[0] + g * (W[3] - W[0]);
}

// export function s_success(d: D, s: S, r: R, g: Grade): S {
//     // if(s < minimalStability) s = minimalStability;
//
//     const t_d = 11.0 - d;
//     const t_s = Math.pow(s, -W[9]);
//     const t_r = Math.exp(W[10] * (1.0 - r)) - 1.0;
//     const h = 1.0 + g * (W[15] - 1.0);
//     const b = 1.0 + g * (W[16] - 1.0);
//     const c = Math.exp(W[8]);
//     const alpha = 1.0 + t_d * t_s * t_r * h * b * c;
//     return s * alpha;
// }
//
// export function s_fail(d: D, s: S, r: R): S {
//     // if(s < minimalStability) s = minimalStability;
//
//     const d_f = Math.pow(d, -W[12]);
//     const s_f = Math.pow(s + 1.0, W[13]) - 1.0;
//     const r_f = Math.exp(W[14] * (1.0 - r));
//     const c_f = W[11];
//     const s_f_result = d_f * s_f * r_f * c_f;
//     return Math.min(s_f_result, s);
// }

//  S ′ ( S , G ) = S ⋅ e w 17 ⋅ ( G − 3 + w 18 )
//  S ′ ( S , G ) = S ⋅ e w 17 ⋅ ( (1+(g * 3)) − 3 + w 18 )
function stability(d: D, s: S, r: R, g: Grade): S {
    const G = 1 + g * 3;

    return s * Math.exp(W[17] * (G - 3.0 + W[18]));
}


function clamp_d(d: D): D {
    return Math.max(1.0, Math.min(d, 10.0));
}

//  D 0 ( G ) = w 4 − e w 5 ⋅ ( G − 1 ) + 1 ,
function d_0(g: Grade): D {
    const G = 1 + g * 3;

    return clamp_d(W[4] - Math.exp(W[5] * (G - 1.0)) + 1.0);
}


// Δ D ( G ) = − w 6 ⋅ ( G − 3 )
function delta_d(g: Grade): number {
    const G = 1 + g * 3;

    return -W[6] * (G - 3);
}

// D ′ = D + Δ D ⋅ (10 − D) / 9
function dp(d: D, g: Grade): number {
    const G = 1 + g * 3;

    return d + delta_d(g) * ((10.0 - d) / 9.0);
}

function difficulty(d: D, g: Grade): D {
    return clamp_d(W[7] * d_0(1.0) + (1.0 - W[7]) * dp(d, g));
}

export interface Step {
    /** The time when the review took place. */
    t: T;
    /** New stability. */
    s: S;
    /** New difficulty. */
    d: D;
    /** Next interval. */
    i: T;
}

/**
 * not used
 * @param grades
 */
function sim(grades: Grade[]): Step[] {
    let t: T = 0.0;
    const r_d: number = 0.9;
    const steps: Step[] = [];

    // Initial review.
    if (grades.length === 0) {
        throw new Error("Grades array cannot be empty");
    }

    const gradesCopy = [...grades];
    const g: Grade = gradesCopy.shift()!;
    let s: S = s_0(g);
    let d: D = d_0(g);
    // let i: T = Math.max(Math.round(interval(r_d, s)), 1.0);
    let i: T = interval(r_d, s);
    steps.push({ t, s, d, i });

    // n-th review
    for (const g of gradesCopy) {
        t += i;
        const r: R = retrievability(i, s);
        s = stability(d, s, r, g);
        d = difficulty(d, g);
        // i = Math.max(Math.round(interval(r_d, s)), 1.0);
        i = interval(r_d, s);
        steps.push({ t, s, d, i });
    }

    return steps;
}


export function nextStep(g: Grade, step?: Step): Step {
    const r_d: number = 0.9;

    if (!step) {
        let t: T = 0.0;
        const steps: Step[] = [];
        let s: S = s_0(g);
        let d: D = d_0(g);
        // let i: T = Math.max(Math.round(interval(r_d, s)), 1.0);
        let i: T = interval(r_d, s);

        return { t, s, d, i };
    }

    let t: T = step.i;
    const r: R = retrievability(step.i, step.s);
    const s: S = stability(step.d, step.s, r, g);
    const d: D = difficulty(step.d, g);
    const i: T = interval(r_d, s);

    return { t, s, d, i }
}