import { relations, sql } from 'drizzle-orm'
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  bigint,
  boolean
} from 'drizzle-orm/mysql-core'
import type { AdapterAccount } from '@auth/core/adapters'
import { nanoid } from 'nanoid'

// Necessary for Next Auth
export const users = mysqlTable('user', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    fsp: 3
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar('image', { length: 255 }),
  team_id: bigint('team_id', { mode: 'number' }).references(() => team.id)
})

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  membership: one(members, { fields: [users.id], references: [members.user_id] }),
  team: one(team, { fields: [users.team_id], references: [team.id] })
}))

export const accounts = mysqlTable(
  'account',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 })
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId]
    }),
    userIdIdx: index('accounts_userId_idx').on(account.userId)
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] })
}))

export const sessions = mysqlTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId)
  })
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))

export const verificationTokens = mysqlTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
  })
)

// Teams, Memberships, and Plans
export const team = mysqlTable(
  'team',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
    created_at: timestamp('created_at', { mode: 'date', fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    seats: int('seats').notNull().default(1)
  },
  (table) => {
    return {
      slugIdx: index('team_slug_idx').on(table.slug)
    }
  }
)

export const teamRelations = relations(team, ({ many, one }) => ({
  members: many(members),
  domains: many(domain),
  api_key: one(apiKeys),
  subscription: one(subscription, { fields: [team.id], references: [subscription.team_id] })
}))

export const invite = mysqlTable('invite', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  team_id: bigint('team_id', { mode: 'number' })
    .notNull()
    .references(() => team.id),
  created_at: timestamp('created_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const MemberRoleEnum = ['superadmin', 'admin', 'member'] as const

export const members = mysqlTable('membership', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  user_id: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  team_id: bigint('team_id', { mode: 'number' })
    .notNull()
    .references(() => team.id),
  role: mysqlEnum('role', MemberRoleEnum).notNull().default('member'),
  created_at: timestamp('created_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const membershipRelations = relations(members, ({ one, many }) => ({
  user: many(users),
  team: one(team, { fields: [members.team_id], references: [team.id] })
}))

export const apiKeys = mysqlTable('api_key', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  team_id: bigint('team_id', { mode: 'number' })
    .notNull()
    .references(() => team.id),
  key: varchar('key', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  team: one(team, { fields: [apiKeys.team_id], references: [team.id] }),
  subscription: one(subscription, { fields: [apiKeys.team_id], references: [subscription.team_id] })
}))

export const subscription = mysqlTable('subscription', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  team_id: bigint('team_id', { mode: 'number' })
    .notNull()
    .references(() => team.id),
  stripe_subscription_id: varchar('key', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  team: one(team, { fields: [subscription.team_id], references: [team.id] }),
  subscription: one(subscription)
}))

// Projects
export const project = mysqlTable('project', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  domain_name: varchar('domain_name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at', { mode: 'date', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`),
  team_id: bigint('team_id', { mode: 'number' })
    .notNull()
    .references(() => team.id)
})

export const projectRelations = relations(project, ({ one, many }) => ({
  domain: one(domain),
  team: one(team),
  cookies: many(cookie)
}))

export const domain = mysqlTable('domain', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  domain_name: varchar('domain_name', { length: 255 }).notNull(),
  is_verified: boolean('is_verified').notNull().default(false),
  created_at: timestamp('created_at', { mode: 'date', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`),
  project_id: bigint('project_id', { mode: 'number' })
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  team_id: bigint('team_id', { mode: 'number' })
    .notNull()
    .references(() => team.id, { onDelete: 'cascade' })
})

export const domainRelations = relations(domain, ({ one }) => ({
  team: one(team, { fields: [domain.team_id], references: [team.id] }),
  project: one(project, { fields: [domain.project_id], references: [project.id] })
}))

export const cookie = mysqlTable('cookie', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 255 }).notNull(),
  path: varchar('path', { length: 255 }).notNull(),
  secure: boolean('secure').notNull(),
  session: boolean('session').notNull(),
  project_id: bigint('project_id', { mode: 'number' }).references(() => project.id, { onDelete: 'cascade' })
})

export const cookieRelations = relations(cookie, ({ one }) => ({
  project: one(project, {
    fields: [cookie.project_id],
    references: [project.id]
  })
}))
