import {describe, it, expect} from "vitest";
import {nextStep, retrievability, s_0} from "./fsrs";

describe('fsrs', () => {

    it('first correct', () => {
        const g = 1;
        const next = nextStep(g);
        expect(next).toEqual({
            t: 0,
            s: 15.69105,
            "d": 3.2245015893713678,
            i: 15.691049999999997,
        });
    });

    it('first incorrect', () => {
        const g = 0;
        const next = nextStep(g);
        expect(next).toEqual({
            t: 0,
            s: 0.40255,
            "d": 7.1949,
            i: 0.4025499999999999,
            // s: 0,
            // i: 0,
        });
    });

    it('first long time thinking', () => {
        const g = 0.22;
        const next = nextStep(g);
        expect(next).toEqual({
            t: 0,
            s: 3.7660200000000006,
            "d": 6.771896185085165,
            i: 3.7660199999999997,
            // s: 0,
            // i: 0,
        });
    });

    it('que correct answer', () => {
        const g = 1;
        const step = {
            t: 0,
            s: 0.4,
            d: 8.22,
            i: 15.691049999999997,
        };
        const next = nextStep(g, step);
        expect(next).toEqual({
            "d": 7.909514680111109,
            "i": 0.9439019574402183,
            "s": 0.9439019574402185,
            "t": 15.691049999999997,
        });
    })

    it('que real example', () =>{
        const g = 1;
        const step = { t: 0, s: 0.4044304067137892, d: 8.222615462352309, i: 0 };
        const next = nextStep(g, step);
        expect(next).toEqual({
            t: 0,
            "d": 7.912540561443452,
            "i": 0.9543566313637232,
            "s": 0.9543566313637233,
        });
    })

    it('answer is almost wrong after one day', () => {
        // const g = 0.0006221953781140531;
        // const g = 0.1;
        const step = {
            t: 0,
            s: 0.4026163323954781,
            d: 7.608933725363192,
            i: 0.6840277777777778
        };
        // const next = nextStep(g, step);
        // expect(next).toEqual({
        //     t: 0.6840277777777778,
        //     s: 1.6202330114985275,
        //     d: 7.88764573213221,
        //     i: 1.620233011498527
        // });
        const r = retrievability(step.i, step.s);
        console.log('r', r);

        const sg: [number, number][] = [];
        let prevS = 0;

        for (let g = 0; g < 1; g += 0.1) {
            const next = nextStep(g, step);
            sg.push([g, next.s]);

            expect(prevS).lessThanOrEqual(step.s);
            prevS = step.s;
        }

        expect(sg).toHaveLength(11)


    })

    // --

    // it('second unstable incorrect -> incorrect', () => {
    //     const g = 0;
    //     const step = {
    //         t: 0,
    //         s: 0,
    //         d: 7.608937801989269,
    //         i: 0,
    //     };
    //     const next = nextStep(g, step);
    //     expect(next).toEqual({
    //         t: 0,
    //         s: 0.000005316106758891305,
    //         d: 7.887889591501001,
    //         i: 0.000005316106758891304,
    //     });
    // });
    //
    // it('second unstable incorrect -> correct', () => {
    //     const g = 1;
    //     const step = {
    //         t: 0,
    //         s: 0,
    //         d: 7.608937801989269,
    //         i: 0,
    //     };
    //     const next = nextStep(g, step);
    //     expect(next).toEqual({
    //         t: 0,
    //         s: 0.000011574074074074073,
    //         d: 7.50168465142338,
    //         i: 0.00001157407407407407,
    //     });
    // });

    // --

    it('second correct -> incorrect', () => {
        const g = 0;
        const step = {
            t: 0,
            s: 15.69105,
            d: 5.282434422319005,
            i: 15.691049999999997,
        };
        const next = nextStep(g, step);
        expect(next).toEqual({
            t: 15.691049999999997,
            "d": 6.796932579932992,
            "i": 7.861663624546547,
            "s": 7.861663624546549,
        });
    });

    it('second incorrect -> incorrect', () => {
        const g = 0;
        const step = {
            t: 0,
            s: 0.40255,
            d: 7.608937801989269,
            i: 0.4025499999999999,
        };
        const next = nextStep(g, step);
        expect(next).toEqual({
            t: 0.4025499999999999,
            "d": 8.361179275566467,
            "i": 0.20168903241409672,
            "s": 0.20168903241409677,
        });
    });

    it('second incorrect -> correct', () => {
        const g = 1;
        const step = {
            t: 0,
            s: 0.40255,
            d: 7.608937801989269,
            i: 0.4025499999999999,
        };
        const next = nextStep(g, step);
        expect(next).toEqual({
            t: 0.4025499999999999,
            "d": 7.202564455333605,
            "i": 0.9499193324188996,
            "s": 0.9499193324188999,
        });
    });

    it('normalized correct', () => {
        const g = 1;
        const step = {
            t: 0,
            s: 0.5,
            d: 0.5,
            i: 1,
        };
        const next = nextStep(g, step);
        expect(next).toEqual({
            t: 1,
            d: 1,
            "i": 1.1798774468002728,
            "s": 1.179877446800273,
        });
    });

    it('normalized incorrect', () => {
        const g = 0;
        const step = {
            t: 0,
            s: 0.5,
            d: 0.5,
            i: 1,
        };
        const next = nextStep(g, step);
        expect(next).toEqual({
            t: 1,
            "d": 3.5814172673111075,
            "i": 0.2505142620967541,
            "s": 0.25051426209675415,
        });
    });

    it('s_0', () => {
        expect(s_0(1)).toBe(15.69105);
        expect(s_0(0)).toBe(0.40255);
    })

});