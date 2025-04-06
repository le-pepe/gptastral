import {randomUUID} from "uncrypto";

export default defineEventHandler((event) => {

    try {
        const uuid = randomUUID();

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
