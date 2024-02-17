'use client';

import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import clsx from 'clsx';
import { throttle } from 'lodash';

// if you change this value, you have to change tailwind class manually
const NAVBAR_WIDTH = 270; // px

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState<boolean | null>(null);

  useEffect(() => {
    const closeMenu = () => {
      const isMobile = window.innerWidth < 640;

      if (isMobile) {
        setShowMenu(false);
      }
    };

    const openMenu = () => {
      const isDesktop = window.innerWidth >= 640;

      if (isDesktop) setShowMenu(true)
    };

    openMenu();

    const toggleMenuHandler = throttle(openMenu, 300);

    window.addEventListener('resize', toggleMenuHandler);
    window.addEventListener('click', closeMenu);

    return () => {
      window.removeEventListener('resize', toggleMenuHandler);
      window.removeEventListener('click', closeMenu);
    };
  }, []);

  return (
    <div className="relative side-padding grow overflow-hidden pt-20 sm:pt-6 max-w-[1600px] mx-auto">
      <div className="absolute w-full left-0 top-[-1px] sm:hidden">
        <button
          onClick={e => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="w-full flex items-center gap-2 p-3 fixed bg-white z-30 border"
        >
          <span className={clsx({
            "transition-all text-2xl": true,
            "rotate-90": showMenu,
            "rotate-0": !showMenu
          })}>
            ≡
          </span><span>Меню</span>
        </button>
      </div>
      <div className="flex gap-3 h-full">
        <Nav
          show={showMenu}
          hide={() => setShowMenu(false)}
          width={NAVBAR_WIDTH}
        />
        <div
          className={clsx({
            "flex grow transition-all pl-0 sm:pl-[270px]": true,
            "pl-[270px]": showMenu === true,
            "pl-0": showMenu === false
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}