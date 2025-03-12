import { Button } from "@/components/ui/button";
import { LegalCategory } from "@shared/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  const handleCategorySelect = (category: string) => {
    onSelectCategory(category as LegalCategory);
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
    <div className="mb-6">
      <h2 className="text-sm font-medium text-neutral-600 mb-3 ml-1">Topics</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          <Button
            variant="ghost"
            className={`rounded-full text-sm h-9 px-4 font-medium ${
              selectedCategory === "all"
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "bg-transparent text-neutral-700 hover:bg-neutral-100"
            }`}
            onClick={() => handleCategorySelect("all")}
          >
            All Topics
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`rounded-full text-sm h-9 px-4 font-medium ${
                selectedCategory === category
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "bg-transparent text-neutral-700 hover:bg-neutral-100"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {categoryLabels[category] || category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
