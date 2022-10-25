## After running the "migrations", run the following queries
### ALTER TABLE users ADD COLUMN createdAt TIMESTAMP DEFAULT NOW();
### ALTER TABLE users RENAME COLUMN createdAt TO "deletedAt";
 