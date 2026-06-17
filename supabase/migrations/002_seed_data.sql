-- Seed Education
INSERT INTO education (degree, institution, start_date, end_date, grade, description, order_index) VALUES
('B.S. Computer Science', 'University of Technology', '2018-09-01', '2022-06-01', '3.8 GPA', 'Focused on software engineering, algorithms, and distributed systems.', 0),
('Full Stack Web Development', 'Online Bootcamp', '2020-01-01', '2020-06-01', 'Certificate', 'Intensive program covering React, Node.js, and modern web development.', 1);

-- Seed Experience
INSERT INTO experience (title, company, location, start_date, end_date, current, description, tech_stack, order_index) VALUES
('Senior Full Stack Developer', 'TechCorp Inc.', 'Remote', '2022-01-01', NULL, true,
 ARRAY['Led development of microservices architecture serving 2M+ daily users', 'Mentored junior developers and conducted code reviews', 'Reduced API latency by 40% through optimization'],
 ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS'], 0),
('Full Stack Developer', 'StartupXYZ', 'San Francisco, CA', '2020-06-01', '2021-12-01', false,
 ARRAY['Built customer-facing dashboard with real-time analytics', 'Implemented CI/CD pipeline reducing deploy time by 60%', 'Collaborated with design team on UI/UX improvements'],
 ARRAY['React', 'Next.js', 'GraphQL', 'MongoDB'], 1);

-- Seed Projects (2 featured + 4 regular)
INSERT INTO projects (title, description, tech_stack, live_url, github_url, featured, order_index) VALUES
('EventStream Platform', 'High-performance event processing platform handling 2M+ events per day with sub-10ms latency. Built with Go microservices, Kafka streaming, and Redis caching for real-time analytics.', ARRAY['Go', 'Kafka', 'Redis', 'PostgreSQL', 'Docker'], 'https://example.com', 'https://github.com', true, 0),
('DevPortal Dashboard', 'Developer analytics dashboard with real-time metrics, custom alerts, and team collaboration features. Serves 50k+ developers with 99.9% uptime.', ARRAY['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'], 'https://example.com', 'https://github.com', true, 1),
('CLI Task Manager', 'A beautiful command-line task manager with sync capabilities, tags, and productivity analytics.', ARRAY['Rust', 'SQLite'], NULL, 'https://github.com', false, 2),
('Open Source Auth Library', 'Lightweight authentication library for Node.js with OAuth2 support and session management.', ARRAY['Node.js', 'TypeScript'], NULL, 'https://github.com', false, 3),
('Portfolio CMS', 'Headless CMS for developer portfolios with markdown support and automatic deployments.', ARRAY['Next.js', 'Supabase', 'Tailwind CSS'], 'https://example.com', 'https://github.com', false, 4),
('API Gateway', 'Custom API gateway with rate limiting, request transformation, and observability.', ARRAY['Go', 'Redis', 'Docker', 'Kubernetes'], NULL, 'https://github.com', false, 5);

-- Seed Reviews (approved)
INSERT INTO reviews (name, role, company, rating, review_text, is_approved) VALUES
('Sarah Johnson', 'CTO', 'TechCorp Inc.', 5, 'An exceptional developer who consistently delivers high-quality work. Their attention to detail and problem-solving skills are outstanding.', true),
('Michael Chen', 'Product Manager', 'StartupXYZ', 5, 'Great collaborator who understands both technical and business requirements. Delivered our MVP ahead of schedule.', true),
('Emily Davis', 'Engineering Lead', 'DevTools Co.', 4, 'Strong full-stack skills and excellent communication. Would definitely work together again on future projects.', true);

-- Seed Site Settings
INSERT INTO site_settings (key, value) VALUES
('bio', 'I''m a passionate full-stack developer with expertise in building scalable web applications. I enjoy turning complex problems into simple, beautiful, and intuitive solutions.

When I''m not coding, you can find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.'),
('profile_image', ''),
('hero_stats_years', '3+'),
('hero_stats_projects', '40+'),
('name', 'Your Name'),
('title', 'Full Stack Developer'),
('resume_url', '')
ON CONFLICT (key) DO NOTHING;
