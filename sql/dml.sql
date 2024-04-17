INSERT INTO members (first_name, last_name, email, password, join_date, member_status)
VALUES
    ('John', 'Doe', 'johndoe@email.com', 'hashed_password', '2023-01-10', 'active'),
    ('Jane', 'Doe', 'janedoe@email.com', 'hashed_password2', '2023-02-15', 'active'),
    ('Mike', 'Smith', 'mikesmith@email.com', 'hashed_password3', '2023-03-22', 'active');


INSERT INTO trainers (first_name, last_name, email, password, certification)
VALUES
    ('Alice', 'Johnson', 'alicejohnson@fitclub.com', 'hashed_password4', 'Certified Personal Trainer'),
    ('Bob', 'Lee', 'bobLee@fitclub.com', 'hashed_password5', 'Certified Strength and Conditioning Specialist'),
    ('Charlie', 'Brown', 'charl@fc.com', 'hashed_password6', 'Certified Yoga Instructor');
INSERT INTO fitness_goals (member_id, goal_type, target_value, start_date, end_date)
VALUES
    (1, 'weight loss', 10, '2023-04-01', '2023-06-01'),
    (2, 'strength gain', 20, '2023-04-15', '2023-06-03'),
    (3, 'Improve endurance', 10, '2023-03-22', '2023-04-05'); 

INSERT INTO health_metrics (member_id, metric_type, value, date_recorded)
VALUES
    (1, 'weight', 80, '2023-04-07'),
    (1, 'weight', 200, '2023-04-07'),
    (2, 'weight', 65, '2023-04-12');

INSERT INTO rooms (room_name, capacity)
VALUES 
('Yoga Studio', 15),
('Weight Room', 30),
('Cycling Studio', 20); 

INSERT INTO classes (class_name, room_id, trainer_id, start_time, end_time, capacity)
VALUES 
('Power Yoga', 1, 1, '2024-04-17 08:00', '2024-04-15 09:00', 12), 
('Spin Class', 3, 2, '2024-04-16 17:30', '2024-04-16 18:30', 16); 

INSERT INTO trainer_availability (trainer_id, start_time, end_time)
VALUES
    (1, '2024-04-15 10:00', '2024-04-15 13:00'),
    (2, '2024-04-16 09:00', '2024-04-16 12:00'),
    (1, '2024-04-16 14:00', '2024-04-16 17:00'),
    (3, '2024-04-16 14:00', '2024-04-16 17:00'),
    (1, '2024-04-17 10:00', '2024-04-15 15:00'),
    (2, '2024-04-17 09:00', '2024-04-16 17:00'),
    (3, '2024-04-17 09:00', '2024-04-16 17:00');

INSERT INTO bookings (class_id, room_id, start_time, end_time)
VALUES
    (1, 1, '2024-04-17 08:00', '2024-04-15 09:00'), -- John Doe booked with Alice Johnson
    (2, 3, '2024-04-16 17:30', '2024-04-16 18:30'); -- Jane Doe booked with Alice Johnson

INSERT INTO class_registrations (member_id, class_id)
VALUES
    (3, 1),  -- Mike Smith registered for Power Yoga
    (2, 2),  -- Jane Doe registered for Spin Class 
    (1, 2);  -- John Doe registered for Spin Class
INSERT INTO excercise_routine  (routine_name, routine_description, routine_type, routine, difficulty_level)
VALUES
    ('killer cardio 1','KILLER CARDIO ROUTINE!','cardio', '{"exercises": ["running", "cycling"], "duration": "30 mins", "reps": null}', 5),
    ('Beastly Lifting 1','Beastly LIFTING ROUTINE!','weightlifting', '{"exercises": ["deadlift", "bench press", "squat"], "duration": "1 hour", "reps": "5x5"}', 8),
    ('ZEN YOGA 1','SUPER ZEN YOGA ROUTINE!','yoga', '{"exercises": ["sun salutation", "warrior pose"], "duration": "45 mins", "reps": null}', 3);
INSERT INTO member_routines (member_id, routine_id)
VALUES
    (1, 1), -- John Doe doing a cardio routine
    (2, 2), -- Jane Doe doing a weightlifting routine
    (3, 3); -- Mike Smith doing a yoga routine

INSERT INTO personal_training_sessions (member_id, trainer_id, start_time, end_time)
VALUES
    (1, 1, '2024-04-15 11:00', '2024-04-15 12:00'), -- John Doe's session with Alice Johnson
    (1, 1, '2024-04-15 08:00', '2024-04-15 09:00'), -- John Doe's session with Alice Johnson
    (2, 1, '2024-04-16 15:00', '2024-04-16 16:00'); -- Jane Doe's session with Alice Johnson
INSERT INTO equipment (equipment_name, equipment_type, operational, room_id) VALUES
('Treadmill 1', 'Cardio', true, 1),
('Elliptical 1', 'Cardio', true, 2),
('Stationary Bike 1', 'Cardio', true, 3),
('Rowing Machine 1', 'Cardio', false, 2),
('Leg Press Machine', 'Strength', true, 1),
('Squat Rack', 'Strength', false, 1),
('Bench Press', 'Strength', true, 2),
('Dumbbell Set', 'Free weights', true, 2),
('Kettlebell Set', 'Free weights', true, 3),
('Cable Crossover Machine', 'Strength', false, 1);

INSERT INTO maintenance_logs (equipment_id, maintenance_date, maintenance_description) VALUES
(1, '2024-01-01', 'Belt replacement'),
(1, '2024-02-01', 'Lubrication of moving parts'),
(2, '2024-03-15', 'Handle repair'),
(2, '2024-01-01', 'Electrical checkup'),
(3, '2024-03-01', 'Seat adjustment'),
(3, '2024-02-01', 'Pedal replacement'),
(4, '2024-01-20', 'Chain lubrication'),
(4, '2024-02-15', 'General maintenance'),
(5, '2024-01-10', 'Safety check'),
(5, '2024-02-20', 'Weight stack lubrication'),
(6, '2024-03-30', 'Barbell maintenance'),
(6, '2024-01-30', 'Rack inspection'),
(7, '2024-02-15', 'Bench padding replacement'),
(8, '2024-01-05', 'Dumbbell inspection'),
(8, '2024-02-05', 'Rubber grip replacement'),
(9, '2024-03-10', 'Kettlebell cleaning'),
(9, '2024-04-10', 'Weight verification'),
(10, '2024-01-20', 'Cable replacement'),
(10, '2024-01-30', 'Pulley maintenance');
