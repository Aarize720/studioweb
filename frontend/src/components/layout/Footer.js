'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import { SiDiscord } from 'react-icons/si';

const footerLinks = {
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Support', href: '/support' },
    { name: 'Documentation', href: '/docs' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/legal' },
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'CGV', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Discord', icon: SiDiscord, href: 'https://discord.gg/4qEUNSVjQF' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">HS</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Horizon Studio
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Creative Code, Clear Results. Your partner for professional web development, Discord bots, UI/UX design, and digital automation solutions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SiDiscord className="w-5 h-5 text-primary-500" />
                <a href="https://discord.gg/4qEUNSVjQF" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Join our Discord
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Horizon Studio. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}