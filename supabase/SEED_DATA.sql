-- Hestia PMS - Seed Data
-- Run AFTER migrations (including 20250606000003_add_role_permission_keys)
-- Order: 1. Permissions, 2. Roles, 3. role_permissions, 4. Departments, 5. Shifts, 6. Consumables

-- ============================================
-- 1. PERMISSIONS
-- ============================================
INSERT INTO permissions (key, name, description) VALUES
  ('view_dashboard', 'view_dashboard', 'View system dashboard'),
  ('view_rooms', 'view_rooms', 'View room details'),
  ('assign_rooms', 'assign_rooms', 'Assign rooms to staff'),
  ('update_room_status', 'update_room_status', 'Update room work status'),
  ('view_reservations', 'view_reservations', 'View reservations'),
  ('create_ticket', 'create_ticket', 'Create tickets'),
  ('update_ticket', 'update_ticket', 'Update ticket status or details'),
  ('close_ticket', 'close_ticket', 'Close tickets'),
  ('record_consumption', 'record_consumption', 'Record guest consumptions'),
  ('bill_consumption', 'bill_consumption', 'Bill guest consumptions'),
  ('report_lost_found', 'report_lost_found', 'Report lost and found items'),
  ('update_lost_found', 'update_lost_found', 'Update lost and found status'),
  ('view_room_history', 'view_room_history', 'View room activity history'),
  ('send_message', 'send_message', 'Send chat messages'),
  ('view_chats', 'view_chats', 'View chats'),
  ('manage_users', 'manage_users', 'Manage system users'),
  ('manage_roles', 'manage_roles', 'Manage roles and permissions'),
  ('system_settings', 'system_settings', 'Manage system settings')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. ROLES
-- ============================================
INSERT INTO roles (key, name, description) VALUES
  ('executive_housekeeper', 'Executive Housekeeper', 'Housekeeping'),
  ('housekeeping_manager', 'Housekeeping Manager', 'Housekeeping'),
  ('assistant_housekeeping_manager', 'Assistant Housekeeping Manager', 'Housekeeping'),
  ('housekeeping_senior_supervisor', 'Senior Supervisor', 'Housekeeping'),
  ('housekeeping_supervisor', 'Supervisor', 'Housekeeping'),
  ('housekeeping_coordinator', 'Coordinator', 'Housekeeping'),
  ('room_attendant', 'Housekeeping Room Attendant', 'Housekeeping'),
  ('houseman', 'Housekeeping Portier / Houseman', 'Housekeeping'),
  ('laundry_attendant', 'Housekeeping Laundry Attendant', 'Housekeeping'),
  ('public_area_attendant', 'Housekeeping Public Area Attendant', 'Housekeeping'),
  ('director_of_rooms', 'Director of Rooms', 'Rooms Division'),
  ('assistant_director_of_rooms', 'Assistant Director of Rooms', 'Rooms Division'),
  ('front_office_director', 'Director of Front Office', 'Front Office'),
  ('front_office_manager', 'Front Office Manager', 'Front Office'),
  ('front_office_supervisor', 'Front Office Supervisor', 'Front Office'),
  ('front_office_agent', 'Front Office Agent', 'Front Office'),
  ('front_office_trainee', 'Front Office Trainee', 'Front Office'),
  ('night_manager', 'Night Manager', 'Night Team'),
  ('night_auditor', 'Night Auditor', 'Night Team'),
  ('night_agent', 'Night Agent', 'Night Team'),
  ('engineering_director', 'Director of Engineering', 'Engineering'),
  ('engineering_supervisor', 'Engineering Supervisor', 'Engineering'),
  ('shift_engineer', 'Shift Engineer', 'Engineering'),
  ('it_admin', 'IT Manager', 'IT'),
  ('general_manager', 'General Manager', 'Management'),
  ('hotel_manager', 'Hotel Manager', 'Management')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 3. ROLE_PERMISSIONS (map permissions to roles)
-- ============================================
WITH role_perms(role_key, perm_key) AS (
  VALUES
    ('executive_housekeeper','view_dashboard'),('executive_housekeeper','view_rooms'),('executive_housekeeper','assign_rooms'),('executive_housekeeper','update_room_status'),('executive_housekeeper','create_ticket'),('executive_housekeeper','close_ticket'),('executive_housekeeper','bill_consumption'),('executive_housekeeper','update_lost_found'),('executive_housekeeper','view_room_history'),('executive_housekeeper','send_message'),('executive_housekeeper','view_chats'),
    ('housekeeping_manager','view_rooms'),('housekeeping_manager','assign_rooms'),('housekeeping_manager','update_room_status'),('housekeeping_manager','create_ticket'),('housekeeping_manager','update_ticket'),('housekeeping_manager','bill_consumption'),('housekeeping_manager','update_lost_found'),('housekeeping_manager','view_room_history'),('housekeeping_manager','send_message'),('housekeeping_manager','view_chats'),
    ('assistant_housekeeping_manager','view_rooms'),('assistant_housekeeping_manager','assign_rooms'),('assistant_housekeeping_manager','update_room_status'),('assistant_housekeeping_manager','create_ticket'),('assistant_housekeeping_manager','update_ticket'),('assistant_housekeeping_manager','update_lost_found'),('assistant_housekeeping_manager','view_room_history'),('assistant_housekeeping_manager','send_message'),('assistant_housekeeping_manager','view_chats'),
    ('housekeeping_senior_supervisor','view_rooms'),('housekeeping_senior_supervisor','assign_rooms'),('housekeeping_senior_supervisor','update_room_status'),('housekeeping_senior_supervisor','create_ticket'),('housekeeping_senior_supervisor','update_ticket'),('housekeeping_senior_supervisor','view_room_history'),('housekeeping_senior_supervisor','send_message'),('housekeeping_senior_supervisor','view_chats'),
    ('housekeeping_supervisor','view_rooms'),('housekeeping_supervisor','assign_rooms'),('housekeeping_supervisor','update_room_status'),('housekeeping_supervisor','create_ticket'),('housekeeping_supervisor','update_ticket'),('housekeeping_supervisor','send_message'),('housekeeping_supervisor','view_chats'),
    ('housekeeping_coordinator','view_rooms'),('housekeeping_coordinator','assign_rooms'),('housekeeping_coordinator','send_message'),('housekeeping_coordinator','view_chats'),
    ('room_attendant','view_rooms'),('room_attendant','update_room_status'),('room_attendant','record_consumption'),('room_attendant','report_lost_found'),('room_attendant','send_message'),('room_attendant','view_chats'),
    ('houseman','view_rooms'),('houseman','update_room_status'),('houseman','send_message'),('houseman','view_chats'),
    ('laundry_attendant','view_rooms'),('laundry_attendant','record_consumption'),('laundry_attendant','send_message'),('laundry_attendant','view_chats'),
    ('public_area_attendant','view_rooms'),('public_area_attendant','update_room_status'),('public_area_attendant','send_message'),('public_area_attendant','view_chats'),
    ('director_of_rooms','view_dashboard'),('director_of_rooms','view_rooms'),('director_of_rooms','assign_rooms'),('director_of_rooms','view_reservations'),('director_of_rooms','close_ticket'),('director_of_rooms','bill_consumption'),('director_of_rooms','view_room_history'),('director_of_rooms','send_message'),('director_of_rooms','view_chats'),
    ('assistant_director_of_rooms','view_rooms'),('assistant_director_of_rooms','assign_rooms'),('assistant_director_of_rooms','view_reservations'),('assistant_director_of_rooms','update_ticket'),('assistant_director_of_rooms','view_room_history'),('assistant_director_of_rooms','send_message'),('assistant_director_of_rooms','view_chats'),
    ('front_office_director','view_dashboard'),('front_office_director','view_rooms'),('front_office_director','view_reservations'),('front_office_director','create_ticket'),('front_office_director','close_ticket'),('front_office_director','bill_consumption'),('front_office_director','view_room_history'),('front_office_director','send_message'),('front_office_director','view_chats'),
    ('front_office_manager','view_rooms'),('front_office_manager','view_reservations'),('front_office_manager','create_ticket'),('front_office_manager','update_ticket'),('front_office_manager','bill_consumption'),('front_office_manager','send_message'),('front_office_manager','view_chats'),
    ('front_office_supervisor','view_rooms'),('front_office_supervisor','view_reservations'),('front_office_supervisor','create_ticket'),('front_office_supervisor','update_ticket'),('front_office_supervisor','send_message'),('front_office_supervisor','view_chats'),
    ('front_office_agent','view_rooms'),('front_office_agent','view_reservations'),('front_office_agent','create_ticket'),('front_office_agent','record_consumption'),('front_office_agent','send_message'),('front_office_agent','view_chats'),
    ('front_office_trainee','view_rooms'),('front_office_trainee','view_reservations'),('front_office_trainee','send_message'),('front_office_trainee','view_chats'),
    ('night_manager','view_dashboard'),('night_manager','view_rooms'),('night_manager','view_reservations'),('night_manager','close_ticket'),('night_manager','bill_consumption'),('night_manager','view_room_history'),('night_manager','send_message'),('night_manager','view_chats'),
    ('night_auditor','view_rooms'),('night_auditor','view_reservations'),('night_auditor','bill_consumption'),('night_auditor','send_message'),('night_auditor','view_chats'),
    ('night_agent','view_rooms'),('night_agent','create_ticket'),('night_agent','send_message'),('night_agent','view_chats'),
    ('engineering_director','view_dashboard'),('engineering_director','view_rooms'),('engineering_director','update_ticket'),('engineering_director','close_ticket'),('engineering_director','view_room_history'),('engineering_director','send_message'),('engineering_director','view_chats'),
    ('engineering_supervisor','view_rooms'),('engineering_supervisor','update_ticket'),('engineering_supervisor','close_ticket'),('engineering_supervisor','send_message'),('engineering_supervisor','view_chats'),
    ('shift_engineer','view_rooms'),('shift_engineer','update_ticket'),('shift_engineer','send_message'),('shift_engineer','view_chats'),
    ('it_admin','view_dashboard'),('it_admin','manage_users'),('it_admin','manage_roles'),('it_admin','system_settings'),('it_admin','send_message'),('it_admin','view_chats'),
    ('general_manager','view_dashboard'),('general_manager','manage_users'),('general_manager','manage_roles'),('general_manager','view_rooms'),('general_manager','view_reservations'),('general_manager','close_ticket'),('general_manager','bill_consumption'),('general_manager','system_settings'),('general_manager','view_room_history'),('general_manager','send_message'),('general_manager','view_chats'),
    ('hotel_manager','view_dashboard'),('hotel_manager','view_rooms'),('hotel_manager','view_reservations'),('hotel_manager','close_ticket'),('hotel_manager','bill_consumption'),('hotel_manager','view_room_history'),('hotel_manager','send_message'),('hotel_manager','view_chats')
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM role_perms rp
JOIN roles r ON r.key = rp.role_key
JOIN permissions p ON p.key = rp.perm_key
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================
-- 4. DEPARTMENTS (extracted from users)
-- ============================================
INSERT INTO departments (name, description) VALUES
  ('Management', 'Hotel management'),
  ('Housekeeping', 'Room cleaning and maintenance'),
  ('Rooms Division', 'Rooms and guest services'),
  ('Front Office', 'Guest check-in and reservations'),
  ('Night Team', 'Night shift operations'),
  ('Engineering', 'Maintenance and repairs'),
  ('Information Technology', 'IT systems and support')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 5. SHIFTS
-- ============================================
INSERT INTO shifts (name, start_time, end_time) VALUES
  ('AM', '06:00', '14:00'),
  ('PM', '14:00', '22:00'),
  ('Night', '22:00', '06:00')
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. CONSUMABLES
-- ============================================
INSERT INTO consumables (name, category, unit_price, billable) VALUES
  ('Mini Bar - Water', 'mini_bar', 5.00, true),
  ('Mini Bar - Coke', 'mini_bar', 4.00, true),
  ('Laundry - Shirt', 'laundry', 8.00, true),
  ('Towels - Extra', 'towels', 0, false)
ON CONFLICT DO NOTHING;
