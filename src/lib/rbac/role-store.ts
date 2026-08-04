/**
 * Role Store — Boss-managed roles and per-role module grants.
 *
 * Built-in roles come from `ROLE_PERMISSIONS`. The workspace owner (Boss)
 * can override any role's grants, create custom roles, and preview the app
 * as a role. Overrides persist locally until the Software Vala backend
 * exposes a roles endpoint — the shape below mirrors that payload.
 */
import { useSyncExternalStore } from "react";

import {
  ROLE_PERMISSIONS,
  type Permission,
  type Role,
} from "./permissions";

export interface RoleDef {
  id: string;
  label: string;
  description: string;
  builtin: boolean;
}

export interface RoleStoreState {
  /** Custom roles created by the Boss. */
  customRoles: RoleDef[];
  /** Per-role grant overrides (role id → explicit permission list). */
  grants: Record<string, Permission[]>;
  /** Preview the workspace as this role (owner only). */
  simulate: string | null;
}

const KEY = "sv:rbac:roles";

export const BUILTIN_ROLES: RoleDef[] = [
  { id: "owner", label: "Boss / Owner", description: "Full workspace control. Cannot be restricted.", builtin: true },
  { id: "admin", label: "Admin", description: "Full access delegated by the Boss.", builtin: true },
  { id: "manager", label: "Creator Manager", description: "Runs the creator roster and campaigns.", builtin: true },
  { id: "creator", label: "Creator", description: "Own content, earnings and brand modules.", builtin: true },
  { id: "editor", label: "Editor", description: "Content production and approvals.", builtin: true },
  { id: "analyst", label: "Analyst", description: "Read-only performance and exports.", builtin: true },
  { id: "finance", label: "Finance", description: "Revenue, payouts and commissions.", builtin: true },
  { id: "support", label: "Support", description: "Customers, reviews and inbox.", builtin: true },
  { id: "viewer", label: "Viewer", description: "Read-only overview access.", builtin: true },
  { id: "guest", label: "Guest", description: "No module access by default.", builtin: true },
];

const EMPTY: RoleStoreState = { customRoles: [], grants: {}, simulate: null };

let state: RoleStoreState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): RoleStoreState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<RoleStoreState>;
    return {
      customRoles: parsed.customRoles ?? [],
      grants: parsed.grants ?? {},
      simulate: parsed.simulate ?? null,
    };
  } catch {
    return EMPTY;
  }
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: RoleStoreState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = read();
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;
const getServerSnapshot = () => EMPTY;

export function useRoleStore(): RoleStoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ---------------------------------- actions --------------------------------- */

export const roleActions = {
  createRole(def: Omit<RoleDef, "builtin">) {
    if (state.customRoles.some((r) => r.id === def.id)) return;
    commit({ ...state, customRoles: [...state.customRoles, { ...def, builtin: false }], grants: { ...state.grants, [def.id]: state.grants[def.id] ?? [] } });
  },
  updateRole(id: string, patch: Partial<Pick<RoleDef, "label" | "description">>) {
    commit({ ...state, customRoles: state.customRoles.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  },
  deleteRole(id: string) {
    const grants = { ...state.grants };
    delete grants[id];
    commit({
      ...state,
      customRoles: state.customRoles.filter((r) => r.id !== id),
      grants,
      simulate: state.simulate === id ? null : state.simulate,
    });
  },
  setGrants(id: string, permissions: Permission[]) {
    commit({ ...state, grants: { ...state.grants, [id]: Array.from(new Set(permissions)) } });
  },
  toggleGrant(id: string, permission: Permission, on: boolean) {
    const current = new Set(effectiveGrants(id, state));
    if (on) current.add(permission);
    else current.delete(permission);
    commit({ ...state, grants: { ...state.grants, [id]: Array.from(current) } });
  },
  resetRole(id: string) {
    const grants = { ...state.grants };
    delete grants[id];
    commit({ ...state, grants });
  },
  simulate(id: string | null) {
    commit({ ...state, simulate: id });
  },
};

/* --------------------------------- selectors -------------------------------- */

export function allRoles(s: RoleStoreState): RoleDef[] {
  return [...BUILTIN_ROLES, ...s.customRoles];
}

/** Resolved grants for a role id, honouring Boss overrides. */
export function effectiveGrants(id: string, s: RoleStoreState): Permission[] {
  if (s.grants[id]) return s.grants[id];
  const builtin = ROLE_PERMISSIONS[id as Role];
  if (!builtin) return [];
  if (builtin === "*") return ["__ALL__" as Permission];
  return builtin;
}

export function isWildcardRole(id: string, s: RoleStoreState): boolean {
  return !s.grants[id] && ROLE_PERMISSIONS[id as Role] === "*";
}

/** Permission set for a set of roles, honouring Boss overrides. */
export function resolveWithOverrides(roles: string[], s: RoleStoreState): Set<Permission> {
  const set = new Set<Permission>();
  for (const r of roles) {
    if (isWildcardRole(r, s)) return new Set<Permission>(["__ALL__" as Permission]);
    for (const p of effectiveGrants(r, s)) set.add(p);
  }
  return set;
}
