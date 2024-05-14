import { profileIdsQueryOptions } from '@/lib/queries/profile';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { ProfileNav } from './profile-nav';

export const ProfileNavList: FC = () => {
  const { data: profileIds = [] } = useQuery(profileIdsQueryOptions);

  return (
    <div className="flex w-full flex-col gap-y-2 p-2">
      {profileIds.map((profileId) => {
        return (
          <ProfileNav
            key={profileId}
            id={profileId}
            disableDel={profileIds.length === 1}
          />
        );
      })}
    </div>
  );
};
