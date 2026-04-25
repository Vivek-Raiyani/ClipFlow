import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["creator", "editor"]);
export const projectStatusEnum = pgEnum("project_status", ["active", "archived", "published"]);
export const fileTypeEnum = pgEnum("file_type", ["raw", "draft", "final"]);
export const fileStatusEnum = pgEnum("file_status", ["pending", "approved", "rejected"]);
export const visibilityEnum = pgEnum("visibility", ["private", "unlisted", "public"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(), // The ID from Clerk
  email: text("email").notNull().unique(),
  name: text("name"),
  role: userRoleEnum("role").default("editor").notNull(),
  activeChannelId: uuid("active_channel_id"), // Will reference youtube_channels.id later
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const youtubeChannels = pgTable("youtube_channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  youtubeChannelId: text("youtube_channel_id").notNull().unique(),
  channelTitle: text("channel_title").notNull(),
  channelThumbnail: text("channel_thumbnail"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Relationship table to link editors to creators
export const creatorEditorRelationships = pgTable("creator_editor_relationships", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  editorId: uuid("editor_id").references(() => users.id).notNull(),
  status: text("status").default("active").notNull(), // active, terminated
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  email: text("email").notNull(),
  projectId: uuid("project_id"), // Will reference project if it's a project-specific invite
  status: text("status").default("pending").notNull(), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags"), // or jsonb for array
  categoryId: text("category_id"),
  visibility: visibilityEnum("visibility").default("unlisted").notNull(),
  status: projectStatusEnum("status").default("active").notNull(),
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  channelId: uuid("channel_id").references(() => youtubeChannels.id), // Link to specific channel
  youtubeVideoId: text("youtube_video_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const projectFiles = pgTable("project_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  uploaderId: uuid("uploader_id").references(() => users.id).notNull(),
  r2Key: text("r2_key").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  type: fileTypeEnum("type").notNull(),
  status: fileStatusEnum("status").default("pending").notNull(),
  version: integer("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by").references(() => users.id),
});

export const thumbnails = pgTable("thumbnails", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  r2Key: text("r2_key").notNull(),
  isMain: boolean("is_main").default(false).notNull(),
  abTestStatus: text("ab_test_status").default("inactive"), // active, inactive, winner
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  projectId: uuid("project_id").references(() => projects.id),
  fileId: uuid("file_id").references(() => projectFiles.id),
  action: text("action").notNull(), // e.g., "FILE_UPLOADED", "FILE_APPROVED", "PROJECT_PUBLISHED"
  details: jsonb("details"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
