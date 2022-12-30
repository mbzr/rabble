import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void[]> {
  // First ensure uuid extension is installed.
  return await knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(function () {
      return Promise.all([
        knex.schema.createTable('users', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
          table.text('display_name').notNullable()
          table.text('email').notNullable()
          table.boolean('email_verified').nullable()
          table.text('password').notNullable()
          table.text('profile_photo').nullable()
          table.date('created_at').notNullable()
          table.date('modified_at').nullable()
          table.date('last_login_at').nullable()
          table.text('role').notNullable()
          table.date('banned_at').nullable()
          table.date('password_updated_at').nullable()
          table.text('timezone').notNullable()
        }),
        knex.schema.createTable('users_settings', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
          table.uuid('user_id').unsigned().references('id').inTable('users')
          table
            .json('notifications')
            .defaultTo('{ "newsletter": true }')
            .notNullable()
        }),
        knex.schema.createTable('courses', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
          table.text('name').notNullable()
          table.text('slug').notNullable()
          table.text('description').nullable()
          table.date('created_at').notNullable()
          table.date('modified_at').nullable()
          table.date('deleted_at').nullable()
          table.text('cover_photo').nullable()
          table.boolean('is_private').notNullable()
          table.boolean('is_archived').notNullable()
          table.boolean('is_premium').notNullable()
          table.uuid('owner_id').unsigned().references('id').inTable('users')
          table.text('vimeo_folder_uri').notNullable()
          table.text('level').notNullable()
        }),
        knex.schema.createTable('users_courses', (table) => {
          table.uuid('course_id').unsigned().references('id').inTable('courses')
          table.uuid('user_id').unsigned().references('id').inTable('users')
          table.date('created_at').notNullable()
          table.boolean('is_owner').notNullable()
          table.boolean('is_member').notNullable()
          table.boolean('receive_notifications').notNullable()
        }),
        knex.schema.createTable('lessons', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
          table.uuid('course_id').unsigned().references('id').inTable('courses')
          table.text('name').notNullable()
          table.text('slug').notNullable()
          table.text('description').notNullable()
          table.boolean('is_private').notNullable()
          table.date('created_at').notNullable()
          table.date('modified_at').nullable()
          table.boolean('is_archived').notNullable()
          table
            .json('video')
            .defaultTo(
              '{ "id": 0, "width": 0, "height": 0, "duration": 0, "size": 0, "uri": "" }'
            )
            .notNullable()
        }),
        knex.schema.createTable('users_lessons', (table) => {
          table.uuid('lesson_id').unsigned().references('id').inTable('lessons')
          table.uuid('user_id').unsigned().references('id').inTable('users')
          table.date('created_at').notNullable()
          table.date('completed_at').nullable()
          table.boolean('is_owner').notNullable()
          table.boolean('is_member').notNullable()
        }),
      ])
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('users_settings')
    .dropTable('users_courses')
    .dropTable('users_lessons')
    .dropTable('lessons')
    .dropTable('courses')
    .dropTable('users')
}
