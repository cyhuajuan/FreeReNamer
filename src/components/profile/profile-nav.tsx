import { profileQueryOptions } from '@/lib/queries/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { showConfirm, showRenameDialog } from '@/lib/ui';
import { delProfile, updateProfile } from '@/lib/profile';
import { QueryType } from '@/lib/query';

export interface ProfileNavProps {
  id: string;
  disableDel?: boolean;
}

export const ProfileNav: FC<ProfileNavProps> = ({ id, disableDel = false }) => {
  const queryClient = useQueryClient();
  const params = useParams({ from: '/profile/$profileId' });
  const navigate = useNavigate();
  const { data: profile } = useQuery(profileQueryOptions(id));
  const { mutate: rename } = useMutation({
    mutationFn: async (name: string) => {
      return updateProfile(id, { name });
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [QueryType.Profile, { id }] });
    },
  });
  const { mutate: del } = useMutation({
    mutationFn: async () => {
      return delProfile(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryType.ProfileIds] });
      await queryClient.invalidateQueries({
        queryKey: [QueryType.Profile, { id }],
      });

      if (params.profileId === id) {
        navigate({ to: '/' });
      }
    },
  });

  function onRename() {
    showRenameDialog((name) => {
      rename(name);
    });
  }

  function onDel() {
    showConfirm({
      title: '确定删除？',
      description: '删除后数据无法恢复',
      onOk: () => {
        del();
      },
    });
  }

  if (!profile) {
    return null;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          to="/profile/$profileId"
          params={{ profileId: id }}
          className="line-clamp-1 h-8 w-full break-all rounded px-4 text-sm leading-8 ring-offset-background transition-colors data-[status=active]:bg-primary data-[status=active]:hover:bg-primary/85 hover:bg-accent data-[status=active]:text-primary-foreground hover:text-accent-foreground"
        >
          {profile.name}
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onRename}>重命名</ContextMenuItem>
        {!disableDel && <ContextMenuItem onClick={onDel}>删除</ContextMenuItem>}
      </ContextMenuContent>
    </ContextMenu>
  );
};
