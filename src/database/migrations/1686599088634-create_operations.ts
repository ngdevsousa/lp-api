import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateOperations1686599088634 implements MigrationInterface {
    tableName = 'operations';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
              CREATE TABLE ${this.tableName} (
                  id SERIAL PRIMARY KEY,
                  type VARCHAR(20) NOT NULL,
                  cost INTEGER NOT NULL
              );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "${this.tableName}"`);
    }
}
