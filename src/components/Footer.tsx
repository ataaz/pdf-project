
"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="container flex items-center justify-between py-4 max-w-6xl">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PDFry. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Made with ❤️ in Dubai
        </p>
      </div>
    </footer>
  );
};

export default Footer;
