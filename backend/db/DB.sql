USE employee;
-- List All tables
/*
SELECT TABLE_SCHEMA , TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER By TABLE_SCHEMA, TABLE_NAME
*/

-- List All Columns for each tables 
/*
SELECT 
 TABLE_SCHEMA,
 TABLE_NAME,
 COLUMN_NAME,
 DATA_TYPE,
 CHARACTER_MAXIMUM_LENGTH,
 IS_NULLABLE,
 COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
ORDER BY TABLE_SCHEMA,TABLE_NAME,ORDINAL_POSITION
*/

-- Get primary Key 
/* SELECT 
    kcu.TABLE_SCHEMA,
    kcu.TABLE_NAME,
    kcu.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
ORDER BY kcu.TABLE_SCHEMA, kcu.TABLE_NAME;
*/ 

-- Get foreign Key 
/*

SELECT 
    fk.TABLE_SCHEMA AS FK_SCHEMA,
    fk.TABLE_NAME AS FK_TABLE,
    fk.COLUMN_NAME AS FK_COLUMN,
    pk.TABLE_SCHEMA AS PK_SCHEMA,
    pk.TABLE_NAME AS PK_TABLE,
    pk.COLUMN_NAME AS PK_COLUMN,
    rc.CONSTRAINT_NAME AS FK_CONSTRAINT
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE fk
    ON rc.CONSTRAINT_NAME = fk.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE pk
    ON rc.UNIQUE_CONSTRAINT_NAME = pk.CONSTRAINT_NAME
ORDER BY fk.TABLE_NAME;
*/
-- Get Unique Constraints / Indexes
/*
SELECT 
    tc.TABLE_SCHEMA,
    tc.TABLE_NAME,
    kcu.COLUMN_NAME,
    tc.CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE IN ('UNIQUE', 'PRIMARY KEY')
ORDER BY tc.TABLE_NAME, kcu.ORDINAL_POSITION;
*/
-- Get Column Comments / Descriptions
/*
SELECT 
    t.name AS table_name,
    c.name AS column_name,
    ep.value AS column_description
FROM sys.tables t
JOIN sys.columns c ON t.object_id = c.object_id
LEFT JOIN sys.extended_properties ep 
    ON t.object_id = ep.major_id AND c.column_id = ep.minor_id
    AND ep.name = 'MS_Description'
ORDER BY t.name, c.column_id;
*/
-- Get Row Counts
/*
SELECT 
    t.name AS table_name,
    SUM(p.rows) AS row_count
FROM sys.tables t
JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0,1)
GROUP BY t.name
ORDER BY t.name;
*/
-- Detect Many-to-Many Junction Tables
/*
SELECT 
    t.name AS table_name,
    COUNT(fk.parent_object_id) AS foreign_key_count
FROM sys.tables t
JOIN sys.foreign_keys fk ON t.object_id = fk.parent_object_id
GROUP BY t.name
HAVING COUNT(fk.parent_object_id) > 1;
*/

-- Sample Data for Tables
/* SELECT  * FROM INFORMATION_SCHEMA.TABLES;
SELECT TOP 5 * FROM employees;
SELECT TOP 5 * FROM departments;
SELECT TOP 5 * FROM salaries;
SELECT TOP 5 * FROM projects;
SELECT TOP 5 * FROM employee_projects;
SELECT TOP 5 * FROM performance_reviews;
*/
