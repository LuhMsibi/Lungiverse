import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/generated_images/ToolForge_AI_logo_icon_3e9816aa.png";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="border-t bg-card mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImage} alt="Lungiverse" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Lungiverse
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Discover Your AI Universe
            </p>
            <p className="text-sm text-muted-foreground">
              Your centralized platform for discovering AI tools and conversion utilities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" data-testid="link-footer-home">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/tools" data-testid="link-footer-tools">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Browse Tools
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/articles" data-testid="link-footer-articles">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Articles & Guides
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="link-footer-about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    About Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Conversion Tools
              </li>
              <li className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Image AI
              </li>
              <li className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Text AI
              </li>
              <li className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Video AI
              </li>
              <li className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Code AI
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest AI tools and updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-newsletter"
              />
              <Button type="submit" className="w-full" data-testid="button-subscribe">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Lungiverse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
