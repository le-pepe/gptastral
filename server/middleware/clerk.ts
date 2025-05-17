import { clerkMiddleware} from "@clerk/nuxt/server";

export default clerkMiddleware(async (event) => {
    const {userId} = event.context.auth();

    if (!userId) {
        if (event.path.startsWith("/chat") || event.path.startsWith("/interactive")) {
            return await sendRedirect(event,'/login', 401)
        }
        const isProtected = event.path.startsWith("/api");
        if (isProtected) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
            });
        }

    }
})
