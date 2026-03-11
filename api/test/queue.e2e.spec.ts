import {expect, it } from "vitest";
import {QueryOrchestrator} from "../src/services/QueryOrchestrator";
import {prisma} from "../src/db";
import assert from "node:assert";
import {config} from "../src/config";

it('Queue Orchestrator', async () => {
    const orchestrator = new QueryOrchestrator();

    const user = await prisma.users.findFirst({});
    assert.ok(user);

    const course = await prisma.courses.findFirst({
        where: {
            userId: user.id,
        }
    });
    assert.ok(course);

    const filter = {
        courseId: course.id
    };

    expect(course.questions).toHaveLength(0);

    const newCourse = await orchestrator.prepareQueries(filter);

    expect(newCourse.questions).toHaveLength(2);

    const updatedCourse = await prisma.courses.findFirst({
        where: {
            userId: user.id,
        }
    });
    assert.ok(updatedCourse);

    expect(updatedCourse.questions).toHaveLength(2);
})