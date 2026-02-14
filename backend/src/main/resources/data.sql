-- Initial data for testing
INSERT INTO users (id, email, password, first_name, last_name, role, active, email_verified, created_at, updated_at) 
VALUES 
('admin-001', 'admin@renteasy.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', 'ADMIN', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-001', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'John', 'Doe', 'USER', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample categories
-- Electronics, Outdoor, Sports, Party, Tools, Vehicles, Real Estate, Events
