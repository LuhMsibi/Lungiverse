import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Zap, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Sparkles,
      title: "Curated Quality",
      description: "We carefully select and verify every AI tool in our directory to ensure you get access to only the best solutions.",
    },
    {
      icon: Zap,
      title: "Always Updated",
      description: "Our platform is updated daily with the latest AI tools and technologies, keeping you ahead of the curve.",
    },
    {
      icon: Shield,
      title: "Trusted Resources",
      description: "Every tool is vetted for reliability, security, and effectiveness before being added to our platform.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We listen to our users and continuously improve based on feedback and usage patterns.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Lungiverse
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted companion in navigating the ever-evolving landscape of AI tools and utilities.
            </p>
          </div>

          {/* Mission Section */}
          <Card>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Lungiverse was born from a simple observation: finding the right AI tool for your specific need shouldn't be overwhelming or time-consuming. Founded by Lungisani, a passionate technology enthusiast who experienced firsthand the challenges of navigating the rapidly expanding AI landscape, Lungiverse represents a vision of making artificial intelligence accessible and understandable for everyone.
                </p>
                <p>
                  The name "Lungiverse" combines the founder's name with "universe" to represent our commitment to creating a comprehensive universe of AI tools all in one place. What started as a personal project to organize and catalog useful AI tools has evolved into a platform serving thousands of users worldwide, from individual creators and developers to businesses and educational institutions.
                </p>
                <p>
                  We're building the most comprehensive, user-friendly platform for discovering, comparing, and understanding AI tools. Whether you're a developer looking for code assistance, a content creator seeking image generation tools, or a business professional needing document conversion utilities, we're here to help you find exactly what you need. Our intelligent search and AI-powered chatbot assistant make it easy to describe what you're looking for and get personalized recommendations instantly.
                </p>
                <p>
                  At Lungiverse, we believe that AI technology should empower everyone, not just technical experts. That's why we carefully curate each tool, verify its quality and reliability, and present information in clear, accessible language. We continuously update our directory as new tools emerge and existing ones evolve, ensuring you always have access to the latest and most effective solutions in the AI space.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">What We Stand For</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-chart-2/5">
            <CardContent className="p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">250+</div>
                  <div className="text-sm text-muted-foreground">AI Tools</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">6</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">Daily</div>
                  <div className="text-sm text-muted-foreground">Updates</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Free to Use</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary to-chart-2 text-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Discover Your Perfect AI Tool?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Start exploring our curated collection and let us help you find exactly what you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Browse Tools
                  </Button>
                </Link>
                <Link href="/articles">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Read Guides
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
