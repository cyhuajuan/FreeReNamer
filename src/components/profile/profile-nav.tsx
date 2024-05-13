import { profileQueryOptions } from '@/lib/queries/profile';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

export interface ProfileNavProps {
  id: string;
}

export const ProfileNav: FC<ProfileNavProps> = ({ id }) => {
  const { data: profile } = useQuery(profileQueryOptions(id));

  if (!profile) {
    return null;
  }

  return (
    <Link
      to="/profile/$profileId"
      params={{ profileId: id }}
      className="line-clamp-1 h-8 w-full break-all rounded px-4 text-sm leading-8 ring-offset-background transition-colors data-[status=active]:bg-primary data-[status=active]:hover:bg-primary/85 hover:bg-accent data-[status=active]:text-primary-foreground hover:text-accent-foreground"
    >
      {profile.name}
    </Link>
  );
};
