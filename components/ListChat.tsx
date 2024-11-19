'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { listfriends} from '@/constants';
import { cn } from '@/lib/utils';

const ListChats = () => {
  const pathname = usePathname();

  return (
    <section className="sticky right-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-0 text-white max-sm:hidden lg:w-[264px]">
  <div className="flex flex-1 flex-col gap-6 h-full items-stretch">
    {listfriends.map((item) => {
      const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

      return (
        <Link
          href={item.route}
          key={item.label}
          className={cn(
            'flex items-center gap-1 border border-white rounded-lg p-2',
            {
              'bg-blue-1': isActive,
            }
          )}
          
        >
          <Image
            src={item.imgURL}
            alt={item.label}
            width={24}
            height={24}
          />
          <p className="text-lg font-semibold max-lg:hidden">
            {item.label}
          </p>
        </Link>
      );
    })}
  </div>
</section>
  );
};

export default ListChats;
