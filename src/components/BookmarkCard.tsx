"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark } from "@/models/bookmark-schema";

type BookmarkCardProps = Bookmark & {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function BookmarkCard({
  id,
  url,
  title,
  summary,
  favicon_url,
  created_at,
  tags,
  onEdit = () => {},
  onDelete = () => {},
}: BookmarkCardProps) {
  return (
    <Card className="w-full shadow-md border rounded-2xl hover:shadow-lg transition">
      <CardContent className="p-6 space-y-4 relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {favicon_url && (
              <img
                src={favicon_url}
                alt="favicon"
                className="w-6 h-6 rounded-sm"
              />
            )}
            <div className="text-left">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                {title}
              </a>
              <p className="text-sm text-muted-foreground">
                {new URL(url).hostname} &middot;{" "}
                {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-28 p-1 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => onEdit(id)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-destructive"
                onClick={() => onDelete(id)}
              >
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-4">
          
            {summary.length > 200 ? summary.slice(0, 200) + "..." : summary}
          
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
