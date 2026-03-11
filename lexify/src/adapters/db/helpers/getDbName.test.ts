import {getDbName} from "./getDbName";
import { expect, test } from 'vitest'

test('getDbName dev', () => {
    const expected = 'lexi_drift';
    const actual = getDbName('mongodb://localhost:27017/lexi_drift');

    expect(actual).toBe(expected);
});

test('getDbName prod', () => {
    const expected = 'lexi_drift';
    const actual = getDbName('mongodb+srv://user:password@cluster.mongodb.net/lexi_drift?retryWrites=true&w=majority&appName=Cluster0');

    expect(actual).toBe(expected);
});