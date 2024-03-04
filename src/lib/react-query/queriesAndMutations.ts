import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { createUserAccount } from '../appwrite/api';
import { TNewUser } from '@/types';

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: TNewUser) => createUserAccount(user),
    })
}