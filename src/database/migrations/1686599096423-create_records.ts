import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateRecords1686599096423 implements MigrationInterface {
    tableName = 'records';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE ${this.tableName} (
                id SERIAL PRIMARY KEY,
                operation_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                amount INTEGER NOT NULL,
                user_balance INTEGER NOT NULL,
                operation_response VARCHAR(255) NOT NULL,
                is_deleted BOOLEAN DEFAULT false,
                date TIMESTAMP NOT NULL,
                FOREIGN KEY (operation_id) REFERENCES operations(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "${this.tableName}"`);
    }
}
