import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <Alert className="bg-[#dd6b20]/10 border-l-4 border-[#dd6b20] text-[#dd6b20] rounded-none">
      <div className="container mx-auto flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> LegalAssist AI provides information based on trained data and not legal advice. 
          Always consult a qualified attorney for legal matters.
        </AlertDescription>
      </div>
    </Alert>
  );
}
