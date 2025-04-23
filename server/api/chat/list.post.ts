import {desc} from "~/server/utils/drizzle";
import groupChatsByDate from "~/server/utils/chat";

export default defineEventHandler(async (event) => {

    try {
        const {userId} = event.context.auth;

        const { limit = 30, page = 1 } = await readBody(event)

        const offset = (page -1) * limit

        const [chats, totalCount] = await Promise.all([
            useDrizzle()
                .select({
                    uuid: tables.chats.uuid,
                    title: tables.chats.title,
                    created_at: tables.chats.created_at,
                })
                .from(tables.chats)
                .where(eq(tables.chats.user_id, userId))
                .limit(limit)
                .offset(offset)
                .orderBy(desc(tables.chats.created_at)),

            useDrizzle()
                .select({ count: sql<number>`count(*)` })
                .from(tables.chats)
                .where(eq(tables.chats.user_id, userId))
                .then(result => Number(result[0].count))
        ])

        const result = groupChatsByDate(chats)

        return {
            success: true,
            data: result,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: offset + limit < totalCount
            }
        }
    } catch (e) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error connecting with reader"
        }
    }

})
