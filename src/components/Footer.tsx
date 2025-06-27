
import React from 'react';
import { Github, Twitter, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-800 bg-black/30 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and tagline */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/f3af9979-ad93-4ee0-8374-f9d3f7d06a8d.png" 
                  alt="CODI Logo" 
                  className="w-7.5 h-7.5"
                />
              </div>
              <span className="text-white font-semibold">CODI</span>
            </div>
            <span className="text-gray-400 text-sm">Co-pilot for On-chain Dev Interface</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://codi.fun/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-codi transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Website</span>
            </a>
            <a
              href="https://x.com/CodiDotFun/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-codi transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span className="text-sm">X</span>
            </a>
            <a
              href="https://github.com/codidotfun/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-codi transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
