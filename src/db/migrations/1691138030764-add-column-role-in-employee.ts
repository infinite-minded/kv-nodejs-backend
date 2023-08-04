import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnRoleInEmployee1691138030764 implements MigrationInterface {
    name = 'AddColumnRoleInEmployee1691138030764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "role" character varying NOT NULL DEFAULT 'Developer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "role"`);
    }

}
