'use client';

import { createClientSupabaseClient } from "@/supabase/utils_client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

// I fucked up with the order in imports and in an array below
import PhonelinkOutlinedIcon from '@mui/icons-material/PhonelinkOutlined';
import ToysOutlinedIcon from '@mui/icons-material/ToysOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import SnowboardingOutlinedIcon from '@mui/icons-material/SnowboardingOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import RollerSkatingOutlinedIcon from '@mui/icons-material/RollerSkatingOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import NaturePeopleOutlinedIcon from '@mui/icons-material/NaturePeopleOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import EighteenUpRatingOutlinedIcon from '@mui/icons-material/EighteenUpRatingOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import CurrencyBitcoinOutlinedIcon from '@mui/icons-material/CurrencyBitcoinOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';

const icons = [
  <PhonelinkOutlinedIcon />,
  <CheckroomOutlinedIcon />,
  <RollerSkatingOutlinedIcon />,
  <YardOutlinedIcon />,
  <ToysOutlinedIcon />,
  <DirectionsRunOutlinedIcon />,
  <KitchenOutlinedIcon />,
  <SnowboardingOutlinedIcon />,
  <HandymanOutlinedIcon />,
  <LunchDiningOutlinedIcon />,
  <MedicationOutlinedIcon />,
  <PetsOutlinedIcon />,
  <ImportContactsOutlinedIcon />,
  <NaturePeopleOutlinedIcon />,
  <DirectionsCarFilledOutlinedIcon />,
  <WeekendOutlinedIcon />,
  <GestureOutlinedIcon />,
  <DiamondOutlinedIcon />,
  <WatchOutlinedIcon />,
  <VideogameAssetOutlinedIcon />,
  <DesignServicesOutlinedIcon />,
  <EighteenUpRatingOutlinedIcon />,
  <TravelExploreOutlinedIcon />,
  <CurrencyBitcoinOutlinedIcon />,
  <ScienceOutlinedIcon />,
];

interface Props {
  hide: () => void;
  show: boolean;
}

type Categories = Awaited<ReturnType<typeof getCategories>>;

export default function CatalogClient({ show, hide }: Props) {
  const [categories, setCategories] = useState<Categories | null>(null);

  useEffect(() => {
    (async () => {
      const categories = await getCategories();
      setCategories(categories);
    })();
  }, []);

  if (!categories) return null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={clsx({
        "flex [--initial-translate:calc(var(--header-height))] catalog-max-height-mobile sm:catalog-max-height-desktop z-50 bg-black text-white bg-opacity-80 backdrop-blur-md absolute left-1/2 top-0 -translate-x-1/2 w-[95%] max-w-6xl p-6 rounded-2xl transition-all duration-300 ease-in-out": true,
        "translate-y-[calc(var(--initial-translate)+1rem)]": show,
        "opacity-0 pointer-events-none translate-y-[calc(var(--initial-translate)-1rem)]": !show
      })}
    >
    <div className="w-full overflow-y-auto overflow-x-hidden grid grid-cols-[repeat(1,1fr)] sm:grid-cols-[repeat(2,1fr)] md:grid-cols-[repeat(2,1fr)] lg:grid-cols-[repeat(3,1fr)] xl:lg:grid-cols-[repeat(4,1fr)] gap-x-5 gap-y-7 justify-between">
        {
          categories.map((cat, i) =>
            <Link
              href={`/search?category=${cat.name}`}
              className="transition-all hover:text-sky-400 flex items-center gap-3 [overflow-wrap:anywhere]"
              onClick={hide}
              key={cat.id}
            >
              {icons[i]}
              {cat.name}
            </Link>
          )
        }
      </div>
    </div>
  );
}

async function getCategories() {
  const supabase = createClientSupabaseClient();

  const { data: categories } = await supabase
    .from('category')
    .select('id, name');

  return categories?.length ? categories : null;
}