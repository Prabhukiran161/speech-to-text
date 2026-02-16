import React from "react";
import { AudioLines, FileText } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <AudioLines className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">VoiceScribe</h1>
            <p className="text-xs text-muted-foreground">
              Real-time Speech to Text
            </p>
          </div>
        </div>

        {/* <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
