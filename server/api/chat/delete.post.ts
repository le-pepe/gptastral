export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context.auth();
        const {uuid} = await readBody(event)

        if (!uuid) {
            return {
                success: false,
                message: 'There is not a chat to delete'
            }
        }

        await useDrizzle().delete(tables.chats).where(and(eq(tables.chats.uuid, uuid), eq(tables.chats.user_id, userId)))

        return {
            success: true
        }
    } catch (e) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error deleting chat"
        }
    }
});
