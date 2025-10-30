import { Navigation } from "@/components/Navigation";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">אימפקט</h1>
        <p className="text-muted-foreground">Impact page - Coming in Phase 2</p>
      </div>
      <Navigation zoozBalance={999} />
    </div>
  );
}
