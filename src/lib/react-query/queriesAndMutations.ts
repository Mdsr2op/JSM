import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { createUserAccount, signInAccount } from '../appwrite/api';
import { TNewUser } from '@/types';

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: TNewUser) => createUserAccount(user),
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {username: string, password: string}) => signInAccount(user),
    })
}