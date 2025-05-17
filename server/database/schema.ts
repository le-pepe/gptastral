import { pgTable, uuid, text, varchar, timestamp, serial, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    uuid: uuid("uuid").notNull().unique(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    title: text("title"),
}, (table) => ({
    userIdx: index("chats_user_idx").on(table.user_id),
    createdAtIdx: index("chats_created_at_idx").on(table.created_at),
    userCreatedIdx: index("chats_user_created_idx").on(table.user_id, table.created_at),
}));

export const chatsRelations = relations(chats, ({ many }) => ({
    messages: many(messages),
}));

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    chat_id: integer("chat_id")
        .notNull()
        .references(() => chats.id, { onDelete: 'cascade' }),
    message: text("message").notNull(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
}, (table) => ({
    chatIdx: index("messages_chat_idx").on(table.chat_id),
    userIdx: index("messages_user_idx").on(table.user_id),
    chatCreatedIdx: index("messages_chat_created_idx").on(table.chat_id, table.created_at),
    roleIdx: index("messages_role_idx").on(table.role),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    chat: one(chats, {
        fields: [messages.chat_id],
        references: [chats.id]
    }),
}));

export const interactives = pgTable("interactive_chat", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    uuid: uuid("uuid").notNull().unique(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    input: text("input").notNull(),
    output: text("output"),
    title: text("title"),
}, (table) => ({
    uuidIdx: index("interactive_uuid_idx").on(table.uuid),
    userIdx: index("interactive_user_idx").on(table.user_id),
    createdAtIdx: index("interactive_created_at_idx").on(table.created_at),
    userDateIdx: index("interactive_user_date_idx").on(table.user_id, table.created_at),
}));
