import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  description: string;
  slug: string;
  icon: LucideIcon;
}

export default function CategoryCard({ name, description, slug, icon: Icon }: CategoryCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <button className="bg-card hover:shadow-lg transition-shadow rounded-xl p-6 text-center group w-full" data-testid={`category-${slug}`}>
        <div className="w-16 h-16 mx-auto mb-4 category-icon-bg rounded-full flex items-center justify-center group-hover:category-icon-bg transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-semibold text-card-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </button>
    </Link>
  );
}
