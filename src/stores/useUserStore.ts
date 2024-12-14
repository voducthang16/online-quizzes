import { create } from 'zustand';
import { UserModel } from '@/models';
import { LocalStorageUtil } from '@/utils';

const USER_INFO_KEY = 'userInfo';

interface UserState {
    userInfo: Partial<UserModel> | null;
    setUserInfo: (userInfo: Partial<UserModel>) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    userInfo: LocalStorageUtil.get<Partial<UserModel>>(USER_INFO_KEY),

    setUserInfo: (userInfo: Partial<UserModel>) => {
        LocalStorageUtil.set(USER_INFO_KEY, userInfo);
        set({ userInfo });
    },

    logout: () => {
        LocalStorageUtil.clear();
        set({ userInfo: null });
    }
}));
