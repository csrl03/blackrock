import Image from '@/components/ui/image';
import cn from '@/utils/cn';
import { StaticImageData } from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import Avatar from '@/components/ui/avatar';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { useEffect, useState } from 'react';

type ItemType = {
  id?: string | number;
  name: string;
  slug: string;
  title: string;
  cover_image: StaticImageData;
  image?: StaticImageData | string;
  number_of_artwork: number;
  user: {
    avatar?: StaticImageData | string;
    name: string;
    slug: string;
    id?: number;
  };
};
type CardProps = {
  item: ItemType;
  className?: string;
};

export default function CollectionCard({ item, className = '' }: CardProps) {
  const { name, slug, title, cover_image, image, number_of_artwork, user } = item ?? {};
  const { layout } = useLayout();

  // Estado para el avatar del usuario (desde backend)
  const [userAvatar, setUserAvatar] = useState<string | StaticImageData | undefined>(user?.avatar);

  useEffect(() => {
    // Si el usuario tiene id, intenta traer el avatar desde el backend
    if (user?.id) {
      fetch(`https://blackrockdpto.net/api/users`)
        .then((res) => res.json())
        .then((data) => {
          const foundUser = data.users.find((u: any) => u.id === user.id);
          if (foundUser?.profileImage) {
            setUserAvatar(foundUser.profileImage);
          }
        })
        .catch((err) => {
          console.error('Error al obtener el avatar del usuario:', err);
        });
    }
  }, [user?.id]);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className,
      )}
    >
      <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
        <Image
          src={cover_image}
          placeholder="blur"
          width={600}
          priority
          quality={100}
          alt={name}
        />
      </div>
      <div className="absolute left-0 top-0 z-[5] flex h-full w-full flex-col justify-between bg-gradient-to-t from-black p-5 md:p-6">
        <AnchorLink
          href={
            '/' + (layout === LAYOUT_OPTIONS.MODERN ? '' : layout + '/') + slug
          }
          className="absolute left-0 top-0 z-10 h-full w-full"
        />
        <div className="flex justify-between gap-3">
          <div
            className="inline-flex h-8 shrink-0 items-center rounded-2xl bg-white/20 px-4 text-xs font-medium uppercase -tracking-wide text-white
          backdrop-blur-[40px]"
          >
            {name}
          </div>
          {image && (
            <Avatar image={image} alt={name} shape="rounded" width={64} height={64} />
          )}
        </div>
        <div className="block">
          <h2 className="mb-1.5 truncate text-lg font-medium -tracking-wider text-white">
            {title}
          </h2>
          <div className="text-sm font-medium -tracking-wide text-[#B6AAA2]">
            {number_of_artwork} Artworks
          </div>
          <AnchorLink
            href={user?.slug}
            className="relative z-10 mt-3.5 inline-flex items-center rounded-3xl bg-white/20 p-2 backdrop-blur-[40px]"
          >
            <Avatar
              image={userAvatar}
              alt={user?.name}
              size="xs"
              width={24}
              height={24}
              className="rounded-full"
            />

            <div className="truncate text-sm -tracking-wide text-white ltr:ml-2 ltr:pr-2 rtl:mr-2 rtl:pl-2">
              @{user?.name}
            </div>
          </AnchorLink>
        </div>
      </div>
    </div>
  );
}