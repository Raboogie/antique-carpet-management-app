import { useEffect, useState } from 'react';
import { InputFormData } from '../components/UI/CarpetForm';
import { db, fireBaseStorage } from '../lib/firebase';
import {
	ref,
	uploadBytesResumable,
	getDownloadURL,
	UploadTaskSnapshot,
	StorageError,
} from 'firebase/storage';
import {doc, setDoc, serverTimestamp, getDoc, updateDoc, arrayUnion} from 'firebase/firestore';

export const useImageStorage = (data: InputFormData | null) => {
	const [progress, setProgress] = useState<number>(0);
	const [fireBaseError, setFirebaseError] = useState<Error | null>(null);
	const [urls, setUrls] = useState<string[]>([]);

	useEffect(() => {
		if (!data) return;

		const uploadImages = async () => {
			try {
				const urlPromises = data.image.map((file) => {
					const carpetNumber = data.carpetNum;
					const storageRef = ref(
						fireBaseStorage,
						`images/${carpetNumber}/${file.name}`
					);
					const uploadTask = uploadBytesResumable(storageRef, file);

					return new Promise<string>((resolve, reject) => {
						uploadTask.on(
							'state_changed',
							(snapshot: UploadTaskSnapshot) => {
								const percentage =
									(snapshot.bytesTransferred /
										snapshot.totalBytes) *
									100;
								setProgress(percentage);
							},
							(err: StorageError) => {
								setFirebaseError(err);
								reject(err);
							},
							async () => {
								const downloadURL = await getDownloadURL(
									uploadTask.snapshot.ref
								);
								resolve(downloadURL);
							}
						);
					});
				});

				const downloadedUrls = await Promise.all(urlPromises);
				setUrls(downloadedUrls);

				// Add carpet data to Firestore
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { image, ...carpetData } = data;
				const docRef = doc(db, 'carpets', `${carpetData.carpetNum}`);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    await setDoc(docRef, {
                        ...carpetData,
                        imageUrls: downloadedUrls,
                        createdAt: serverTimestamp(),
                    });
                } else {
                    await updateDoc(docRef,{
                        "carpetType": carpetData.carpetType,
                        "length": carpetData.length,
                        "width": carpetData.width,
                        "unit": carpetData.unit,
                        "imageUrls": arrayUnion(...downloadedUrls),
                        createdAt: serverTimestamp()
                    })
                }

				// await addDoc(collection(db, 'carpets'), {
				// 	...carpetData,
				// 	imageUrls: downloadedUrls,
				// 	createdAt: serverTimestamp(),
				// });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				setFirebaseError(err);
			}
		};

		uploadImages();
	}, [data]);

	return { progress, urls, fireBaseError };
};
