
"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} PDFry. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Made with ❤️ in Dubai
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
