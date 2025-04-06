import { clerkMiddleware} from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
    const { userId } = event.context.auth;

    const isProtected = event.path.startsWith("/api");
    if (isProtected && !userId) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }
})
