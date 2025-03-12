import { Button } from "@/components/ui/button";
import { LegalCategory } from "@shared/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopicCategoriesProps {
  categories: readonly string[];
  selectedCategory: LegalCategory;
  onSelectCategory: (category: LegalCategory) => void;
}

export default function TopicCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: TopicCategoriesProps) {
  const isMobile = useIsMobile();
  
  const handleCategorySelect = (category: string) => {
    onSelectCategory(category as LegalCategory);
  };

  // Icons for each category to match Gemini's style
  const categoryIcons: Record<string, string> = {
    contracts: "📄",
    family: "👪",
    employment: "💼",
    property: "🏠",
    ip: "™️",
    criminal: "⚖️",
    immigration: "🌍",
    personal_injury: "🩹",
    tax: "📊",
    bankruptcy: "💰",
  };

  // Mapping of category values to display names
  const categoryLabels: Record<string, string> = {
    contracts: "Contracts",
    family: "Family Law",
    employment: "Employment",
    property: "Property",
    ip: "Intellectual Property",
    criminal: "Criminal Law",
    immigration: "Immigration",
    personal_injury: "Personal Injury",
    tax: "Tax Law",
    bankruptcy: "Bankruptcy",
  };

  return (
    <div className="mb-4">
      <h2 className="text-sm font-medium text-neutral-600 mb-3">Filter by topic</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-1">
          <Button
            variant="ghost"
            className={`rounded-full text-sm h-9 px-4 font-medium border ${
              selectedCategory === "all"
                ? "bg-primary/5 text-primary border-primary/30 hover:bg-primary/10"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
            onClick={() => handleCategorySelect("all")}
          >
            All Topics
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`rounded-full text-sm h-9 px-4 font-medium border ${
                selectedCategory === category
                  ? "bg-primary/5 text-primary border-primary/30 hover:bg-primary/10"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {!isMobile && categoryIcons[category]} {categoryLabels[category] || category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}
