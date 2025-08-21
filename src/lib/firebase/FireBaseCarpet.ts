
import {doc, getDoc, Timestamp} from "firebase/firestore";
import {db} from "./index.ts";

export type CarpetDataType =  {
    carpetNum: string;
    carpetType: string;
    createdAt: Timestamp;
    imageUrls: string[];
    length: number;
    unit: string;
    width: number;
}
type CarpetDataTypeWithDate = Omit<CarpetDataType, "createdAt"> & {
    createdAt: Date;
};

export const getCarpetInfo = async (carpetNumber: string): Promise<CarpetDataTypeWithDate[] | undefined> => {
    try {
        const docRef = doc(db,'carpets', carpetNumber);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(docSnap.data());
            const data = docSnap.data() as CarpetDataType;
            return {
                ...data,
                createdAt: data.createdAt,
            };
        }
    } catch (e: any) {
        console.log(e);
    }
}