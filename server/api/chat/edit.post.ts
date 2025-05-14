export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context.auth();
        const {uuid = null, title = null} = await readBody(event)

        if (!uuid) {
            return {
                success: false,
                message: 'There is not a chat to edit'
            }
        }

        if (!title) {
            return {
                success: false,
                message: 'There is not a title'
            }
        }

        await useDrizzle().update(tables.chats).set({title}).where(and(eq(tables.chats.uuid, uuid), eq(tables.chats.user_id, userId)))
        return {
            success: true
        }
    } catch (e) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error editing chat"
        }
    }
});
