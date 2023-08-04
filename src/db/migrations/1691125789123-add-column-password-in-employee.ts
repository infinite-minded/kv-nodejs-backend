import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnPasswordInEmployee1691125789123 implements MigrationInterface {
    name = 'AddColumnPasswordInEmployee1691125789123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "password"`);
    }

}
