import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <Alert className="bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 mr-3 text-orange-500 flex-shrink-0 mt-0.5" />
        <AlertDescription className="text-sm">
          <span className="font-semibold block mb-1">Vakeel Sahab GPT is not a substitute for professional legal advice</span>
          Information provided is based on AI training data and should not be considered legal advice. 
          Always consult a qualified attorney for specific legal matters.
        </AlertDescription>
      </div>
    </Alert>
  );
}
