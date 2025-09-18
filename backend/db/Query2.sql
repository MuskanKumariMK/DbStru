-- Create database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'employee')
BEGIN
    CREATE DATABASE employee;
END;
GO

USE employee;
GO

-------------------------------
-- Table 1: departments
-------------------------------
IF OBJECT_ID('departments', 'U') IS NULL
BEGIN
    CREATE TABLE departments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        location VARCHAR(100) NULL
    );
END;
GO

-------------------------------
-- Table 2: employees
-------------------------------
IF OBJECT_ID('employees', 'U') IS NULL
BEGIN
    CREATE TABLE employees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        hire_date DATE NOT NULL DEFAULT GETDATE(),
        department_id INT NULL,
        manager_id INT NULL, -- self reference (employee reports to another employee)

        CONSTRAINT FK_Employee_Department FOREIGN KEY (department_id) 
            REFERENCES departments(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE,

        -- Self reference: must use NO ACTION to avoid multiple cascade paths
        CONSTRAINT FK_Employee_Manager FOREIGN KEY (manager_id)
            REFERENCES employees(id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
    );
END;
GO

-------------------------------
-- Table 3: salaries
-------------------------------
IF OBJECT_ID('salaries', 'U') IS NULL
BEGIN
    CREATE TABLE salaries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        employee_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
        from_date DATE NOT NULL,
        to_date DATE NULL,
        CONSTRAINT FK_Salary_Employee FOREIGN KEY (employee_id) 
            REFERENCES employees(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );
END;
GO

-------------------------------
-- Table 4: projects
-------------------------------
IF OBJECT_ID('projects', 'U') IS NULL
BEGIN
    CREATE TABLE projects (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NULL,
        department_id INT NOT NULL,
        CONSTRAINT FK_Project_Department FOREIGN KEY (department_id)
            REFERENCES departments(id)
            ON DELETE CASCADE
    );
END;
GO

-------------------------------
-- Table 5: employee_projects (junction for many-to-many)
-------------------------------
IF OBJECT_ID('employee_projects', 'U') IS NULL
BEGIN
    CREATE TABLE employee_projects (
        employee_id INT NOT NULL,
        project_id INT NOT NULL,
        role VARCHAR(50) NOT NULL,
        PRIMARY KEY (employee_id, project_id),
        CONSTRAINT FK_EmpProj_Employee FOREIGN KEY (employee_id)
            REFERENCES employees(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_EmpProj_Project FOREIGN KEY (project_id)
            REFERENCES projects(id)
            ON DELETE CASCADE
    );
END;
GO

-------------------------------
-- Table 6: performance_reviews
-------------------------------
IF OBJECT_ID('performance_reviews', 'U') IS NULL
BEGIN
    CREATE TABLE performance_reviews (
        id INT IDENTITY(1,1) PRIMARY KEY,
        employee_id INT NOT NULL,
        review_date DATE NOT NULL DEFAULT GETDATE(),
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comments VARCHAR(255) NULL,
        CONSTRAINT FK_Review_Employee FOREIGN KEY (employee_id)
            REFERENCES employees(id)
            ON DELETE CASCADE
    );
END;
GO

-------------------------------
-- Insert sample data
-------------------------------
-- Departments
INSERT INTO departments (name, location) 
VALUES ('HR', 'New York'), 
       ('Engineering', 'San Francisco'), 
       ('Finance', 'Chicago');

-- Employees
INSERT INTO employees (name, email, department_id, manager_id) VALUES
('Alice', 'alice@example.com', 1, NULL),     -- HR
('Bob', 'bob@example.com', 2, NULL),         -- Engineering (manager)
('Charlie', 'charlie@example.com', 2, 2),    -- Eng, reports to Bob
('David', 'david@example.com', 3, NULL);     -- Finance

-- Salaries
INSERT INTO salaries (employee_id, amount, from_date, to_date) VALUES
(1, 50000, '2025-01-01', NULL),
(2, 90000, '2025-01-01', NULL),
(3, 65000, '2025-01-01', NULL),
(4, 70000, '2025-01-01', NULL);

-- Projects
INSERT INTO projects (name, start_date, end_date, department_id) VALUES
('Payroll System', '2025-01-01', NULL, 3), 
('AI Research', '2025-02-01', NULL, 2);

-- Employee ↔ Projects
INSERT INTO employee_projects (employee_id, project_id, role) VALUES
(2, 2, 'Lead'),
(3, 2, 'Developer'),
(4, 1, 'Analyst');

-- Performance Reviews
INSERT INTO performance_reviews (employee_id, review_date, rating, comments) VALUES
(1, '2025-03-01', 4, 'Great HR leadership'),
(2, '2025-03-01', 5, 'Outstanding technical skills'),
(3, '2025-03-01', 3, 'Needs improvement in deadlines'),
(4, '2025-03-01', 4, 'Strong financial analysis');
GO
