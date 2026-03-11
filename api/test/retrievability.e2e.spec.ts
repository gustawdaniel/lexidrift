import {expect, it } from "vitest";
import {computeRetrievability} from "../src/services/KnowledgeMeasurement";
import dayjs from "dayjs";
import {prisma} from "../src/db";
import assert from "node:assert";

it('should compute retrievability', async () => {
    const user = await prisma.users.findFirst({});
    assert.ok(user, 'User not found');

    const r = await computeRetrievability(dayjs('2025-03-16').toDate(), {
        lang: 'en',
        userId: user.id,
    });

    expect(r).toBeGreaterThan(0);
})