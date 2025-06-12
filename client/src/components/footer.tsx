import { Heart, Github, Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "wouter";
import newLogo from "@assets/favico_1749769718941.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Home", href: "/" },
      { name: "Stories", href: "/stories" },
      { name: "Pricing", href: "/pricing" },
      { name: "Dashboard", href: "/dashboard" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "DMCA", href: "/dmca" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/chatlure", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com/chatlure", icon: Instagram },
    { name: "GitHub", href: "https://github.com/chatlure", icon: Github },
    { name: "Email", href: "mailto:hello@chatlure.com", icon: Mail },
  ];

  return (
    <footer className="bg-[#0d1117] border-t border-[#21262d] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <img 
                      src={newLogo} 
                      alt="ChatLure" 
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ChatLure</h3>
                  <p className="text-xs text-gray-400">Peek • Obsess • Repeat</p>
                </div>
              </div>
            </Link>
            <p className="text-[#7d8590] text-sm mb-6 max-w-md">
              Peek, Obsess, Repeat. Dive into the addictive world of secret chats. 
              Experience interactive stories that simulate real WhatsApp conversations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7d8590] hover:text-[#f0f6fc] transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-[#f0f6fc] font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-[#7d8590] hover:text-[#f0f6fc] text-sm transition-colors duration-200 cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[#f0f6fc] font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-[#7d8590] hover:text-[#f0f6fc] text-sm transition-colors duration-200 cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-[#f0f6fc] font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-[#7d8590] hover:text-[#f0f6fc] text-sm transition-colors duration-200 cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#21262d] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-[#7d8590] text-sm">
            © {currentYear} ChatLure. All rights reserved.
          </p>
          <p className="text-[#7d8590] text-sm mt-4 sm:mt-0 flex items-center">
            Made with <Heart className="w-4 h-4 text-[#f85149] mx-1" /> for story lovers
          </p>
        </div>
      </div>
    </footer>
  );
}