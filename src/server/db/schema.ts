import type { AdapterAccount } from '@auth/core/adapters'
import { relations, sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'

// Necessary for Next Auth
export const users = pgTable('user', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date'
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar('image', { length: 255 })
})

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  unit: one(unit, { fields: [users.id], references: [unit.user_id] }),
  lifts: many(lift),
  composition: many(composition),
  sets: many(set)
}))

export const units = ['kgs', 'lbs'] as const
export const unitEmum = pgEnum('value', units)

export const unit = pgTable(
  'unit',
  {
    id: serial('id').primaryKey(),
    value: unitEmum('value').notNull().default('lbs'),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`)
  },
  (unit) => ({
    userIdIdx: index('unit_userId_idx').on(unit.user_id)
  })
)

export const unitRelations = relations(unit, ({ one }) => ({
  user: one(users, { fields: [unit.user_id], references: [users.id] })
}))

export const composition = pgTable('composition', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  weight: bigint('weight', { mode: 'number' }).notNull(),
  unit: unitEmum('value').notNull().default('lbs'),
  body_fat_percentage: bigint('body_fat_percentage', { mode: 'number' }).notNull(),
  created_at: timestamp('created_at', {
    mode: 'date'
  }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at', {
    mode: 'date'
  }).default(sql`CURRENT_TIMESTAMP`)
})

export const compositionRelations = relations(composition, ({ one, many }) => ({
  user: one(users, { fields: [composition.user_id], references: [users.id] }),
  sets: many(set),
  lifts: many(lift)
}))

export const accounts = pgTable(
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
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 })
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId]
    }),
    userIdIdx: index('account_userId_idx').on(account.userId)
  })
)
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] })
}))

export const sessions = pgTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId)
  })
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))

export const verificationTokens = pgTable(
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

// Lifts, Workouts, and Sets
export const lift = pgTable(
  'lift',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    personal_record: bigint('personal_record', { mode: 'number' }).notNull(),
    unit: unitEmum('value').notNull().default('lbs'),
    slug: varchar('slug', { length: 255 }).notNull(),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    composition_id: bigint('composition_id', { mode: 'number' }).references(() => composition.id),
    created_at: timestamp('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`)
  },
  (lift) => ({
    userIdIdx: index('lift_userId_idx').on(lift.user_id),
    compositionIdIdx: index('lift_compositionId_idx').on(lift.composition_id)
  })
)

export const liftRelations = relations(lift, ({ one, many }) => ({
  user: one(users, { fields: [lift.user_id], references: [users.id] }),
  composition: one(composition, { fields: [lift.composition_id], references: [composition.id] }),
  sets: many(set)
}))

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const dayEnum = pgEnum('day', days)

export const set = pgTable(
  'set',
  {
    id: serial('id').primaryKey(),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    tracked: boolean('tracked').notNull().default(false),
    reps: bigint('reps', { mode: 'number' }).notNull(),
    weight: bigint('weight', { mode: 'number' }).notNull(),
    unit: unitEmum('value').notNull().default('lbs'),
    date: timestamp('date', {
      mode: 'date'
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    notes: text('notes'),
    created_at: timestamp('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
    lift_id: bigint('lift_id', { mode: 'number' }).references(() => lift.id, { onDelete: 'cascade' }),
    composition_id: bigint('composition_id', { mode: 'number' }).references(() => composition.id)
  },
  (set) => ({
    userIdIdx: index('set_userId_idx').on(set.user_id),
    liftIdIdx: index('set_liftId_idx').on(set.lift_id),
    compositionIdIdx: index('set_compositionId_idx').on(set.composition_id)
  })
)

export const setRelations = relations(set, ({ one }) => ({
  user: one(users, { fields: [set.user_id], references: [users.id] }),
  lift: one(lift, { fields: [set.lift_id], references: [lift.id] }),
  composition: one(composition, { fields: [set.composition_id], references: [composition.id] })
}))

export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`)
})
