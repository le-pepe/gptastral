import {randomUUID} from "uncrypto";
import {tables} from "~/server/utils/drizzle";
import OpenAI from "openai";

export default defineEventHandler(async (event) => {

    try {
        const uuid = randomUUID();
        const { userId } = event.context.auth();
        const { model = 'deepseek'} = await readBody(event)


        await useDrizzle().insert(tables.chats).values({
            uuid,
            user_id: userId,
            model
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
