TRUNCATE milestones RESTART IDENTITY CASCADE;

INSERT INTO milestones (sproutId, title, date, notes)
VALUES
  (1, 'First Walked', '2020-09-30', 'Took a few steps before falling'),
  (2, 'First Day of School', '2020-08-05', 'Excited')
 