import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast({
          title: "Database Seeded Successfully!",
          description: `Added ${data.toolsInserted} tools and ${data.articlesInserted} articles`,
        });
      } else {
        toast({
          title: "Seeding Failed",
          description: data.error || "An error occurred while seeding the database",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="heading-admin-seed">
            <Database className="h-6 w-6" />
            Database Seeding
          </CardTitle>
          <CardDescription>
            Populate the production database with AI tools and articles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold" data-testid="heading-what-this-does">What This Does</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Adds 26 curated AI tools across 6 categories</li>
              <li>Adds 5 SEO-optimized articles about AI trends</li>
              <li>Safe to run multiple times (won't create duplicates)</li>
              <li>Takes about 5-10 seconds to complete</li>
            </ul>
          </div>

          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            size="lg"
            className="w-full"
            data-testid="button-seed-database"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Production Database
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-green-900 dark:text-green-100" data-testid="text-seed-success">
                      {result.message}
                    </p>
                    <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p data-testid="text-tools-seeded">
                        ✓ Tools: {result.toolsInserted} new, {result.toolsSkipped} already existed ({result.toolsTotal} total)
                      </p>
                      <p data-testid="text-articles-seeded">
                        ✓ Articles: {result.articlesInserted} synced/updated ({result.articlesTotal} total)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold text-sm" data-testid="heading-next-steps">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click the button above to seed the database</li>
              <li>Visit the Tools Directory to see all 26 tools</li>
              <li>Check the Articles section for 5 new articles</li>
              <li>Share lungiverse.com with your audience!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
