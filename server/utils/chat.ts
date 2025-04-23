export default function groupChatsByDate(chats: any[]) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(yesterday.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

    return chats.reduce((acc: any, item: any) => {
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
    }, {"today": [], "yesterday": [], "sevendaysago": [], "thirtydaysago": []})
}
