import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link href={`/tags/${tag}`}>
      <Badge variant="secondary" className="cursor-pointer transition-colors hover:bg-primary/10">
        {tag}
      </Badge>
    </Link>
  );
}
