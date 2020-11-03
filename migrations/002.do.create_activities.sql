CREATE TABLE activities (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    sproutId INTEGER REFERENCES sprouts(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    notes TEXT NOT NULL
)
