TRUNCATE health RESTART IDENTITY CASCADE;

INSERT INTO health (sproutId, title, date, time, notes)
VALUES
  (1, 'Appointment', '2020-10-13', '10:00', 'Christian was in the 17th percentile for height but the 40th for weight. The doctor said he was doing very well, he even waved bye-bye!'),
  (2, 'Vaccination', '2020-05-15', '10:00', 'Flu shot')
 
