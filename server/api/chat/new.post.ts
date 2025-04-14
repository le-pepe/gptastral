import {randomUUID} from "uncrypto";
import {tables} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {

    try {
        const uuid = randomUUID();
        const { userId } = event.context.auth;

        const res = await useDrizzle().insert(tables.chats).values({
            uuid,
            user_id: userId,

        })

        return {
            success: true,
            data: {
                uuid: uuid
            }
        }

    } catch (e: unknown) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error generating uuid"
        }
    }
})
