-- Horizon Studio Database Seed Data
-- Test data for development

-- Clear existing data
TRUNCATE TABLE messages, ticket_messages, tickets, testimonials, blog_post_tags, blog_tags, blog_posts, blog_categories, portfolio_images, portfolio, order_items, orders, cart_items, products, service_quotes, services, refresh_tokens, users RESTART IDENTITY CASCADE;

-- Insert Users
-- Password for all users: Admin123! or Client123!
-- Hashed with bcrypt (10 rounds)
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, is_verified, created_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@horizonstudio.com', '$2a$10$IlZKFwT5IoMrIoHSN9Otq..WP6Y6GqzITRT2QHa6YhIdoW0mZ0SNK', 'Admin', 'Horizon', '+33612345678', 'super_admin', true, true, NOW() - INTERVAL '6 months'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'manager@horizonstudio.com', '$2a$10$IlZKFwT5IoMrIoHSN9Otq..WP6Y6GqzITRT2QHa6YhIdoW0mZ0SNK', 'Marie', 'Dupont', '+33623456789', 'admin', true, true, NOW() - INTERVAL '5 months'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'client@example.com', '$2a$10$J1pY/k1T9GmUjHbwMwbQdOPOJXxkisfThAC2/yG3oegIDwtJ1U8ti', 'Jean', 'Martin', '+33634567890', 'client', true, true, NOW() - INTERVAL '3 months'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'sophie@example.com', '$2a$10$J1pY/k1T9GmUjHbwMwbQdOPOJXxkisfThAC2/yG3oegIDwtJ1U8ti', 'Sophie', 'Bernard', '+33645678901', 'client', true, true, NOW() - INTERVAL '2 months'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'pierre@example.com', '$2a$10$J1pY/k1T9GmUjHbwMwbQdOPOJXxkisfThAC2/yG3oegIDwtJ1U8ti', 'Pierre', 'Dubois', '+33656789012', 'client', true, true, NOW() - INTERVAL '1 month');

-- Insert Services
INSERT INTO services (id, name, slug, description, short_description, icon, price_starting, price_type, features, is_active, display_order) VALUES
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Développement Web Sur Mesure', 'developpement-web-sur-mesure', 
'Création de sites web et applications web personnalisés selon vos besoins spécifiques. Nous utilisons les dernières technologies pour garantir performance, sécurité et évolutivité.',
'Sites web et applications sur mesure avec les dernières technologies',
'code', 2500.00, 'starting_at',
'["Analyse des besoins", "Design UI/UX personnalisé", "Développement frontend et backend", "Base de données optimisée", "Tests et déploiement", "Formation et documentation", "Support 3 mois inclus"]'::jsonb,
true, 1),

('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'E-commerce & Boutique en Ligne', 'ecommerce-boutique-en-ligne',
'Création de boutiques en ligne complètes avec gestion des produits, paiements sécurisés, gestion des stocks et tableau de bord administrateur.',
'Boutiques en ligne performantes et sécurisées',
'shopping-cart', 3500.00, 'starting_at',
'["Catalogue produits illimité", "Panier et checkout optimisé", "Paiements Stripe/PayPal", "Gestion des stocks", "Dashboard admin complet", "SEO optimisé", "Responsive design", "Support 6 mois"]'::jsonb,
true, 2),

('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Application Mobile', 'application-mobile',
'Développement d''applications mobiles natives ou hybrides pour iOS et Android. Interface intuitive et performances optimales.',
'Apps mobiles iOS et Android performantes',
'smartphone', 5000.00, 'starting_at',
'["iOS et Android", "Design natif", "API backend incluse", "Notifications push", "Paiements in-app", "Publication sur stores", "Maintenance 6 mois"]'::jsonb,
true, 3),

('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Refonte & Modernisation', 'refonte-modernisation',
'Modernisation de sites web existants : nouveau design, amélioration des performances, migration vers de nouvelles technologies.',
'Donnez une nouvelle vie à votre site web',
'refresh', 1800.00, 'starting_at',
'["Audit complet", "Nouveau design moderne", "Optimisation performances", "Migration de données", "SEO amélioré", "Formation équipe", "Support 2 mois"]'::jsonb,
true, 4),

('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Maintenance & Support', 'maintenance-support',
'Service de maintenance continue : mises à jour, corrections de bugs, optimisations, sauvegardes et support technique.',
'Gardez votre site à jour et sécurisé',
'wrench', 500.00, 'hourly',
'["Mises à jour régulières", "Corrections de bugs", "Sauvegardes quotidiennes", "Monitoring 24/7", "Support prioritaire", "Optimisations mensuelles", "Rapports détaillés"]'::jsonb,
true, 5),

('faeebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'SEO & Marketing Digital', 'seo-marketing-digital',
'Optimisation pour les moteurs de recherche et stratégies de marketing digital pour augmenter votre visibilité en ligne.',
'Boostez votre visibilité en ligne',
'trending-up', 800.00, 'starting_at',
'["Audit SEO complet", "Optimisation on-page", "Stratégie de contenu", "Link building", "Google Ads", "Analytics et reporting", "Suivi mensuel"]'::jsonb,
true, 6);

-- Insert Service Quotes
INSERT INTO service_quotes (service_id, name, email, phone, company, message, budget_range, timeline, status) VALUES
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Thomas Leroy', 'thomas@example.com', '+33612345678', 'TechStart SAS', 
'Nous cherchons à développer une plateforme SaaS pour notre entreprise. Besoin d''un système d''authentification, dashboard utilisateur et API.', 
'5000-10000', '2-3 mois', 'pending'),

('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Claire Moreau', 'claire@boutique.com', '+33623456789', 'Boutique Claire', 
'Je souhaite créer une boutique en ligne pour vendre mes créations artisanales. Environ 50 produits au démarrage.', 
'3000-5000', '1-2 mois', 'reviewed');

-- Insert Products
INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, sku, quantity, images, category, tags, is_active, is_featured) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Template Site Vitrine Pro', 'template-site-vitrine-pro',
'Template professionnel pour site vitrine avec design moderne, responsive et optimisé SEO. Inclut 5 pages personnalisables, formulaire de contact et intégration Google Maps.',
'Template site vitrine moderne et responsive',
299.00, 399.00, 'TEMP-VITRINE-001', 999,
'[{"url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", "alt": "Template vitrine"}]'::jsonb,
'Templates', ARRAY['template', 'vitrine', 'responsive'], true, true),

('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Template E-commerce Complet', 'template-ecommerce-complet',
'Template e-commerce complet avec panier, paiement Stripe, gestion produits, dashboard admin. Prêt à l''emploi.',
'Solution e-commerce clé en main',
599.00, 799.00, 'TEMP-ECOM-001', 999,
'[{"url": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800", "alt": "Template e-commerce"}]'::jsonb,
'Templates', ARRAY['template', 'ecommerce', 'shop'], true, true),

('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Pack Logo + Identité Visuelle', 'pack-logo-identite-visuelle',
'Pack complet incluant création de logo, charte graphique, carte de visite et papier à en-tête. Fichiers sources inclus.',
'Logo professionnel et identité visuelle complète',
450.00, 600.00, 'DESIGN-LOGO-001', 50,
'[{"url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800", "alt": "Logo design"}]'::jsonb,
'Design', ARRAY['logo', 'branding', 'design'], true, false),

('13eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'Audit SEO Complet', 'audit-seo-complet',
'Audit SEO approfondi de votre site web avec rapport détaillé et recommandations d''optimisation. Livré sous 5 jours.',
'Analyse complète de votre référencement',
350.00, null, 'SEO-AUDIT-001', 100,
'[{"url": "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800", "alt": "SEO Audit"}]'::jsonb,
'Services', ARRAY['seo', 'audit', 'marketing'], true, false),

('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'Formation Next.js (5h)', 'formation-nextjs-5h',
'Formation complète Next.js 14 : App Router, Server Components, API Routes, déploiement. En ligne ou présentiel.',
'Maîtrisez Next.js avec un expert',
800.00, null, 'FORM-NEXT-001', 20,
'[{"url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800", "alt": "Formation"}]'::jsonb,
'Formations', ARRAY['formation', 'nextjs', 'react'], true, false),

('15eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'Hébergement Web Premium (1 an)', 'hebergement-web-premium-1an',
'Hébergement web premium avec SSL, sauvegardes quotidiennes, support 24/7 et performances optimales. 1 an.',
'Hébergement rapide et sécurisé',
180.00, 240.00, 'HOST-PREM-001', 200,
'[{"url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800", "alt": "Hébergement"}]'::jsonb,
'Hébergement', ARRAY['hosting', 'ssl', 'premium'], true, false);

-- Insert Orders
INSERT INTO orders (id, order_number, user_id, email, first_name, last_name, phone, 
    billing_address_line1, billing_city, billing_postal_code, billing_country,
    shipping_address_line1, shipping_city, shipping_postal_code, shipping_country,
    subtotal, tax, shipping_cost, total, payment_method, payment_status, status, created_at) VALUES
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'ORD-2024-0001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 
'client@example.com', 'Jean', 'Martin', '+33634567890',
'15 Rue de la Paix', 'Paris', '75002', 'France',
'15 Rue de la Paix', 'Paris', '75002', 'France',
299.00, 59.80, 0.00, 358.80, 'stripe', 'paid', 'delivered', NOW() - INTERVAL '2 months'),

('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'ORD-2024-0002', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
'sophie@example.com', 'Sophie', 'Bernard', '+33645678901',
'28 Avenue des Champs', 'Lyon', '69001', 'France',
'28 Avenue des Champs', 'Lyon', '69001', 'France',
1249.00, 249.80, 0.00, 1498.80, 'paypal', 'paid', 'processing', NOW() - INTERVAL '1 week');

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, price, total) VALUES
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
'Template Site Vitrine Pro', 'TEMP-VITRINE-001', 1, 299.00, 299.00),

('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
'Template E-commerce Complet', 'TEMP-ECOM-001', 1, 599.00, 599.00),
('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', '12eebc99-9c0b-4ef8-bb6d-6bb9bd380a24',
'Pack Logo + Identité Visuelle', 'DESIGN-LOGO-001', 1, 450.00, 450.00),
('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', '13eebc99-9c0b-4ef8-bb6d-6bb9bd380a25',
'Audit SEO Complet', 'SEO-AUDIT-001', 1, 350.00, 350.00);

-- Insert Portfolio Projects
INSERT INTO portfolio (id, title, slug, description, short_description, client_name, project_url, category, tags, featured_image, technologies, is_featured, display_order) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'Plateforme E-learning TechAcademy', 'plateforme-elearning-techacademy',
'Développement d''une plateforme e-learning complète avec gestion des cours, quiz interactifs, suivi de progression et certificats. Plus de 10 000 utilisateurs actifs.',
'Plateforme e-learning avec 10K+ utilisateurs',
'TechAcademy', 'https://techacademy-demo.com', 'Web Application', 
ARRAY['elearning', 'education', 'saas'], 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'], true, 1),

('31eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Boutique en Ligne FashionStore', 'boutique-en-ligne-fashionstore',
'Création d''une boutique e-commerce moderne avec plus de 500 produits, paiements sécurisés et gestion des stocks en temps réel.',
'E-commerce mode avec 500+ produits',
'FashionStore', 'https://fashionstore-demo.com', 'E-commerce',
ARRAY['ecommerce', 'fashion', 'retail'], 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
ARRAY['React', 'Stripe', 'Node.js', 'MongoDB'], true, 2),

('32eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'Application Mobile FitTracker', 'application-mobile-fittracker',
'Application mobile de suivi fitness avec plans d''entraînement personnalisés, suivi nutrition et intégration wearables.',
'App fitness avec plans personnalisés',
'FitLife Inc', null, 'Mobile App',
ARRAY['mobile', 'fitness', 'health'], 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
ARRAY['React Native', 'Firebase', 'HealthKit', 'Google Fit'], true, 3),

('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Site Vitrine Restaurant Le Gourmet', 'site-vitrine-restaurant-le-gourmet',
'Site vitrine élégant pour restaurant gastronomique avec menu interactif, réservations en ligne et galerie photos.',
'Site restaurant avec réservations en ligne',
'Le Gourmet', 'https://legourmet-demo.com', 'Website',
ARRAY['restaurant', 'vitrine', 'booking'], 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion'], false, 4),

('34eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'Dashboard Analytics DataViz Pro', 'dashboard-analytics-dataviz-pro',
'Dashboard d''analytics avancé avec visualisations de données en temps réel, exports et rapports personnalisables.',
'Dashboard analytics temps réel',
'DataViz Pro', null, 'Web Application',
ARRAY['dashboard', 'analytics', 'data'], 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
ARRAY['React', 'D3.js', 'Chart.js', 'WebSocket'], false, 5);

-- Insert Blog Categories
INSERT INTO blog_categories (id, name, slug, description) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'Développement Web', 'developpement-web', 'Articles sur le développement web moderne'),
('41eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'Design UI/UX', 'design-ui-ux', 'Tendances et bonnes pratiques en design'),
('42eebc99-9c0b-4ef8-bb6d-6bb9bd380a37', 'Marketing Digital', 'marketing-digital', 'Stratégies de marketing en ligne'),
('43eebc99-9c0b-4ef8-bb6d-6bb9bd380a38', 'Tutoriels', 'tutoriels', 'Guides pratiques et tutoriels'),
('44eebc99-9c0b-4ef8-bb6d-6bb9bd380a39', 'Actualités Tech', 'actualites-tech', 'Dernières nouvelles du monde tech');

-- Insert Blog Tags
INSERT INTO blog_tags (id, name, slug) VALUES
('50eebc99-9c0b-4ef8-bb6d-6bb9bd380a40', 'Next.js', 'nextjs'),
('51eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'React', 'react'),
('52eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'TypeScript', 'typescript'),
('53eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'SEO', 'seo'),
('54eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Performance', 'performance'),
('55eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'Sécurité', 'securite');

-- Insert Blog Posts
INSERT INTO blog_posts (id, title, slug, excerpt, content, featured_image, category_id, author_id, status, is_featured, published_at) VALUES
('60eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 
'Guide Complet Next.js 14 : App Router et Server Components', 
'guide-complet-nextjs-14-app-router',
'Découvrez toutes les nouveautés de Next.js 14 avec l''App Router et les Server Components. Guide complet avec exemples pratiques.',
'# Introduction à Next.js 14

Next.js 14 apporte des améliorations majeures avec l''App Router et les Server Components...

## App Router

L''App Router est la nouvelle façon de créer des applications Next.js...

## Server Components

Les Server Components permettent de réduire le JavaScript côté client...

## Conclusion

Next.js 14 représente une évolution majeure du framework...',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
'40eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
'published', true, NOW() - INTERVAL '1 week'),

('61eebc99-9c0b-4ef8-bb6d-6bb9bd380a47',
'10 Principes de Design UI/UX à Connaître en 2024',
'10-principes-design-ui-ux-2024',
'Les principes essentiels du design UI/UX pour créer des interfaces modernes et intuitives.',
'# Les Principes Fondamentaux du Design

Le design UI/UX est crucial pour le succès de votre application...

## 1. La Simplicité

Moins c''est plus. Gardez vos interfaces simples et épurées...

## 2. La Cohérence

Maintenez une cohérence visuelle dans toute votre application...',
'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
'41eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
'published', true, NOW() - INTERVAL '3 days'),

('62eebc99-9c0b-4ef8-bb6d-6bb9bd380a48',
'Optimiser le SEO de Votre Site Next.js',
'optimiser-seo-site-nextjs',
'Techniques et bonnes pratiques pour améliorer le référencement de votre site Next.js.',
'# SEO et Next.js

Next.js offre d''excellentes fonctionnalités pour le SEO...

## Métadonnées

Utilisez l''API Metadata pour définir vos balises meta...',
'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
'42eebc99-9c0b-4ef8-bb6d-6bb9bd380a37', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
'published', false, NOW() - INTERVAL '5 days');

-- Link Blog Posts with Tags
INSERT INTO blog_post_tags (post_id, tag_id) VALUES
('60eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a40'),
('60eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', '51eebc99-9c0b-4ef8-bb6d-6bb9bd380a41'),
('60eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', '52eebc99-9c0b-4ef8-bb6d-6bb9bd380a42'),
('61eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', '54eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
('62eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a40'),
('62eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', '53eebc99-9c0b-4ef8-bb6d-6bb9bd380a43');

-- Insert Testimonials
INSERT INTO testimonials (user_id, name, company, position, content, rating, is_featured, is_approved) VALUES
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Jean Martin', 'TechStart SAS', 'CEO',
'Excellente collaboration avec Studio Web. Ils ont parfaitement compris nos besoins et livré une solution de qualité dans les délais. Je recommande vivement !',
5, true, true),

('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Sophie Bernard', 'Boutique Claire', 'Fondatrice',
'Très satisfaite de ma boutique en ligne. Le design est magnifique et l''interface admin est très intuitive. Mes ventes ont augmenté de 40% !',
5, true, true),

(null, 'Marc Lefebvre', 'Restaurant Le Gourmet', 'Gérant',
'Site web élégant qui reflète parfaitement l''image de notre restaurant. Les réservations en ligne fonctionnent à merveille.',
4, false, true);

-- Insert Tickets
INSERT INTO tickets (id, ticket_number, user_id, subject, category, priority, status, assigned_to) VALUES
('70eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'TICK-2024-0001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
'Problème d''affichage sur mobile', 'Technique', 'medium', 'in_progress', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),

('71eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'TICK-2024-0002', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
'Question sur la facturation', 'Facturation', 'low', 'resolved', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Insert Ticket Messages
INSERT INTO ticket_messages (ticket_id, user_id, message) VALUES
('70eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
'Bonjour, j''ai remarqué que le menu ne s''affiche pas correctement sur mon iPhone. Pouvez-vous regarder ?'),

('70eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
'Bonjour Jean, merci pour votre retour. Nous allons investiguer ce problème immédiatement.'),

('71eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
'Bonjour, je n''ai pas reçu ma facture pour la commande ORD-2024-0002.'),

('71eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
'Bonjour Sophie, je vous renvoie la facture par email immédiatement. Désolé pour ce désagrément.');

-- Insert Messages
INSERT INTO messages (sender_id, recipient_id, subject, message, is_read) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
'Bienvenue sur Horizon Studio', 
'Bonjour Jean, bienvenue sur notre plateforme ! N''hésitez pas à nous contacter si vous avez des questions.',
true),

('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
'Re: Bienvenue sur Horizon Studio',
'Merci beaucoup ! Très content de travailler avec vous.',
false);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Admin login: admin@horizonstudio.com / Admin123!';
    RAISE NOTICE 'Client login: client@example.com / Client123!';
END $$;