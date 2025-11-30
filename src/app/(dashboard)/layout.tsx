"use client";

import { Award01, HomeLine, Settings02, ShoppingBag02 } from "@untitledui/icons";
import { Award01 as Award01Solid, HomeLine as HomeLineSolid, Settings02 as Settings02Solid, ShoppingBag02 as ShoppingBag02Solid } from "@untitledui-pro/icons/solid"
import { AuthenticatedHeader } from "@/components/application/app-navigation/authenticated-header";
import { BottomBar } from "@/components/application/app-navigation/sidebar-navigation/sidebar-bottom";

interface LayoutMainProps {
    children: React.ReactNode;
}

const LayoutMain = ({ children }: LayoutMainProps) => (
    <div className="min-h-screen pb-24">
        <AuthenticatedHeader />
        <main>{children}</main>
        <BottomBar
            items={[
                {
                    label: "Général",
                    href: "/overview",
                    icon: <Award01 className="h-6 w-6 text-black dark:text-white" />,
                    iconActive: <Award01Solid className="h-6 w-6 text-black dark:text-white" />,
                },
                {
                    label: "Salons",
                    href: "/lobbies",
                    icon: <HomeLine className="h-6 w-6 text-black dark:text-white" />,
                    iconActive: <HomeLineSolid className="h-6 w-6 text-black dark:text-white" />,

                },
                {
                    label: "Magasin",
                    href: "/store",
                    icon: <ShoppingBag02 className="h-6 w-6 text-black dark:text-white" />,
                    iconActive: <ShoppingBag02Solid className="h-6 w-6 text-black dark:text-white" />,

                },
                {
                    label: "Paramètres",
                    href: "/settings",
                    icon: <Settings02 className="h-6 w-6 text-black dark:text-white" />,
                    iconActive: <Settings02Solid className="h-6 w-6 text-black dark:text-white" />,
                },
            ]}
        />
    </div>
);

export default LayoutMain;
