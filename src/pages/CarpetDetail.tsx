import { useParams, useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { CarpetDataTypeWithDate, getCarpetInfo } from '../lib/firebase/FireBaseCarpet';
import { CarpetDetails } from '../components/UI/CarpetDetails';
import { ImageGrid } from '../components/UI/ImageGrid';
import { useUserContext } from '../lib/UserContext';
import '../Css/pages/CarpetDetail.css';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CarpetDetail() {
    const { carpetNum } = useParams<{ carpetNum: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const userCtx = useUserContext();
    const isAdmin = userCtx.userRole === 'Admin';
    const [carpet, setCarpet] = useState<CarpetDataTypeWithDate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!carpetNum) {
            setError(true);
            setLoading(false);
            return;
        }

        getCarpetInfo(carpetNum)
            .then((carpetDocs) => {
                if (carpetDocs && carpetDocs.length > 0) {
                    setCarpet(carpetDocs[0]);
                } else {
                    setError(true);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching carpet details:', err);
                setError(true);
                setLoading(false);
            });
    }, [carpetNum]);

    const handleGoBack = () => {
        // If we have search params from where we came from, navigate back with them
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            // Otherwise, just go back in history (preserves URL params)
            navigate(-1);
        }
    };

    const handleImageDeleted = (deletedUrl: string) => {
        setCarpet((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                imageUrls: prev.imageUrls.filter((url) => url !== deletedUrl),
            };
        });
    };

    if (loading) {
        return (
            <div className="carpet-detail-container">
                <div className="carpet-detail-loading">Loading carpet details...</div>
            </div>
        );
    }

    if (error || !carpet) {
        return (
            <div className="carpet-detail-container">
                <div className="carpet-detail-error">
                    <h2>Carpet Not Found</h2>
                    <p>The carpet you're looking for doesn't exist or couldn't be loaded.</p>
                    <Button variant="contained" onClick={handleGoBack} startIcon={<ArrowBackIcon />}>
                        Back to Search
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="carpet-detail-container">
            <div className="carpet-detail-header">
                <Button
                    variant="outlined"
                    onClick={handleGoBack}
                    startIcon={<ArrowBackIcon />}
                    className="back-button"
                >
                    Back to Search
                </Button>
                <h1>Carpet Details</h1>
            </div>
            <div className="carpet-detail-content">
                <CarpetDetails carpet={carpet} />
                <div className="carpet-detail-images">
                    <h2>Images</h2>
                    <ImageGrid
                        imageUrls={carpet.imageUrls}
                        isAdmin={isAdmin}
                        carpetNum={carpet.carpetNum}
                        onImageDeleted={handleImageDeleted}
                    />
                </div>
            </div>
        </div>
    );
}
