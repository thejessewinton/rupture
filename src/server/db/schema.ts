import { relations, sql } from 'drizzle-orm'
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  bigint,
  serial,
  integer
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from '@auth/core/adapters'

// Necessary for Next Auth
export const users = pgTable('user', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    precision: 3
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar('image', { length: 255 })
})

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  unit: one(unit, { fields: [users.id], references: [unit.user_id] }),
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
    userIdIdx: index('accounts_userId_idx').on(account.userId)
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

// Units, Lifts, Workouts, and Sets
export const units = ['kgs', 'lbs'] as const
export const unitEmum = pgEnum('value', units)

export const unit = pgTable('unit', {
  id: serial('id').unique(),
  value: unitEmum('value').notNull().default('lbs'),
  user_id: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const lift = pgTable('lift', {
  id: serial('id').unique(),
  name: varchar('name', { length: 255 }).notNull(),
  personal_record: bigint('personal_record', { mode: 'number' }).notNull(),
  unit: unitEmum('value').notNull().default('lbs'),
  user_id: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const liftRelations = relations(lift, ({ one, many }) => ({
  user: one(users, { fields: [lift.user_id], references: [users.id] }),
  exercise: many(exercise)
}))

export const workout = pgTable('workout', {
  id: serial('id').unique(),
  name: varchar('name', { length: 255 }).notNull(),
  user_id: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

export const workoutRelations = relations(workout, ({ one, many }) => ({
  user: one(users, { fields: [workout.user_id], references: [users.id] }),
  exercises: many(exercise)
}))

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const dayEnum = pgEnum('day', days)

export const exercise = pgTable('exercise', {
  id: serial('id').unique(),
  user_id: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  sets: bigint('sets', { mode: 'number' }).notNull(),
  reps: bigint('reps', { mode: 'number' }).notNull(),
  percentage: bigint('percentage', { mode: 'number' }).notNull(),
  day: dayEnum('day').notNull().default('Monday'),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  workout_id: bigint('workout_id', { mode: 'number' }).references(() => workout.id),
  lift_id: bigint('lift_id', { mode: 'number' }).references(() => lift.id)
})

export const exerciseRelations = relations(exercise, ({ many, one }) => ({
  user: one(users, { fields: [exercise.user_id], references: [users.id] }),
  workout: one(workout, { fields: [exercise.workout_id], references: [workout.id] }),
  lift: one(lift, { fields: [exercise.lift_id], references: [lift.id] })
}))
