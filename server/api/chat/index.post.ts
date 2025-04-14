export default defineEventHandler(async (event) => {

    try {
        const {userId} = event.context.auth;

        const {uuid} = await readBody(event)

        /*const res = await useDrizzle()
            .select()
            .from(tables.chats)
            .leftJoin(tables.messages, eq(tables.messages.chat_id, tables.chats.id!))
            .where(and(eq(tables.chats.uuid, uuid), eq(tables.chats.user_id, userId)))
*/
        const res = await useDrizzle()
            .query
            .chats
            .findFirst({
                where: and(eq(tables.chats.uuid, uuid), eq(tables.chats.user_id, userId)),
                with: {
                    messages: true
                }
            })
        if (res) {
            return {
                success: true,
                data: res
            }
        } else {
            return {
                success: false,
                message: 'Chat not found'
            }
        }
    } catch (e) {
        console.error('Error getting chat', e)
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error connecting with reader"
        }
    }

})
