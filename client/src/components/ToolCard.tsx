import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check } from "lucide-react";
import type { AITool } from "@shared/schema";

interface ToolCardProps {
  tool: AITool;
  featured?: boolean;
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
  return (
    <Card
      className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        featured ? "md:col-span-2" : ""
      }`}
      data-testid={`card-tool-${tool.id}`}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight">{tool.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {tool.category}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            {!tool.isPaid && (
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                Free
              </Badge>
            )}
            {tool.requiresAPI && (
              <Badge variant="outline" className="text-xs">
                API
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tool.description}
        </p>

        {tool.features && tool.features.length > 0 && (
          <ul className="space-y-2">
            {tool.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t gap-4">
        {tool.usageCount && (
          <span className="text-xs text-muted-foreground">
            {tool.usageCount.toLocaleString()} uses
          </span>
        )}
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => tool.url && window.open(tool.url, '_blank')}
          disabled={!tool.url}
          data-testid={`button-try-${tool.id}`}
        >
          Try Now
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
