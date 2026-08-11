import type { ReactNode } from "react";
import type { Screen } from "../types";
import { Button } from "./ui/button";

type NavItem = {
  screen: Extract<Screen, "home" | "plan" | "progress">;
  label: string;
  icon: ReactNode;
};

export function AppNavigation({
  active,
  items,
  onNavigate,
}: {
  active: Screen;
  items: NavItem[];
  onNavigate: (screen: NavItem["screen"]) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <Button
          variant="ghost"
          key={item.screen}
          className={
            active === item.screen ? "nav-button active" : "nav-button"
          }
          onClick={() => onNavigate(item.screen)}
        >
          {item.icon}
          <span>{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}
