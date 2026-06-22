import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718000000000 implements MigrationInterface {
  name = 'Init1718000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // users (espelha a entidade existente; IF NOT EXISTS para conviver com
    // bancos criados anteriormente via synchronize)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "description" text NOT NULL,
        "content" text NOT NULL,
        "thumbnailUrl" text,
        "tags" text NOT NULL DEFAULT '',
        "authorId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "search_vector" tsvector GENERATED ALWAYS AS (
          to_tsvector(
            'portuguese',
            coalesce("title", '') || ' ' ||
            coalesce("description", '') || ' ' ||
            replace(coalesce("tags", ''), ',', ' ')
          )
        ) STORED,
        CONSTRAINT "UQ_posts_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_posts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_posts_author" FOREIGN KEY ("authorId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_posts_search_vector" ON "posts" USING GIN ("search_vector")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content" text NOT NULL,
        "postId" uuid,
        "authorId" uuid,
        "parentId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_comments_post" FOREIGN KEY ("postId")
          REFERENCES "posts" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comments_author" FOREIGN KEY ("authorId")
          REFERENCES "users" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comments_parent" FOREIGN KEY ("parentId")
          REFERENCES "comments" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "post_likes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "postId" uuid,
        "userId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_post_likes_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_post_likes_post_user" UNIQUE ("postId", "userId"),
        CONSTRAINT "FK_post_likes_post" FOREIGN KEY ("postId")
          REFERENCES "posts" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_post_likes_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "post_likes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comments"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_posts_search_vector"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "posts"`);
    // "users" é preservada propositalmente (tabela pré-existente).
  }
}
