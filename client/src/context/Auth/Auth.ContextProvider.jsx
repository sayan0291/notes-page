import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, userProfile } from "../../Database/Supabase-client.js";
import AuthContext from "./auth.context";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const syncTimeoutRef = useRef(null);

    // Fetches the profile row for a given auth user and syncs it into state.
    // Always resolves to either a profile object or null — never leaves
    // `user` in an inconsistent shape.
    const syncUser = useCallback(async (authUser) => {
        if (!authUser) {
            setUser(null);
            return;
        }

        try {
            const profile = await userProfile(authUser.id);
            setUser(profile ?? null);
        } catch (error) {
            console.error("Unable to load user profile:", error);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        // Resolve the initial session on first load (handles page refresh)
        const init = async () => {
            try {
                const { data: { user: authUser }, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (isMounted) await syncUser(authUser);
            } catch (error) {
                console.error("Unable to get the user data:", error);
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        init();

        // Single source of truth going forward: react to real auth events.
        // Defer Supabase calls outside the auth callback so the auth-token
        // browser lock can be released before profile loading starts.
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!isMounted) return;

                clearTimeout(syncTimeoutRef.current);
                syncTimeoutRef.current = setTimeout(async () => {
                    if (!isMounted) return;
                    await syncUser(session?.user ?? null);
                    if (isMounted) setLoading(false);
                }, 0);
            }
        );

        return () => {
            isMounted = false;
            clearTimeout(syncTimeoutRef.current);
            listener.subscription.unsubscribe();
        };
    }, [syncUser]);

    // login/logout/register only trigger the Supabase action.
    // They never call setUser directly — onAuthStateChange handles that,
    // so there's no way for local state to drift from the real session.

    const login = async ({ email, password }) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setLoading(false);
            throw error;
        }
        // setLoading(false) happens in the onAuthStateChange handler above
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
        localStorage.clear();
        // setUser(null) happens automatically via the SIGNED_OUT event
    };

    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
