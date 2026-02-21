
import {collection, doc, getDoc, getDocs, query, Timestamp, where, QueryConstraint, updateDoc, arrayRemove} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage";
import {db, fireBaseStorage} from "./index.ts";

export type CarpetDataType =  {
    carpetNum: string;
    carpetType: string;
    createdAt: Timestamp;
    imageUrls: string[];
    length: number;
    unit: string;
    width: number;
}
export type CarpetDataTypeWithDate = Omit<CarpetDataType, "createdAt"> & {
    createdAt: Date;
};

export const getCarpetInfo = async (carpetNumber: string): Promise<CarpetDataTypeWithDate[]> => {
    try {
        const docRef = doc(db,'carpets', carpetNumber);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as CarpetDataType;
            return [{
                ...data,
                createdAt: data.createdAt.toDate(),
            }];
        }
        return [];
    } catch (e: unknown) {
        console.error("Error in getCarpetInfo:", e instanceof Error ? e.message : e);
        return [];
    }
}

export const getCarpetBySize = async (maxWidth: number, minWidth: number | null, maxLength: number, minLength: number | null): Promise<CarpetDataTypeWithDate[]> => {
    try {
        const carpetsRef = collection(db, "carpets");
        const constraints: QueryConstraint[] = [];

        // If minWidth is 0 or null, replace with maxWidth (implies exact match or range start at max)
        const effectiveMinWidth = (minWidth === 0 || minWidth === null) ? maxWidth : minWidth;
        const effectiveMinLength = (minLength === 0 || minLength === null) ? maxLength : minLength;

        if (maxWidth && maxWidth > 0) {
            constraints.push(where("width", "<=", maxWidth));
        }
        if (effectiveMinWidth && effectiveMinWidth > 0) {
            constraints.push(where("width", ">=", effectiveMinWidth));
        }

        const q = query(carpetsRef, ...constraints);

        const querySnapshot = await getDocs(q);
        const carpets: CarpetDataTypeWithDate[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data() as CarpetDataType;

            const meetsLengthConstraint =
                (!maxLength || data.length <= maxLength) &&
                (!effectiveMinLength || effectiveMinLength <= 0 || data.length >= effectiveMinLength);

            if (meetsLengthConstraint) {
                carpets.push({
                    ...data,
                    createdAt: data.createdAt.toDate(),
                });
            }
        });

        return carpets;
    } catch (e: unknown) {
        console.error("Error in getCarpetBySize:", e instanceof Error ? e.message : e);
        return [];
    }
};

export const getCarpetByType = async (carpetType: string): Promise<CarpetDataTypeWithDate[]> => {
    try {
        const carpetsRef = collection(db, "carpets");
        const q = query(carpetsRef, where("carpetType", "==", carpetType));
        const querySnapshot = await getDocs(q);
        const carpets: CarpetDataTypeWithDate[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as CarpetDataType;
            carpets.push({
                ...data,
                createdAt: data.createdAt.toDate(),
            });
        });
        return carpets;
    } catch (e: unknown) {
        console.error("Error in getCarpetByType:", e instanceof Error ? e.message : e);
        return [];
    }
};

/**
 * Deletes a single image from a carpet document.
 * Removes the file from Firebase Storage and the URL from the Firestore imageUrls array.
 */
export const deleteCarpetImage = async (carpetNum: string, imageUrl: string): Promise<void> => {
    // Extract the storage path from the download URL
    // Firebase Storage download URLs contain the path encoded between /o/ and ?
    const url = new URL(imageUrl);
    const pathSegment = url.pathname.split('/o/')[1];
    if (!pathSegment) {
        throw new Error(`Could not extract storage path from image URL: ${imageUrl}`);
    }
    const storagePath = decodeURIComponent(pathSegment);

    // Delete from Firebase Storage
    const storageRef = ref(fireBaseStorage, storagePath);
    await deleteObject(storageRef);

    // Remove the URL from the Firestore document's imageUrls array
    const docRef = doc(db, 'carpets', carpetNum);
    await updateDoc(docRef, {
        imageUrls: arrayRemove(imageUrl),
    });
};
