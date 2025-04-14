import {desc} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {

    try {
        const {userId} = event.context.auth;

        const res = await useDrizzle()
            .select({
                uuid: tables.chats.uuid,
                title: tables.chats.title,
                created_at: tables.chats.created_at,
            })
            .from(tables.chats)
            .where(eq(tables.chats.user_id, userId))
            .orderBy(desc(tables.chats.created_at))

        /*const tmp = Object.groupBy(res, (item: any, index: number) => {
            //todo: parse date to human readable
            return item.created_at
        })*/

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(yesterday.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

        const result = res.reduce((acc: any, item: any) => {
            const createdAt = new Date(item.created_at);

            if (createdAt.toDateString() === today.toDateString()) {
                acc["today"].push(item);
            } else if (createdAt.toDateString() === yesterday.toDateString()) {
                acc["yesterday"].push(item);
            } else if (createdAt >= sevenDaysAgo) {
                acc["sevendaysago"].push(item);
            } else if (createdAt >= thirtyDaysAgo) {
                acc["thirtydaysago"].push(item);
            } else {
                const yearMonth = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[yearMonth]) {
                    acc[yearMonth] = [];
                }
                acc[yearMonth].push(item);
            }

            return acc;
        }, {"today": [], "yesterday": [], "sevendaysago": [], "thirtydaysago": []});

        return {
            success: true,
            data: result
        }
    } catch (e) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error connecting with reader"
        }
    }

})
