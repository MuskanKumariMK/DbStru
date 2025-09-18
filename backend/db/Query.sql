-- Create database (no IF NOT EXISTS in SQL Server)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'employee')
BEGIN
    CREATE DATABASE employee;
END;
GO

USE employee;
GO

-- Table 1: departments
IF OBJECT_ID('departments', 'U') IS NULL
BEGIN
    CREATE TABLE departments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
END;
GO

-- Table 2: employees
IF OBJECT_ID('employees', 'U') IS NULL
BEGIN
    CREATE TABLE employees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        department_id INT NULL,
        CONSTRAINT FK_Employee_Department FOREIGN KEY (department_id) 
            REFERENCES departments(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
    );
END;
GO

-- Table 3: salaries
IF OBJECT_ID('salaries', 'U') IS NULL
BEGIN
    CREATE TABLE salaries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        employee_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NULL,
        CONSTRAINT FK_Salary_Employee FOREIGN KEY (employee_id) 
            REFERENCES employees(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );
END;
GO

-- Insert sample data
INSERT INTO departments (name) VALUES ('HR'), ('Engineering'), ('Finance');

INSERT INTO employees (name, email, department_id) VALUES
('Alice', 'alice@example.com', 1),
('Bob', 'bob@example.com', 2),
('Charlie', 'charlie@example.com', 2);

INSERT INTO salaries (employee_id, amount, from_date, to_date) VALUES
(1, 50000, '2025-01-01', NULL),
(2, 70000, '2025-01-01', NULL),
(3, 65000, '2025-01-01', NULL);
GO
