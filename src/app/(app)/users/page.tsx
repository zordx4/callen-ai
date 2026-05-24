// Users — functional team management. Add / change role / remove.
// Seeded with realistic Pakistani team for Cheezious tenant.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  X,
  Trash2,
  Shield,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Role = "admin" | "manager" | "viewer";

type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActive: string;       // ISO
  avatarColor: string;
};

const SEED_TEAM: TeamUser[] = [
  { id: "u1", name: "Muhammad Talha Dilshad", email: "talha@cheezious.pk",      role: "admin",   lastActive: "2026-05-24T10:30:00Z", avatarColor: "#0a0a0a" },
  { id: "u2", name: "Ayesha Khan",            email: "ayesha@cheezious.pk",     role: "manager", lastActive: "2026-05-24T09:14:00Z", avatarColor: "#2d2d2d" },
  { id: "u3", name: "Hassan Raza",            email: "hassan@cheezious.pk",     role: "manager", lastActive: "2026-05-23T20:42:00Z", avatarColor: "#404040" },
  { id: "u4", name: "Sara Iqbal",             email: "sara@cheezious.pk",       role: "viewer",  lastActive: "2026-05-22T15:08:00Z", avatarColor: "#525252" },
  { id: "u5", name: "Bilal Ahmed",            email: "bilal@cheezious.pk",      role: "viewer",  lastActive: "2026-05-21T11:20:00Z", avatarColor: "#737373" },
];

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  viewer: "Viewer",
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access. Manage agents, knowledge, integrations, billing.",
  manager: "Manage agents and knowledge. Cannot change billing or owners.",
  viewer: "Read-only. View calls, analytics, and agent config.",
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function UsersPage() {
  const [team, setTeam] = useState<TeamUser[]>(SEED_TEAM);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return team.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [team, search, roleFilter]);

  const addUser = (name: string, email: string, role: Role) => {
    setTeam((prev) => [
      {
        id: `u_${Date.now()}`,
        name,
        email,
        role,
        lastActive: new Date().toISOString(),
        avatarColor: "#525252",
      },
      ...prev,
    ]);
  };

  const removeUser = (id: string) => {
    setTeam((prev) => prev.filter((u) => u.id !== id));
    toast("User removed");
  };

  const changeRole = (id: string, role: Role) => {
    setTeam((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    toast(`Role updated to ${ROLE_LABELS[role]}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Invite teammates and decide who can do what. {team.length} member{team.length === 1 ? "" : "s"}.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus className="size-3.5" />
          Add user
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 h-11 bg-white border-neutral-200"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "admin", "manager", "viewer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "h-11 px-3 rounded-md border text-[12px] font-medium capitalize transition-colors",
                roleFilter === r
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {r === "all" ? "All" : ROLE_LABELS[r as Role]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden mt-5">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-1">Last active</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-500">
            No matching teammates.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((u) => (
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 items-center"
              >
                <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                  <div
                    className="size-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                    style={{ backgroundColor: u.avatarColor }}
                  >
                    {u.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight truncate">{u.name}</p>
                    {u.id === "u1" && (
                      <p className="text-[10px] text-neutral-500">You</p>
                    )}
                  </div>
                </div>
                <div className="col-span-3 text-[12px] text-neutral-600 truncate">{u.email}</div>
                <div className="col-span-2">
                  <RoleDropdown
                    value={u.role}
                    disabled={u.id === "u1"}
                    onChange={(r) => changeRole(u.id, r)}
                  />
                </div>
                <div className="col-span-1 text-[11px] text-neutral-500">
                  {timeAgo(u.lastActive)}
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  {u.id !== "u1" && (
                    <button
                      onClick={() => removeUser(u.id)}
                      className="p-1 rounded hover:bg-neutral-100"
                      aria-label="Remove user"
                    >
                      <Trash2 className="size-3.5 text-neutral-500" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AddUserDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={(n, e, r) => { addUser(n, e, r); toast("Invite sent", { description: `${e} will join as ${ROLE_LABELS[r]}.` }); }} />
    </div>
  );
}

function RoleDropdown({
  value,
  disabled,
  onChange,
}: {
  value: Role;
  disabled?: boolean;
  onChange: (r: Role) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 h-6 rounded-full text-[10px] font-semibold uppercase tracking-wide border transition-colors",
          value === "admin"
            ? "bg-neutral-950 text-white border-neutral-950"
            : value === "manager"
            ? "bg-white text-neutral-900 border-neutral-300"
            : "bg-neutral-100 text-neutral-700 border-neutral-200",
          disabled && "cursor-not-allowed opacity-80"
        )}
      >
        <Shield className="size-2.5" />
        {ROLE_LABELS[value]}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-40 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg py-1">
            {(["admin", "manager", "viewer"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 hover:bg-neutral-50 transition-colors",
                  value === r && "bg-neutral-50/60"
                )}
              >
                <p className="text-[12px] font-semibold">{ROLE_LABELS[r]}</p>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  {ROLE_DESCRIPTIONS[r]}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AddUserDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, email: string, role: Role) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("manager");

  const reset = () => {
    setName("");
    setEmail("");
    setRole("manager");
  };

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    onAdd(name, email, role);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <Mail className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Invite teammate</DialogTitle>
        </div>
        <DialogDescription>
          They will get an invite email. Roles can be changed any time.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="u-name" className="text-xs">Name</Label>
            <Input
              id="u-name"
              placeholder="Hassan Raza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-email" className="text-xs">Work email</Label>
            <Input
              id="u-email"
              type="email"
              placeholder="hassan@cheezious.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["admin", "manager", "viewer"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-left transition-colors",
                    role === r
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <p className="text-[12px] font-semibold">{ROLE_LABELS[r]}</p>
                  <p
                    className={cn(
                      "text-[10px] leading-snug mt-0.5",
                      role === r ? "text-white/70" : "text-neutral-500"
                    )}
                  >
                    {ROLE_DESCRIPTIONS[r]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="-mx-4 -mb-4 mt-3 flex items-center justify-end gap-2 px-4 py-3 bg-neutral-50/60 border-t border-neutral-100 rounded-b-xl">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="h-8 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || !email.trim()}
            className={cn(
              "h-8 px-4 rounded-full text-sm font-medium transition-colors",
              !name.trim() || !email.trim()
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            )}
          >
            Send invite
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
