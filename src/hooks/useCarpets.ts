import { useQuery } from '@tanstack/react-query';
import { getCarpetInfo, getCarpetBySize, getCarpetByType, CarpetDataTypeWithDate } from '../lib/firebase/FireBaseCarpet';

export type SearchParams =
    | { type: 'number'; carpetNum: string }
    | { type: 'dimensions'; maxWidth: number; minWidth?: number | null; maxLength: number; minLength?: number | null }
    | { type: 'type'; carpetType: string }
    | null;

export const useCarpets = (searchParams: SearchParams) => {
    return useQuery<CarpetDataTypeWithDate[], Error>({
        queryKey: ['carpets', searchParams],
        queryFn: async () => {
            if (!searchParams) return [];

            switch (searchParams.type) {
                case 'number':
                    return getCarpetInfo(searchParams.carpetNum);
                case 'dimensions':
                    return getCarpetBySize(
                        searchParams.maxWidth,
                        searchParams.minWidth ?? null,
                        searchParams.maxLength,
                        searchParams.minLength ?? null
                    );
                case 'type':
                    return getCarpetByType(searchParams.carpetType);
                default:
                    return [];
            }
        },
        enabled: !!searchParams,
        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        structuralSharing: false, // Firestore objects (Timestamps/Dates) don't serialize cleanly
    });
};
