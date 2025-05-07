import OpenAI from "openai";

export default defineEventHandler(async (event) => {
    try {
        const { openaiApiKey, deepseekApiKey } = useRuntimeConfig(event);
        const client = new OpenAI({ apiKey: deepseekApiKey, baseURL: 'https://api.deepseek.com/' });

        const { userId } = event.context.auth;
        const { uuid, message } = await readBody(event);
        const db = useDrizzle();

        // Buscar el chat asegurando que pertenece al usuario
        const chatRes = await db
            .select()
            .from(tables.chats)
            .where(
                and(
                    eq(tables.chats.uuid, uuid),
                    eq(tables.chats.user_id, userId)
                )
            );

        if (!chatRes.length) {
            return { success: false, message: 'Chat not found' };
        }

        const chatId = chatRes[0].id;

        // Traer mensajes previos del usuario para el contexto
        let messages = await db
            .select({ message: tables.messages.message, role: tables.messages.role })
            .from(tables.messages)
            .where(
                and(
                    eq(tables.messages.user_id, userId),
                    eq(tables.messages.chat_id, chatId)
                )
            );

        messages = messages.map(m => ({
            role: m.role === 'user' ? 'user' : (m.role === 'assistant' ? 'assistant' : 'system'),
            content: m.message
        }));

        // Insertar nuevo mensaje del usuario
        await db.insert(tables.messages).values({
            chat_id: chatId,
            message: message,
            user_id: userId,
            role: 'user'
        });

        // Prompt del sistema
        const prompt =
            "Act as a highly skilled expert in tarot, runes, and astrological chart readings. Your task is to provide insightful, personalized guidance based on the user's specific question. Follow the steps below carefully:\n\nBefore beginning any reading, check if the user's inquiry is related to tarot, runes, or astrological charts. If not, respond politely that you are not programmed to handle topics outside those areas.\n\n1. Language Preference: Detect the user's preferred language and use it naturally throughout the reading. Do not include any statements or commentary about language detection or switching, regardless of the language used by the user.\n\n2. User Inquiry: Acknowledge the user's question with warmth and empathy. Politely ask for any extra details that may help enrich the reading. If the user does not ask a specific question, proceed with a general reading focused on their overall life path, current energies, and guidance.\n\n3. Tarot Reading:\n- Use a standard tarot deck.\n- Shuffle the cards and draw a relevant spread (e.g., three cards for past, present, and future).\n- Interpret each card clearly in the context of the user’s situation.\n- Add relevant emojis to the response to enhance clarity and emotional tone.\n\n4. Runes Reading:\n- Draw three runes.\n- Display each rune using visual representations if available (images or Unicode runes like ᚠ, ᚢ, ᚦ).\n- Provide a brief but insightful interpretation of each rune in the context of the user's question or general life.\n- Include appropriate emojis in the explanation to convey meaning or energy.\n\n5. Astrological Chart Analysis:\n- If the user provides their birth date, time, and location, generate a short astrological overview.\n- Focus on Sun, Moon, and Rising signs, and explain their influence on the user’s personality and life journey.\n- If any of this data is missing, suggest: “To enhance this reading with an astrological chart, feel free to share your date, time, and place of birth.”\n\n6. Encouragement and Follow-up:\n- Conclude with supportive reflections.\n- Encourage the user to meditate on the reading and invite any follow-up questions or requests for clarification.\n- Continue using emojis to maintain a warm, expressive tone throughout the closing.";

        let chatMessages = [
            { role: "system", content: prompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
        ];
        const completion = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: chatMessages
        });

        const assistantContent = completion.choices[0].message.content!;

        // Guardar respuesta de la IA
        await db.insert(tables.messages).values({
            chat_id: chatId,
            message: assistantContent,
            user_id: userId,
            role: 'assistant'
        });

        // Generar título si aún no existe
        if (!chatRes[0].title) {
            const titlePrompt =
                "Generate a short (4-6 words), relevant title for this chat based only on the user's question and the AI's response. The title MUST be written in the same language as the user's question. No emojis, no punctuation, and no special formatting.";
            const titleResp = await client.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: titlePrompt },
                    { role: 'user', content: message },
                    { role: 'assistant', content: assistantContent }
                ]
            });

            await db.update(tables.chats)
                .set({ title: titleResp.choices[0].message.content })
                .where(eq(tables.chats.uuid, uuid));
        }

        return { success: true, data: assistantContent };
    } catch (e) {
        console.error(e)
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error connecting with reader"
        }
    }
});
