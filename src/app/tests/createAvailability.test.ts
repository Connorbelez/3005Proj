
import {addTrainerAvailability } from '@/app/api/trainers/schedule';
import { db } from '@/db/db';
import {expect} from "chai";
import { describe, it, beforeEach } from 'mocha';

describe('addTrainerAvailability Tests', () => {
    beforeEach(async () => {
        // Clean up and set initial state before each test
        await db.transaction().execute(async trx => {
            await trx.deleteFrom('trainer_availability').execute();
        });
    });

    it('should add a non-overlapping availability', async () => {
        const trainerId = 1;
        const startTime = new Date('2024-04-15T09:00:00');
        const endTime = new Date('2024-04-15T10:00:00');

        // Assume no overlaps exist
        const availabilityId = await addTrainerAvailability({ trainer_id: trainerId, start_time: startTime.toISOString(), end_time: endTime.toISOString() });

        // Check the results
        const availabilities = await db.selectFrom('trainer_availability')
            .selectAll().execute();
        expect(availabilities).to.have.lengthOf(1);
        expect(availabilities[0].availability_id).to.equal(availabilityId);
    });

    it('should merge overlapping availabilities', async () => {
        const trainerId = 1;
        const initialStart = new Date('2024-04-15T08:00:00');
        const initialEnd = new Date('2024-04-15T09:30:00');
        // Insert initial overlapping availability
        await db.insertInto('trainer_availability').values({
            trainer_id: trainerId,
            start_time: initialStart,
            end_time: initialEnd
        }).execute();

        const newStart = new Date('2024-04-15T09:00:00');
        const newEnd = new Date('2024-04-15T10:00:00');
        await addTrainerAvailability({ trainer_id: trainerId, start_time: newStart.toISOString(), end_time: newEnd.toISOString() });

        // Expect merged availability from 08:00 to 10:00
        const availabilities = await db.selectFrom('trainer_availability')
            .selectAll().execute();

        expect(availabilities).to.have.lengthOf(1);
        expect(availabilities[0].start_time).to.eql(initialStart);
        expect(availabilities[0].end_time).to.eql(newEnd);
    });

    it('should handle invalid trainer ID', async () => {
        try {
            await addTrainerAvailability({ trainer_id: null, start_time: new Date().toISOString(), end_time: new Date().toISOString() });
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error.message).to.equal('Trainer ID must be provided');
        }
    });
});
