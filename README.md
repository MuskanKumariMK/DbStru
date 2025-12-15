DbStru

DbStru is a modern, interactive database visualization tool designed to simplify the understanding of complex relational database structures.

It allows users to connect dynamically to SQL Server databases using a connection string and automatically discovers:

Tables

Columns

Primary Keys

Foreign Key relationships

The tool visualizes database objects as draggable nodes, with relationships rendered as directional arrows, making data dependencies easy to explore and understand.

With a responsive layout, color-coded relationship types, and real-time schema updates, DbStru provides developers, analysts, and database administrators with a powerful and intuitive interface to inspect, document, and optimize database structures efficiently.

🚀 Features

Dynamic SQL Server connection using connection string

Automatic schema discovery (tables, columns, PKs, FKs)

Interactive, draggable table nodes

Visual representation of relationships using arrows

Color-coded relationship types for clarity

Real-time schema updates

Responsive and user-friendly UI

Ideal for developers, DBAs, and data analysts

🛠️ Tech Stack
Frontend

Modern JavaScript framework

Interactive graph-based UI

Responsive layout

Backend

Python (FastAPI)

SQL Server integration via ODBC

Real-time schema processing

▶️ Getting Started
Frontend
npm install
npm run dev

Backend
uvicorn app.main:app --reload


or (alternative entry point):

uvicorn main:app --reload

🔑 Database Connection Example
Driver={ODBC Driver 17 for SQL Server};
Server=localhost;
Database=ABC;
UID=sa;
PWD=YOUR_PWD@123;
Encrypt=no;




⚠️ Security Note:
