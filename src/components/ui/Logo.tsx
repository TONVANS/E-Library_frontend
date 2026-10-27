import Image from 'next/image';
import { BASE_PATH } from '@/lib/api-config';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  priority?: boolean;
}

// NUOL emblem from public/images/Logo.png. next/image does not prefix basePath on its own.
export function Logo({ className, priority }: LogoProps) {
  return (
    <span
      className={cn(
        'relative block shrink-0 rounded-full bg-white overflow-hidden shadow-md ring-1 ring-[#003d9b]/10',
        className,
      )}
    >
      <Image
        src={`${BASE_PATH}/images/Logo.png`}
        alt="ມະຫາວິທະຍາໄລແຫ່ງຊາດ (NUOL)"
        fill
        sizes="64px"
        priority={priority}
        unoptimized
        // The PNG has white padding around the emblem; scale it up so the emblem fills the circle
        className="object-contain scale-[1.18]"
      />
    </span>
  );
}
