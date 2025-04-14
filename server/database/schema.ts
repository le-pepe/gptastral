import {pgTable, uuid, text, varchar, timestamp, serial, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    uuid: uuid("uuid").notNull(),
    user_id: varchar("user_id").notNull(),
    title: text("title"),
});

export const chatsRelations = relations(chats, ({many}) => ({
    messages: many(messages, {
        fields: [chats.id],
        references: [messages.chat_id]
    })
}));

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    chat_id: integer("chat_id")
        .notNull()
        .references(() => chats.id),
    message: text("message").notNull(),
    user_id: varchar("user_id").notNull(),
    role: varchar("role").notNull(),
});

export const messagesRelations = relations(messages, ({one}) => ({
    chat: one(chats, {
        fields: [messages.chat_id],
        references: [chats.id]
    })
}));
