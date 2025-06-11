--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
<<<<<<< HEAD
-- Dumped by pg_dump version 17.4
=======
-- Dumped by pg_dump version 16.5
>>>>>>> origin/main

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
<<<<<<< HEAD
SET transaction_timeout = 0;
=======
>>>>>>> origin/main
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_actions (
    id integer NOT NULL,
    admin_id integer NOT NULL,
    action text NOT NULL,
    target_type text NOT NULL,
    target_id integer,
    details text,
    performed_at timestamp without time zone DEFAULT now()
);


--
-- Name: admin_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_actions_id_seq OWNED BY public.admin_actions.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    emoji text NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    color text NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    story_id integer NOT NULL,
    content text NOT NULL,
    is_incoming boolean NOT NULL,
    "timestamp" text NOT NULL,
    has_read_receipt boolean DEFAULT false NOT NULL,
    "order" integer NOT NULL
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    image_url text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    shares integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    is_hot boolean DEFAULT false NOT NULL,
    is_new boolean DEFAULT false NOT NULL,
    is_viral boolean DEFAULT false NOT NULL,
    difficulty text DEFAULT 'easy'::text NOT NULL,
    duration integer DEFAULT 5 NOT NULL,
    has_audio boolean DEFAULT false NOT NULL,
    has_images boolean DEFAULT false NOT NULL,
    cliffhanger_level integer DEFAULT 3 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name text NOT NULL,
    price integer NOT NULL,
    "interval" text NOT NULL,
    features text[] NOT NULL,
    max_stories_per_day integer NOT NULL,
    has_unlimited_access boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscription_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id integer NOT NULL,
    user_id integer NOT NULL,
    achievement_id text NOT NULL,
    unlocked_at timestamp without time zone DEFAULT now()
);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- Name: user_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_shares (
    id integer NOT NULL,
    user_id integer NOT NULL,
    story_id integer NOT NULL,
    platform text NOT NULL,
    shared_at timestamp without time zone DEFAULT now(),
    unlocked boolean DEFAULT false NOT NULL
);


--
-- Name: user_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_shares_id_seq OWNED BY public.user_shares.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text,
    password text NOT NULL,
    first_name text,
    last_name text,
    profile_image_url text,
    is_admin boolean DEFAULT false NOT NULL,
    subscription_tier text DEFAULT 'free'::text NOT NULL,
    subscription_expires_at timestamp without time zone,
    stories_read integer DEFAULT 0 NOT NULL,
    stories_shared integer DEFAULT 0 NOT NULL,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_active_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admin_actions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_actions ALTER COLUMN id SET DEFAULT nextval('public.admin_actions_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- Name: user_shares id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shares ALTER COLUMN id SET DEFAULT nextval('public.user_shares_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: admin_actions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_actions (id, admin_id, action, target_type, target_id, details, performed_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, emoji, count, color) FROM stdin;
1	Heartbreak	💔	1	from-red-500 to-pink-500
2	Betrayal	🗡️	1	from-purple-500 to-indigo-500
3	Scandal	😱	0	from-yellow-500 to-orange-500
4	Drama	🎭	1	from-green-500 to-teal-500
5	Secrets	🤫	1	from-gray-500 to-slate-500
6	Romance	💕	1	from-pink-500 to-rose-500
7	Mystery	🔍	1	from-blue-500 to-cyan-500
8	Revenge	⚔️	0	from-red-600 to-orange-600
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, story_id, content, is_incoming, "timestamp", has_read_receipt, "order") FROM stdin;
1	1	Hey babe, can't wait to see you tonight 😘	f	2024-06-11 10:30	t	1
2	1	Sarah's working late again... perfect timing 😏	t	2024-06-11 10:32	t	2
3	1	I feel so bad lying to her but...	f	2024-06-11 10:33	t	3
4	1	Don't feel bad. She doesn't appreciate you like I do ❤️	t	2024-06-11 10:35	t	4
5	1	You're right. I love you Emma	f	2024-06-11 10:36	t	5
6	1	WHO IS EMMA?!	f	2024-06-11 10:45	f	6
\.


--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stories (id, title, description, category, image_url, views, shares, likes, is_hot, is_new, is_viral, difficulty, duration, has_audio, has_images, cliffhanger_level, created_at, updated_at) FROM stdin;
1	The Affair Exposed	Sarah discovers her husband's secret messages with her best friend. Watch the explosive confrontation unfold in real-time.	Betrayal	https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400	2847	156	324	t	f	t	medium	8	t	t	5	2025-06-11 01:14:50.100862	2025-06-11 01:14:50.100862
2	Office Romance Gone Wrong	Two coworkers think they're keeping their relationship secret. Their boss has been watching everything...	Drama	https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400	1923	89	201	t	t	f	easy	6	f	t	4	2025-06-11 01:14:50.100862	2025-06-11 01:14:50.100862
3	The Inheritance War	When grandma's will is read, family secrets explode in the group chat. Money changes everything.	Secrets	https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400	3421	234	567	t	f	t	hard	12	t	f	5	2025-06-11 01:14:50.100862	2025-06-11 01:14:50.100862
4	Catfish Revealed	After 6 months of online dating, she's about to meet him for the first time. But he's not who she thinks...	Romance	https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400	1567	78	145	f	t	f	medium	7	f	t	4	2025-06-11 01:14:50.100862	2025-06-11 01:14:50.100862
5	Wedding Day Disaster	The bride finds photos on her phone that change everything. Will she go through with the wedding?	Heartbreak	https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400	4123	312	678	t	f	t	medium	10	t	t	5	2025-06-11 01:14:50.100862	2025-06-11 01:14:50.100862
6	The Anonymous Tip	Someone sends proof that her boyfriend is cheating. But who is trying to destroy their relationship?	Mystery	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400	987	45	89	f	t	f	hard	9	f	f	3	2025-06-11 01:14:50.100862	2025-06-11 01:14:50.100862
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscription_plans (id, name, price, "interval", features, max_stories_per_day, has_unlimited_access, is_active) FROM stdin;
1	Free	0	forever	{"3 stories per day","Basic chat access","Limited sharing"}	3	f	t
2	Obsessed	499	monthly	{"Unlimited stories","Early access to new content","Premium chat experiences","Share to unlock instantly","No ads"}	-1	t	t
3	Addicted	1299	monthly	{"Everything in Obsessed","Exclusive VIP stories","Priority support","Custom story requests","Beta features access"}	-1	t	t
4	Obsessed Annual	4999	yearly	{"Unlimited stories","Early access to new content","Premium chat experiences","Share to unlock instantly","No ads","2 months free"}	-1	t	t
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_achievements (id, user_id, achievement_id, unlocked_at) FROM stdin;
\.


--
-- Data for Name: user_shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_shares (id, user_id, story_id, platform, shared_at, unlocked) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password, first_name, last_name, profile_image_url, is_admin, subscription_tier, subscription_expires_at, stories_read, stories_shared, current_streak, longest_streak, last_active_at, created_at, updated_at) FROM stdin;
1	admin	admin@chatlure.com	admin123	Admin	User	\N	t	Addicted	\N	0	0	0	0	2025-06-11 01:14:49.981639	2025-06-11 01:14:49.981639	2025-06-11 01:14:49.981639
\.


--
-- Name: admin_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_actions_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 6, true);


--
-- Name: stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stories_id_seq', 6, true);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 4, true);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 1, false);


--
-- Name: user_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_shares_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: admin_actions admin_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_shares user_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shares
    ADD CONSTRAINT user_shares_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- PostgreSQL database dump complete
--

