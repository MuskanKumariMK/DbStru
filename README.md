DbStru is a modern, interactive database visualization tool designed to simplify understanding complex relational structures. Users can connect to SQL Server databases dynamically using a connection string, and the app automatically discovers tables, columns, primary keys, and foreign key relationships. Tables are displayed as draggable nodes, with relationships visually represented as arrows, making it easy to explore data dependencies. With responsive layout management, color-coded relationship types, and real-time schema updates, Dataign provides developers, analysts, and database administrators a powerful, intuitive interface to inspect, document, and optimize database structures efficiently.

frontend
npm run dev

backend
uvicorn main:app --reload
Driver={ODBC Driver 17 for SQL Server};Server=localhost\SQLEXPRESS;Database=RestoMinderDb;UID=sa;PWD=admin@123;Encrypt=no;
uvicorn app.main:app --reload