import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>by DB Intelligence Team</span>
            </div>

            <div className="flex items-center gap-4">
                <span>© 2025 DB Intelligence Engine</span>
                <div className="h-4 w-px bg-slate-800"></div>
                <div className="flex gap-3">
                    <a href="#" className="hover:text-blue-400 transition">
                        <Github className="w-4 h-4" />
                    </a>
                    <a href="#" className="hover:text-blue-400 transition">
                        <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="hover:text-blue-400 transition">
                        <Linkedin className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
