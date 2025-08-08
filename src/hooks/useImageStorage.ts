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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const useImageStorage = (data: InputFormData | null) => {
	const [progress, setProgress] = useState<number>(0);
	const [fireBaseError, setFirebaseError] = useState<Error | null>(null);
	const [urls, setUrls] = useState<string[]>([]);

	useEffect(() => {
		if (!data) return;

		const uploadImages = async () => {
			try {
				const urlPromises = data.image.map((file) => {
					const storageRef = ref(
						fireBaseStorage,
						`images/${file.name}`
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
				await addDoc(collection(db, 'carpets'), {
					...carpetData,
					imageUrls: downloadedUrls,
					createdAt: serverTimestamp(),
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				setFirebaseError(err);
			}
		};

		uploadImages();
	}, [data]);

	return { progress, urls, fireBaseError };
};
