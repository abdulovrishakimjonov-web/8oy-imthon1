"use client";

import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import Hedaer from "@/components/Hedaer";
import { ModeToggle } from "@/components/mode";
import { useState, useEffect, useMemo } from "react";
import { RightOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

const SITE_CONFIG = {
  name: "CRM Edu Panel",
  description: "O'quv markazlari uchun professional boshqaruv tizimi",
  url: "https://8-preact-end.vercel.app/",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeader = pathname === "/login";

  // desktop collapse (w-72 -> w-20)
  const [isOpen, setIsOpen] = useState(true);

  // mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";

  const pageTitle = useMemo(() => {
    const titles: { [key: string]: string } = {
      "/": "Boshqaruv Paneli",
      "/menagers": "Menejerlar",
      "/admins": "Adminlar",
      "/teachers": "O'qituvchilar",
      "/students": "Talabalar",
      "/groups": "Guruhlar",
      "/courses": "Kurslar",
      "/payment": "To'lovlar",
      "/settings": "Sozlamalar",
      "/profile": "Profil Ma'lumotlari",
    };
    return titles[pathname] || "CRM Panel";
  }, [pathname]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${pageTitle} | ${SITE_CONFIG.name}`;
    }
  }, [pageTitle]);

  useEffect(() => {
    const savedUser = Cookies.get("user") || localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed.data ? parsed.data : parsed);
      } catch {
        console.error("User parse error");
      }
    }
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const profileImg = useMemo(() => {
    if (!user?.image) return null;
    return user.image.startsWith("http")
      ? user.image
      : `${BASE_URL}/${user.image}`;
  }, [user, BASE_URL]);

  const SIDEBAR_OPEN = 288;
  const SIDEBAR_COLLAPSED = 80;

  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <meta name="description" content={SITE_CONFIG.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background text-foreground">
              {!hideHeader && (
                <>
                  <aside
                    className="hidden md:block fixed left-0 top-0 h-screen border-r border-border/60 bg-background/80 backdrop-blur-xl z-50"
                    style={{
                      width: isOpen ? SIDEBAR_OPEN : SIDEBAR_COLLAPSED,
                    }}
                  >
                    <div className="h-full overflow-y-auto">
                      <Hedaer isOpen={isOpen} />
                    </div>
                  </aside>

                  <div
                    className={`md:hidden fixed inset-0 z-[90] transition ${
                      mobileOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-black/50 transition-opacity ${
                        mobileOpen ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    />
                    <div
                      className={`absolute left-0 top-0 h-full w-[280px] bg-background border-r border-border/60 shadow-2xl transition-transform duration-300 ${
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                      }`}
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                        <div className="font-semibold">Menu</div>
                        <button
                          onClick={() => setMobileOpen(false)}
                          className="p-2 rounded-lg hover:bg-accent active:scale-95 transition"
                          aria-label="Close sidebar"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="h-[calc(100vh-56px)] overflow-y-auto">
                        <Hedaer isOpen={true} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div
                className="min-h-screen flex flex-col"
                style={{
                  paddingLeft: hideHeader ? 0 : undefined,
                }}
              >
                <div
                  className="flex-1 flex flex-col min-w-0"
                  style={{
                    marginLeft: hideHeader ? 0 : undefined,
                  }}
                >
                  {!hideHeader && (
                    <header
                      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl"
                      style={{
                        marginLeft: undefined,
                      }}
                    >
                      <div
                        className="w-full px-3 py-3 flex items-center justify-between"
                        style={{
                          marginLeft:
                            typeof window !== "undefined"
                              ? undefined
                              : undefined,
                        }}
                      >
                        <div
                          className="flex items-center gap-3 min-w-0"
                          style={{
                            marginLeft: 0,
                          }}
                        >
                          <button
                            onClick={() => {
                              if (window.innerWidth < 768) {
                                setMobileOpen(true);
                              } else {
                                setIsOpen((v) => !v);
                              }
                            }}
                            aria-label="Toggle Sidebar"
                            className="p-2 rounded-xl hover:bg-accent transition active:scale-90"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-5"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M9 3v18" />
                            </svg>
                          </button>

                          <nav className="flex items-center font-medium text-sm md:text-base min-w-0">
                            <span className="opacity-50 shrink-0">Asosiy</span>
                            <RightOutlined className="text-[10px] mx-2 opacity-30 shrink-0" />
                            <span className="font-semibold truncate">
                              {pageTitle}
                            </span>
                          </nav>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                          <ModeToggle />

                          <Link
                            href="/profile"
                            className="flex items-center gap-2 sm:gap-3 p-1 pl-2 rounded-full hover:bg-accent transition-all border border-transparent hover:border-border"
                          >
                            <div className="text-right hidden sm:block leading-tight">
                              <h3 className="text-sm font-semibold truncate max-w-[140px]">
                                {user?.first_name || "Menejer"}
                              </h3>
                              <p className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">
                                {user?.role || "Manager"}
                              </p>
                            </div>

                            <div className="w-9 h-9 relative rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                              {profileImg ? (
                                <img
                                  src={profileImg}
                                  alt="User avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon size={18} className="text-zinc-500" />
                              )}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </header>
                  )}

                  <div
                    className="flex-1 min-w-0"
                    style={{
                      marginLeft: hideHeader ? 0 : 0,
                    }}
                  >
                    <main
                      className="p-4 md:p-6"
                      style={{
                        marginLeft: hideHeader ? 0 : undefined,
                      }}
                    >
                      <div
                        className="w-full"
                        style={{
                          marginLeft:
                            typeof window === "undefined" ? 0 : undefined,
                        }}
                      >
                        <div
                          className={`w-full ${
                            hideHeader
                              ? ""
                              : isOpen
                                ? "md:pl-[288px]"
                                : "md:pl-[80px]"
                          }`}
                        >
                          {children}
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
              </div>

              {!hideHeader && (
                <style>{`
                  @media (min-width: 768px){
                    header > div{
                      padding-left: ${isOpen ? SIDEBAR_OPEN : SIDEBAR_COLLAPSED}px;
                    }
                  }
                `}</style>
              )}
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
