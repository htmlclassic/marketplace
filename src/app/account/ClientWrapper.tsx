'use client';

import { useEffect, useState } from 'react';
import Nav from './Nav';
import clsx from 'clsx';
import { throttle } from 'lodash';

// if you change this value, you have to change tailwind class manually
const NAVBAR_WIDTH = 270; // px

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState<boolean | null>(null);

  useEffect(() => {
    const toggleMenu = () => {
      const isMobile = window.innerWidth < 640;

      if (!isMobile) setShowMenu(true)
    };

    toggleMenu();

    const toggleMenuHandler = throttle(toggleMenu, 300);

    window.addEventListener('resize', toggleMenuHandler);

    return () => window.removeEventListener('resize', toggleMenuHandler);
  }, []);

  return (
    <div className="relative side-padding grow overflow-hidden pt-20 sm:pt-6">
      <div className="absolute w-full left-0 top-[-1px] sm:hidden">
        <button
          onClick={() => setShowMenu(!showMenu)}
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
        <Nav show={showMenu} width={NAVBAR_WIDTH} />
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