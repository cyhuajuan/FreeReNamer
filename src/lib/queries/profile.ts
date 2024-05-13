import { queryOptions } from '@tanstack/react-query';
import { QueryType } from '../query';
import { getProfile, getProfileIds } from '../profile';

export const profileIdsQueryOptions = queryOptions({
	queryKey: [QueryType.ProfileIds],
	queryFn: async () => {
		return getProfileIds();
	},
});

export const profileQueryOptions = (id: string) =>
	queryOptions({
		queryKey: [QueryType.Profile, { id }],
		queryFn: async () => {
			return getProfile(id);
		},
	});
