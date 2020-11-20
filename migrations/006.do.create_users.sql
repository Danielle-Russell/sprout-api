CREATE TABLE public.users (
 id UUID NOT NULL,
 “firstName” CHAR(64),
 “lastName” CHAR(64),
 email CHAR(128),
 password CHAR(60),
 CONSTRAINT users_pkey PRIMARY KEY(id)
) 
