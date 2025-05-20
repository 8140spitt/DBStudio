-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema dbstudio
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `dbstudio` ;

-- -----------------------------------------------------
-- Schema dbstudio
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dbstudio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `dbstudio` ;

-- -----------------------------------------------------
-- Table `people`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `people` ;

CREATE TABLE IF NOT EXISTS `people` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `prefix` VARCHAR(10) NULL DEFAULT '',
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `middle_name` VARCHAR(255) NULL DEFAULT '',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `person_id` BIGINT UNSIGNED NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_person`
    FOREIGN KEY (`person_id`)
    REFERENCES `people` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_users_person_id` ON `users` (`person_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `credentials`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `credentials` ;

CREATE TABLE IF NOT EXISTS `credentials` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `credential_type` VARCHAR(255) NOT NULL,
  `credential_value` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_credentials_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_credentials_user_id` ON `credentials` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_connections`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_connections` ;

CREATE TABLE IF NOT EXISTS `db_connections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `host` VARCHAR(255) NOT NULL,
  `port` BIGINT UNSIGNED NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `database` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_connections_name` ON `db_connections` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_host` ON `db_connections` (`host` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_port` ON `db_connections` (`port` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_username` ON `db_connections` (`username` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_password` ON `db_connections` (`password` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_database` ON `db_connections` (`database` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_created_at` ON `db_connections` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_connections_updated_at` ON `db_connections` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_connection_errors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_connection_errors` ;

CREATE TABLE IF NOT EXISTS `db_connection_errors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `error` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_connection_errors_connection`
    FOREIGN KEY (`db_connection_id`)
    REFERENCES `db_connections` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_connection_errors_db_connection_id` ON `db_connection_errors` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_connection_errors_error` ON `db_connection_errors` (`error` ASC) VISIBLE;

CREATE INDEX `idx_db_connection_errors_created_at` ON `db_connection_errors` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_connection_errors_updated_at` ON `db_connection_errors` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_connection_logs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_connection_logs` ;

CREATE TABLE IF NOT EXISTS `db_connection_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `query` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_connection_logs_db_connection_id` ON `db_connection_logs` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_connection_logs_query` ON `db_connection_logs` (`query` ASC) VISIBLE;

CREATE INDEX `idx_db_connection_logs_created_at` ON `db_connection_logs` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_connection_logs_updated_at` ON `db_connection_logs` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_migrations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_migrations` ;

CREATE TABLE IF NOT EXISTS `db_migrations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `version` VARCHAR(255) NOT NULL,
  `up_sql` TEXT NOT NULL,
  `down_sql` TEXT NOT NULL,
  `applied_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `db_privileges`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_privileges` ;

CREATE TABLE IF NOT EXISTS `db_privileges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(255) NOT NULL,
  `privilege` VARCHAR(255) NOT NULL,
  `table_name` VARCHAR(255) NULL DEFAULT NULL,
  `granted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `db_query_logs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_query_logs` ;

CREATE TABLE IF NOT EXISTS `db_query_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `query_type` ENUM('DDL', 'DML', 'DQL', 'DCL', 'TCL') NOT NULL,
  `action` ENUM('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'SAVEPOINT', 'TRUNCATE', 'CALL', 'EXPLAIN', 'DESCRIBE', 'SHOW') NOT NULL,
  `object_name` VARCHAR(255) NULL DEFAULT NULL,
  `columns_involved` TEXT NULL DEFAULT NULL,
  `values_involved` TEXT NULL DEFAULT NULL,
  `conditions` TEXT NULL DEFAULT NULL,
  `raw_query` TEXT NOT NULL,
  `structured` JSON NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_query_logs_db_connection_id` ON `db_query_logs` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_query_logs_created_at` ON `db_query_logs` (`created_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_query_errors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_query_errors` ;

CREATE TABLE IF NOT EXISTS `db_query_errors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_query_log_id` BIGINT UNSIGNED NOT NULL,
  `error` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_query_errors_log`
    FOREIGN KEY (`db_query_log_id`)
    REFERENCES `db_query_logs` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_query_errors_db_query_log_id` ON `db_query_errors` (`db_query_log_id` ASC) VISIBLE;

CREATE INDEX `idx_db_query_errors_created_at` ON `db_query_errors` (`created_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_query_results`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_query_results` ;

CREATE TABLE IF NOT EXISTS `db_query_results` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_query_log_id` BIGINT UNSIGNED NOT NULL,
  `result` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_query_results_log`
    FOREIGN KEY (`db_query_log_id`)
    REFERENCES `db_query_logs` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_query_results_db_query_log_id` ON `db_query_results` (`db_query_log_id` ASC) VISIBLE;

CREATE INDEX `idx_db_query_results_created_at` ON `db_query_results` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_query_results_updated_at` ON `db_query_results` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_role_assignments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_role_assignments` ;

CREATE TABLE IF NOT EXISTS `db_role_assignments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_user_id` BIGINT UNSIGNED NOT NULL,
  `db_role_id` BIGINT UNSIGNED NOT NULL,
  `granted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `db_roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_roles` ;

CREATE TABLE IF NOT EXISTS `db_roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `db_schemas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schemas` ;

CREATE TABLE IF NOT EXISTS `db_schemas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schemas_connection`
    FOREIGN KEY (`db_connection_id`)
    REFERENCES `db_connections` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schemas_db_connection_id` ON `db_schemas` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schemas_name` ON `db_schemas` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_schemas_created_at` ON `db_schemas` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_schemas_updated_at` ON `db_schemas` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_exports`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_exports` ;

CREATE TABLE IF NOT EXISTS `db_schema_exports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_id` BIGINT UNSIGNED NOT NULL,
  `format` VARCHAR(20) NOT NULL,
  `exported_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `filename` VARCHAR(255) NULL DEFAULT '',
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_exports_schema`
    FOREIGN KEY (`db_schema_id`)
    REFERENCES `db_schemas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_exports_schema_id` ON `db_schema_exports` (`db_schema_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_exports_format` ON `db_schema_exports` (`format` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_procedures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_procedures` ;

CREATE TABLE IF NOT EXISTS `db_schema_procedures` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `definition` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_procedures_schema`
    FOREIGN KEY (`db_schema_id`)
    REFERENCES `db_schemas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_procedures_db_schema_id` ON `db_schema_procedures` (`db_schema_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_procedures_name` ON `db_schema_procedures` (`name` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_tables`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_tables` ;

CREATE TABLE IF NOT EXISTS `db_schema_tables` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_tables_schema`
    FOREIGN KEY (`db_schema_id`)
    REFERENCES `db_schemas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_tables_db_schema_id` ON `db_schema_tables` (`db_schema_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_tables_name` ON `db_schema_tables` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_tables_created_at` ON `db_schema_tables` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_tables_updated_at` ON `db_schema_tables` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_table_checks`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_table_checks` ;

CREATE TABLE IF NOT EXISTS `db_schema_table_checks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_table_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `expression` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_table_checks_table`
    FOREIGN KEY (`db_schema_table_id`)
    REFERENCES `db_schema_tables` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_table_checks_table_id` ON `db_schema_table_checks` (`db_schema_table_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_table_columns`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_table_columns` ;

CREATE TABLE IF NOT EXISTS `db_schema_table_columns` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_table_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `length` BIGINT UNSIGNED NULL DEFAULT NULL,
  `precision` BIGINT UNSIGNED NULL DEFAULT NULL,
  `scale` BIGINT UNSIGNED NULL DEFAULT NULL,
  `default` VARCHAR(255) NULL DEFAULT NULL,
  `not_null` BIGINT UNSIGNED NULL DEFAULT NULL,
  `auto_increment` BIGINT UNSIGNED NULL DEFAULT NULL,
  `primary_key` BIGINT UNSIGNED NULL DEFAULT NULL,
  `unique` BIGINT UNSIGNED NULL DEFAULT NULL,
  `unsigned` BIGINT UNSIGNED NULL DEFAULT NULL,
  `references` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_table_columns_table`
    FOREIGN KEY (`db_schema_table_id`)
    REFERENCES `db_schema_tables` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_table_columns_db_schema_table_id` ON `db_schema_table_columns` (`db_schema_table_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_name` ON `db_schema_table_columns` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_type` ON `db_schema_table_columns` (`type` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_length` ON `db_schema_table_columns` (`length` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_precision` ON `db_schema_table_columns` (`precision` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_scale` ON `db_schema_table_columns` (`scale` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_default` ON `db_schema_table_columns` (`default` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_not_null` ON `db_schema_table_columns` (`not_null` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_auto_increment` ON `db_schema_table_columns` (`auto_increment` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_primary_key` ON `db_schema_table_columns` (`primary_key` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_unique` ON `db_schema_table_columns` (`unique` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_unsigned` ON `db_schema_table_columns` (`unsigned` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_references` ON `db_schema_table_columns` (`references` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_created_at` ON `db_schema_table_columns` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_columns_updated_at` ON `db_schema_table_columns` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_table_foreign_keys`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_table_foreign_keys` ;

CREATE TABLE IF NOT EXISTS `db_schema_table_foreign_keys` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_table_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `columns` VARCHAR(255) NOT NULL,
  `references` VARCHAR(255) NOT NULL,
  `on_delete` VARCHAR(255) NOT NULL,
  `on_update` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_table_foreign_keys_table`
    FOREIGN KEY (`db_schema_table_id`)
    REFERENCES `db_schema_tables` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_table_foreign_keys_db_schema_table_id` ON `db_schema_table_foreign_keys` (`db_schema_table_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_name` ON `db_schema_table_foreign_keys` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_columns` ON `db_schema_table_foreign_keys` (`columns` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_references` ON `db_schema_table_foreign_keys` (`references` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_on_delete` ON `db_schema_table_foreign_keys` (`on_delete` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_on_update` ON `db_schema_table_foreign_keys` (`on_update` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_created_at` ON `db_schema_table_foreign_keys` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_foreign_keys_updated_at` ON `db_schema_table_foreign_keys` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_table_indexes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_table_indexes` ;

CREATE TABLE IF NOT EXISTS `db_schema_table_indexes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_table_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `columns` VARCHAR(255) NOT NULL,
  `unique` BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_table_indexes_table`
    FOREIGN KEY (`db_schema_table_id`)
    REFERENCES `db_schema_tables` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_table_indexes_db_schema_table_id` ON `db_schema_table_indexes` (`db_schema_table_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_indexes_name` ON `db_schema_table_indexes` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_indexes_columns` ON `db_schema_table_indexes` (`columns` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_indexes_unique` ON `db_schema_table_indexes` (`unique` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_indexes_created_at` ON `db_schema_table_indexes` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_indexes_updated_at` ON `db_schema_table_indexes` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_table_triggers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_table_triggers` ;

CREATE TABLE IF NOT EXISTS `db_schema_table_triggers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_table_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `event` VARCHAR(255) NOT NULL,
  `timing` VARCHAR(255) NOT NULL,
  `statement` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_table_triggers_table`
    FOREIGN KEY (`db_schema_table_id`)
    REFERENCES `db_schema_tables` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_table_triggers_db_schema_table_id` ON `db_schema_table_triggers` (`db_schema_table_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_triggers_name` ON `db_schema_table_triggers` (`name` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_triggers_event` ON `db_schema_table_triggers` (`event` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_triggers_timing` ON `db_schema_table_triggers` (`timing` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_triggers_statement` ON `db_schema_table_triggers` (`statement` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_triggers_created_at` ON `db_schema_table_triggers` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_table_triggers_updated_at` ON `db_schema_table_triggers` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_schema_views`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_schema_views` ;

CREATE TABLE IF NOT EXISTS `db_schema_views` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_schema_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `definition` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_schema_views_schema`
    FOREIGN KEY (`db_schema_id`)
    REFERENCES `db_schemas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_schema_views_db_schema_id` ON `db_schema_views` (`db_schema_id` ASC) VISIBLE;

CREATE INDEX `idx_db_schema_views_name` ON `db_schema_views` (`name` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_users` ;

CREATE TABLE IF NOT EXISTS `db_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_users_connection`
    FOREIGN KEY (`db_connection_id`)
    REFERENCES `db_connections` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_users_db_connection_id` ON `db_users` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_users_username` ON `db_users` (`username` ASC) VISIBLE;

CREATE INDEX `idx_db_users_password` ON `db_users` (`password` ASC) VISIBLE;

CREATE INDEX `idx_db_users_created_at` ON `db_users` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_users_updated_at` ON `db_users` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_user_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_user_activity` ;

CREATE TABLE IF NOT EXISTS `db_user_activity` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_user_id` BIGINT UNSIGNED NOT NULL,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `activity_type` VARCHAR(255) NOT NULL,
  `activity_details` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_user_activity_connection`
    FOREIGN KEY (`db_connection_id`)
    REFERENCES `db_connections` (`id`),
  CONSTRAINT `fk_db_user_activity_user`
    FOREIGN KEY (`db_user_id`)
    REFERENCES `db_users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_user_activity_db_user_id` ON `db_user_activity` (`db_user_id` ASC) VISIBLE;

CREATE INDEX `idx_db_user_activity_db_connection_id` ON `db_user_activity` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_user_activity_activity_type` ON `db_user_activity` (`activity_type` ASC) VISIBLE;

CREATE INDEX `idx_db_user_activity_activity_details` ON `db_user_activity` (`activity_details`(255) ASC) VISIBLE;

CREATE INDEX `idx_db_user_activity_created_at` ON `db_user_activity` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_user_activity_updated_at` ON `db_user_activity` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `db_user_permissions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_user_permissions` ;

CREATE TABLE IF NOT EXISTS `db_user_permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `db_user_id` BIGINT UNSIGNED NOT NULL,
  `db_connection_id` BIGINT UNSIGNED NOT NULL,
  `permission` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_db_user_permissions_connection`
    FOREIGN KEY (`db_connection_id`)
    REFERENCES `db_connections` (`id`),
  CONSTRAINT `fk_db_user_permissions_user`
    FOREIGN KEY (`db_user_id`)
    REFERENCES `db_users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_db_user_permissions_db_user_id` ON `db_user_permissions` (`db_user_id` ASC) VISIBLE;

CREATE INDEX `idx_db_user_permissions_db_connection_id` ON `db_user_permissions` (`db_connection_id` ASC) VISIBLE;

CREATE INDEX `idx_db_user_permissions_permission` ON `db_user_permissions` (`permission` ASC) VISIBLE;

CREATE INDEX `idx_db_user_permissions_created_at` ON `db_user_permissions` (`created_at` ASC) VISIBLE;

CREATE INDEX `idx_db_user_permissions_updated_at` ON `db_user_permissions` (`updated_at` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `workspaces`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `workspaces` ;

CREATE TABLE IF NOT EXISTS `workspaces` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `projects`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `projects` ;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `workspace_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_projects_workspace`
    FOREIGN KEY (`workspace_id`)
    REFERENCES `workspaces` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_projects_workspace_id` ON `projects` (`workspace_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `project_members`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project_members` ;

CREATE TABLE IF NOT EXISTS `project_members` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_project_members_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`id`),
  CONSTRAINT `fk_project_members_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_project_members_project_id` ON `project_members` (`project_id` ASC) VISIBLE;

CREATE INDEX `idx_project_members_user_id` ON `project_members` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `tasks`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tasks` ;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT '',
  `assignee_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` TIMESTAMP NULL DEFAULT NULL,
  `priority` VARCHAR(255) NULL DEFAULT 'low',
  `status` VARCHAR(255) NULL DEFAULT 'todo',
  `parent_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tasks_assignee`
    FOREIGN KEY (`assignee_id`)
    REFERENCES `users` (`id`),
  CONSTRAINT `fk_tasks_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `tasks` (`id`),
  CONSTRAINT `fk_tasks_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_tasks_project_id` ON `tasks` (`project_id` ASC) VISIBLE;

CREATE INDEX `idx_tasks_assignee_id` ON `tasks` (`assignee_id` ASC) VISIBLE;

CREATE INDEX `idx_tasks_parent_id` ON `tasks` (`parent_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `task_attachments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `task_attachments` ;

CREATE TABLE IF NOT EXISTS `task_attachments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_task_attachments_task`
    FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`id`),
  CONSTRAINT `fk_task_attachments_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_task_attachments_task_id` ON `task_attachments` (`task_id` ASC) VISIBLE;

CREATE INDEX `idx_task_attachments_user_id` ON `task_attachments` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `task_comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `task_comments` ;

CREATE TABLE IF NOT EXISTS `task_comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `comment` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_task_comments_task`
    FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`id`),
  CONSTRAINT `fk_task_comments_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_task_comments_task_id` ON `task_comments` (`task_id` ASC) VISIBLE;

CREATE INDEX `idx_task_comments_user_id` ON `task_comments` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `user_sessions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user_sessions` ;

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `session_token` VARCHAR(255) NOT NULL,
  `expires` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_sessions_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_user_sessions_user_id` ON `user_sessions` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `user_verifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user_verifications` ;

CREATE TABLE IF NOT EXISTS `user_verifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `identifier` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_verifications_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_user_verifications_user_id` ON `user_verifications` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `workspace_members`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `workspace_members` ;

CREATE TABLE IF NOT EXISTS `workspace_members` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `workspace_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_workspace_members_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`),
  CONSTRAINT `fk_workspace_members_workspace`
    FOREIGN KEY (`workspace_id`)
    REFERENCES `workspaces` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `idx_workspace_members_workspace_id` ON `workspace_members` (`workspace_id` ASC) VISIBLE;

CREATE INDEX `idx_workspace_members_user_id` ON `workspace_members` (`user_id` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
