import {Db} from 'mongodb';
import {MigrationInterface} from 'mongo-migrate-ts';

export class Migration1741191755224 implements MigrationInterface {
    public async up(db: Db): Promise<void | never> {
        await db.collection('user_knowledge').updateMany({
            fsrs: {
                $exists: false
            }
        }, {
            $set: {
                fsrs: null,
            },
        });
    }

    public async down(db: Db): Promise<void | never> {
    }
}
