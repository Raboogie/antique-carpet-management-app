import React, { useState, useEffect } from "react";
import '../../Css/UI/FileUpload.css';

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    error?: string;
    value?: File[]; // Receive current value from react-hook-form
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function FileUpload({ onFileSelect, error, value = [] }: FileUploadProps) {
    const [imageFiles, setImageFiles] = useState<File[]>(value);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Sync internal state with the form's state
    useEffect(() => {
        setImageFiles(value);
    }, [value]);

    const uploadChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles: File[] = [];
            let errorMessage = "";

            newFiles.forEach((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    errorMessage = `File ${file.name} exceeds the maximum size of 5MB.`;
                } else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                    errorMessage = `File ${file.name} has an unsupported format.`;
                } else {
                    validFiles.push(file);
                }
            });

            if (validFiles.length > 0) {
                const updatedFiles = [...imageFiles, ...validFiles];
                setImageFiles(updatedFiles);
                onFileSelect(updatedFiles);
            }

            setValidationError(errorMessage || null);
        }
    };

    const removeFileHandler = (indexToRemove: number) => {
        const updatedFiles = imageFiles.filter((_, index) => index !== indexToRemove);
        setImageFiles(updatedFiles);
        onFileSelect(updatedFiles);
    };

    return (
        <div className="image-upload">
            <div className="image-form">
                <p>Upload Images</p>
                <label className="image-label">
                    <input
                        type="file"
                        multiple
                        onChange={uploadChangeHandler}
                        accept="image/png, image/jpeg, image/webp"
                    />
                    Add Files
                </label>
                <div className="output">
                    {error && <div className="error"> {error} </div>}
                    {validationError && <div className="error"> {validationError} </div>}
                    {imageFiles.length > 0 && !error && (
                        <ul>
                            {imageFiles.map((file, index) => (
                                <li key={index}>
                                    {file.name}
                                    <button type="button" onClick={() => removeFileHandler(index)}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}