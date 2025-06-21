
"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 py-4 max-w-6xl">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} PDFry. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Made with ❤️ in Dubai
        </p>
      </div>
    </footer>
  );
};

export default Footer;
