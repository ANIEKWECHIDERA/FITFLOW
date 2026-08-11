import { FolderOpen, Menu, Pencil, Plus } from "lucide-react";
import type { WorkoutPlan } from "../data";
import { Button } from "./ui/button";

type ProfileMenuProps = {
  open: boolean;
  plan: WorkoutPlan;
  onToggle: () => void;
  onNew: () => void;
  onManage: () => void;
  onEdit: () => void;
};

export function ProfileMenu({
  open,
  plan,
  onToggle,
  onNew,
  onManage,
  onEdit,
}: ProfileMenuProps) {
  return (
    <div className="profile-wrap">
      <Button
        variant="outline"
        className="avatar"
        aria-label="Open plan menu"
        aria-expanded={open}
        onClick={onToggle}
      >
        CA
      </Button>
      {open && (
        <div className="profile-menu">
          <div>
            <span className="mini-label">ACTIVE PLAN</span>
            <b>{plan.name}</b>
          </div>
          <Button variant="ghost" onClick={onNew}>
            <Plus /> New plan
          </Button>
          <Button variant="ghost" onClick={onManage}>
            <FolderOpen /> Load plan
          </Button>
          <Button variant="ghost" onClick={onManage}>
            <Menu /> Manage plans
          </Button>
          <Button variant="ghost" onClick={onEdit}>
            <Pencil /> Edit active plan
          </Button>
        </div>
      )}
    </div>
  );
}
