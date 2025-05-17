export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context.auth();
        const {uuid} = await readBody(event)

        const res = await useDrizzle().query.interactives.findFirst({
            where: and(eq(tables.interactives.uuid, uuid), eq(tables.interactives.user_id, userId)),
            columns: {
                input: true,
                output: true,
                uuid: true,
            }
        })
        if (!res) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }
        return {
            success: true,
            data: res
        }
    } catch (e) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error connecting with reader"
        }
    }
});
