import { queryOptions } from '@tanstack/react-query';
import { QueryType } from '../query';
import { getFileInfo } from '../file';
import { getProfile } from '../profile';
import { execRules } from '../rule';

export const fileItemInfoQueryOptions = (
  profileId: string,
  file: string,
  index: number,
) =>
  queryOptions({
    queryKey: [QueryType.FileItemInfo, { profileId, file, index }],
    queryFn: async () => {
      const profile = await getProfile(profileId);
      const fileInfo = await getFileInfo(file);
      const result = await execRules(
        profile?.rules?.filter((rule) => rule.enabled) ?? [],
        { fileInfo, index },
      );
      const preview = result === fileInfo.fullName ? null : result;

      return {
        profile,
        fileInfo,
        preview,
      };
    },
  });
