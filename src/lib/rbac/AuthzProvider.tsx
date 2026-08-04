/**
 * Authz Provider — single source of truth for the current user's roles
 * and resolved permissions. Wire `useAuthzSource` to your Software Vala
 * `/me` endpoint when ready; until then it returns a configurable default.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  permissionSetHas,
  type Permission,
  type Role,
} from "./permissions";
import { resolveWithOverrides, useRoleStore } from "./role-store";

export interface AuthzUser {
  id?: string;
  name?: string;
  email?: string;
  roles: Role[];
  /** Optional explicit permission overrides (additive). */
  permissions?: Permission[];
}

interface AuthzContextValue {
  user: AuthzUser | null;
  isAuthenticated: boolean;
  /** True when the signed-in account is the workspace owner/admin (Boss). */
  isBoss: boolean;
  /** Role currently being previewed by the Boss, if any. */
  simulatedRole: string | null;
  hasRole: (role: Role | Role[]) => boolean;
  can: (permission: Permission | Permission[]) => boolean;
  cannot: (permission: Permission | Permission[]) => boolean;
}

const AuthzContext = createContext<AuthzContextValue | null>(null);

export interface AuthzProviderProps {
  /** Inject user from your backend; pass `null` for signed-out. */
  user?: AuthzUser | null;
  children: ReactNode;
}

/**
 * Until the backend session is wired, default to the workspace `owner`
 * (the Boss profile shown in the top bar). Every other role is fully
 * enforced by the module registry. Replace via the `user` prop.
 */
const DEFAULT_USER: AuthzUser = { roles: ["owner"] };

export function AuthzProvider({ user = DEFAULT_USER, children }: AuthzProviderProps) {
  const store = useRoleStore();
  const value = useMemo<AuthzContextValue>(() => {
    const baseRoles = user?.roles ?? [];
    // The Boss can preview the workspace as another role.
    const isOwner = baseRoles.includes("owner") || baseRoles.includes("admin");
    const roles = (isOwner && store.simulate ? [store.simulate as Role] : baseRoles) as Role[];
    const set = resolveWithOverrides(roles, store);
    if (user?.permissions) for (const p of user.permissions) set.add(p);


    const can = (p: Permission | Permission[]) => {
      const list = Array.isArray(p) ? p : [p];
      return list.some((x) => permissionSetHas(set, x));
    };

    return {
      user: user ?? null,
      isAuthenticated: !!user,
      isBoss: isOwner,
      simulatedRole: isOwner && store.simulate ? store.simulate : null,
      hasRole: (r) => {
        const list = Array.isArray(r) ? r : [r];
        return list.some((x) => roles.includes(x));
      },
      can,
      cannot: (p) => !can(p),
    };
  }, [user, store]);

  return <AuthzContext.Provider value={value}>{children}</AuthzContext.Provider>;
}

export function useAuthz(): AuthzContextValue {
  const ctx = useContext(AuthzContext);
  if (!ctx) {
    // Safe fallback so components don't crash if provider is missing.
    return {
      user: null,
      isAuthenticated: false,
      hasRole: () => false,
      can: () => false,
      cannot: () => true,
    };
  }
  return ctx;
}

/** Render children only if the user has the permission. */
export function Can({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission | Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { can } = useAuthz();
  return <>{can(permission) ? children : fallback}</>;
}
