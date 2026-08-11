import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

type ManagementHeaderProps = {
  eyebrow: string;
  title: string;
  onBack: () => void;
  action: ReactNode;
};

export function ManagementHeader({
  eyebrow,
  title,
  onBack,
  action,
}: ManagementHeaderProps) {
  return (
    <header className="management-header">
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        aria-label="Go back"
      >
        <ArrowLeft />
      </Button>
      <div>
        <span className="mini-label">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}
