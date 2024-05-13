import { ProfileNavList } from '@/components/profile/profile-nav-list';
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProfile, getProfile, type Profile } from '@/lib/profile';
import { nanoid } from 'nanoid';
import { QueryType } from '@/lib/query';
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { atomStore, filesAtom } from '@/lib/atoms';
import { execRules } from '@/lib/rule';
import { dirname, join } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api';
import { getFileInfo } from '@/lib/file';

export const Route = createFileRoute('/profile')({
  component: Component,
});

function Component() {
  const queryClient = useQueryClient();
  const params = useParams({ from: '/profile/$profileId' });
  const [sidePanelOpened, setSidePanelOpened] = useState(true);

  const navStyle = useSpring({
    width: sidePanelOpened ? 240 : 0,
    opacity: sidePanelOpened ? 1 : 0,
  });

  const addProfileButtonStyle = useSpring({
    transform: sidePanelOpened ? 'rotate(0deg)' : 'rotate(180deg)',
  });

  const { mutate: execAddProfile } = useMutation({
    mutationFn: async (info: Omit<Profile, 'id'>) => {
      return addProfile(info);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [QueryType.ProfileIds] });
    },
  });

  const { mutate: execProfile } = useMutation({
    mutationFn: async (profileId: string) => {
      const profile = await getProfile(profileId);
      const files = atomStore.get(filesAtom);

      for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i];
        const fileInfo = await getFileInfo(file);

        const output = await execRules(profile!.rules, {
          fileInfo,
          index: i,
        });

        if (output === fileInfo.fullName) {
          continue;
        }

        const dir = await dirname(file);
        const outputFile = await join(dir, output);

        await invoke('rename', {
          old: file,
          new: outputFile,
        });
      }

      atomStore.set(filesAtom, []);
    },
  });

  function handleExecClick() {
    params.profileId && execProfile(params.profileId);
  }

  return (
    <div className="flex size-full bg-white">
      <animated.nav
        style={navStyle}
        className="h-full overflow-hidden border-r"
      >
        <div className="h-[calc(100%-3.5rem)] w-full">
          <ProfileNavList />
        </div>
        <div className="flex h-14 w-full items-center justify-center border-t px-2">
          <Button
            variant="ghost"
            className="w-full rounded text-sm"
            size="sm"
            onClick={() => {
              execAddProfile({
                name: nanoid(4),
                rules: [],
              });
            }}
          >
            添加配置
          </Button>
        </div>
      </animated.nav>
      <main className="h-full flex-1">
        <div className="flex h-12 w-full items-center justify-between px-2 pr-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidePanelOpened((prevOpend) => !prevOpend)}
            asChild
          >
            <animated.button style={addProfileButtonStyle}>
              <IconLayoutSidebarLeftCollapse />
            </animated.button>
          </Button>
          <Button size="sm" onClick={handleExecClick}>
            执行
          </Button>
        </div>
        <div className="h-[calc(100%-3rem)] w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
