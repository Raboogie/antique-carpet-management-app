import { useParams, useNavigate, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CarpetDataTypeWithDate, getCarpetInfo, deleteCarpet } from '../lib/firebase/FireBaseCarpet';
import { CarpetDetails } from '../components/UI/CarpetDetails';
import { ImageGrid } from '../components/UI/ImageGrid';
import { useUserContext } from '../lib/UserContext';
import '../Css/pages/CarpetDetail.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { ErrorBoundary } from 'react-error-boundary';
import { FullPageErrorFallback } from '../components/UI/ErrorBoundaryFallback';

export default function CarpetDetail() {
    const { carpetNum } = useParams<{ carpetNum: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const userCtx = useUserContext();
    const isAdmin = userCtx.userRole === 'Admin';
    const [carpet, setCarpet] = useState<CarpetDataTypeWithDate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeletingCarpet, setIsDeletingCarpet] = useState(false);
    const queryClient = useQueryClient();

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

    const handleDeleteCarpetConfirm = async () => {
        if (!carpet || !carpetNum) return;
        setIsDeletingCarpet(true);
        try {
            await deleteCarpet(carpetNum, carpet.imageUrls);
            await queryClient.invalidateQueries({ queryKey: ['carpets'] });
            handleGoBack();
        } catch (err) {
            console.error('Error deleting carpet:', err);
        } finally {
            setIsDeletingCarpet(false);
            setIsDeleteDialogOpen(false);
        }
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
                <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
                    <CarpetDetails carpet={carpet} />
                    <div className="carpet-detail-images">
                        <h2>Images</h2>
                        <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
                            <ImageGrid
                                imageUrls={carpet.imageUrls}
                                isAdmin={isAdmin}
                                carpetNum={carpet.carpetNum}
                                onImageDeleted={handleImageDeleted}
                            />
                        </ErrorBoundary>
                    </div>
                </ErrorBoundary>
                {isAdmin && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        startIcon={<DeleteIcon />}
                        className="delete-carpet-button"
                        style={{ marginLeft: 'auto' }}
                    >
                        Delete Carpet
                    </Button>
                )}
            </div>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Carpet</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this carpet? This action will also delete all its associated images from storage and cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingCarpet}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteCarpetConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isDeletingCarpet}
                    >
                        {isDeletingCarpet ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
