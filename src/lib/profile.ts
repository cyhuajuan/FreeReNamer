import { nanoid } from 'nanoid';
import { QueryType } from './query';
import { store } from './store';
import type { Rule } from './rule';

export interface Profile {
  id: string;
  name: string;
  rules: Rule[];
}

export async function getProfileIds() {
  const profileIds = await store.get<string[]>(QueryType.ProfileIds);

  return profileIds ?? [];
}

export async function setProfileIds(profileIds: string[]) {
  await store.set(QueryType.ProfileIds, profileIds);
}

export const getProfileStoreKey = (profileId: string) =>
  `${QueryType.Profile}/${profileId}`;

export async function getProfile(id: string) {
  const sk = getProfileStoreKey(id);
  const profile = await store.get<Profile>(sk);

  return profile;
}

export const DEFAULT_PROFILE: Omit<Profile, 'id'> = {
  name: '默认配置',
  rules: [],
};

export async function addProfile(info: Omit<Profile, 'id'>): Promise<string> {
  const newProfile: Profile = {
    ...info,
    id: nanoid(8),
  };
  const sk = getProfileStoreKey(newProfile.id);

  await store.set(sk, newProfile);

  const profileIds = await getProfileIds();

  await setProfileIds([...profileIds, newProfile.id]);

  return newProfile.id;
}

export async function updateProfile(
  id: string,
  info: Partial<Omit<Profile, 'id'>>,
): Promise<void> {
  const sk = getProfileStoreKey(id);
  const profile = await store.get<Profile>(sk);

  await store.set(sk, { ...profile, ...info });
}

export async function delProfile(id: string): Promise<void> {
  const sk = getProfileStoreKey(id);
  const profileIds = await getProfileIds();

  await setProfileIds(profileIds.filter((profileId) => profileId !== id));
  await store.delete(sk);
}
