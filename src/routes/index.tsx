import { DEFAULT_PROFILE, addProfile } from '@/lib/profile';
import { profileIdsQueryOptions } from '@/lib/queries/profile';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context: { queryClient } }) => {
		const profileIds = await queryClient.fetchQuery(profileIdsQueryOptions);

		if (profileIds.length > 0) {
			throw redirect({
				to: '/profile/$profileId',
				params: {
					profileId: profileIds[0],
				},
			});
		}

		const newProfileId = await addProfile(DEFAULT_PROFILE);

		throw redirect({
			to: '/profile/$profileId',
			params: {
				profileId: newProfileId,
			},
		});
	},
});
