'use client';

import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import clsx from 'clsx';
import { throttle } from 'lodash';

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
    <div className="[--menu-height:3.5rem] [--top-padding:calc(var(--menu-height)+1rem)] relative side-padding grow overflow-hidden pt-[--top-padding] sm:pt-6 max-w-[1600px] mx-auto">
      <div className="absolute w-full left-0 top-[-1px] sm:hidden">
        <button
          onClick={e => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="w-full h-[--menu-height] px-3 flex items-center gap-2 fixed bg-white z-30 border"
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
      <div className="flex gap-3 h-full [--nav-width:230px]">
        <Nav
          show={showMenu}
          hide={() => setShowMenu(false)}
        />
        <div
          className={clsx({
            "flex w-full transition-all pl-0 sm:pl-[calc(var(--nav-width)+1rem)]": true,
            "pl-[calc(var(--nav-width)+1rem)]": showMenu === true,
            "pl-0": showMenu === false
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}