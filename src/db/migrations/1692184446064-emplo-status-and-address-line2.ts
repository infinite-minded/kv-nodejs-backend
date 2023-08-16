import { MigrationInterface, QueryRunner } from "typeorm";

export class EmploStatusAndAddressLine21692184446064 implements MigrationInterface {
    name = 'EmploStatusAndAddressLine21692184446064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "address" ADD "line2" character varying NOT NULL DEFAULT 'ABC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "line2"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "status"`);
    }

}
