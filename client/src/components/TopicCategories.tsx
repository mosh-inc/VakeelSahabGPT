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
    <div className="mb-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`rounded-full ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-white text-neutral-700"
            }`}
            onClick={() => handleCategorySelect("all")}
          >
            All Topics
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-700"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {categoryLabels[category] || category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
