import Button from "@/components/common/Button.jsx";
import useAuth from "../hooks/useAuth.js"
import {
    Bell,
    ChevronRight,
    CircleHelp,
    Globe,
    LockKeyhole,
    LogOut,
    Mail,
    Moon,
    Scale,
    Shield,
    ShieldCheck,
} from "lucide-react";

const accountItems = [
    { label: "Email", icon: Mail },
    { label: "Password", icon: LockKeyhole },
    { label: "Security", icon: Shield },
];

const preferenceItems = [
    { label: "Theme", icon: Moon, value: "Dark" },
    { label: "Notifications", icon: Bell },
    { label: "Language", icon: Globe },
];

const supportItems = [
    { label: "Help Center", icon: CircleHelp },
    { label: "Privacy Policy", icon: ShieldCheck },
    { label: "Terms of Service", icon: Scale },
];

const SettingsRow = ({ icon: Icon, label, value }) => (
    <button
        type="button"
        className="flex h-[44px] w-full items-center gap-3 border-b border-[#2d2d2d] px-3 text-left text-[12px] font-semibold text-white transition-colors last:border-b-0 hover:bg-[#242424] focus-visible:bg-[#242424] focus-visible:outline-none"
    >
        <Icon className="h-[17px] w-[17px] shrink-0 text-[#d9e7ff]" strokeWidth={2.2} />
        <span className="flex-1 cursor-default text-white hover:text-white">{label}</span>
        {value && (
            <span className="cursor-default text-[12px] font-medium text-white hover:text-white">
                {value}
            </span>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#5a5a5a]" />
    </button>
);

const SettingsGroup = ({ title, items }) => (
    <section>
        <h2 className="mb-1 px-1 text-[10px] font-bold uppercase leading-none text-[#cfcfcf]">
            {title}
        </h2>
        <div className="overflow-hidden rounded-[5px] border border-[#303030] bg-[#1f1f1f]">
            {items.map((item) => (
                <SettingsRow key={item.label} {...item} />
            ))}
        </div>
    </section>
);

export const Settings = () => {
    const { user,logout } = useAuth();
    const initial = user?.name?.trim()?.charAt(0) || user?.email?.trim()?.charAt(0) || "U";

    return(
        <div className="min-h-full bg-[#111111] px-3 py-3 text-white sm:px-5 sm:py-5">
            <div className="mx-auto flex w-full max-w-[430px] flex-col gap-2.5">
                <section className="flex items-center gap-3 rounded-[5px] border border-[#303030] bg-[#1b1b1b] p-3">
                    <div className="flex h-[47px] w-[47px] shrink-0 items-center justify-center overflow-hidden rounded-[7px] border border-[#343434] bg-[radial-gradient(circle_at_45%_35%,#184d50,#0f1f24_52%,#08090b)] text-base font-bold uppercase text-[#87fff0] shadow-[inset_0_0_18px_rgba(97,255,225,0.12)]">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate font-sans text-[14px] font-bold leading-tight tracking-[0] text-white">
                            {user?.name || "User"}
                        </h1>
                        <p className="truncate text-[12px] font-bold leading-tight text-[#00ff89]">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                </section>

                <SettingsGroup title="Account" items={accountItems} />
                <SettingsGroup title="Preferences" items={preferenceItems} />
                <SettingsGroup title="Support" items={supportItems} />

                <div className="flex justify-center pt-1.5">
                    <Button
                        varient="logOutBtn"
                        onClick={logout}
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    )
}
