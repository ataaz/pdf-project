
"use client";

import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t">
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {year || ''} PDFry. All rights reserved.
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
