import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUsers1686599078806 implements MigrationInterface {
    tableName = 'users';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                CREATE TABLE ${this.tableName} (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    balance INTEGER NOT NULL
              );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "${this.tableName}"`);
    }
}
