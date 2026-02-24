import { useState, useEffect, useCallback } from 'react';
import { carpetData } from '../../lib/constants/HomePageData.ts';
import '../../Css/UI/HeroCarousel.css';

const ANIMATION_TRANSITION_DELAY = 80;

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    
    // Alternate slide direction for each carpet
    const slideFromLeft = currentIndex % 2 === 0;

    const advanceSlide = useCallback(() => {
        setIsAnimating(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % carpetData.length);
            setIsAnimating(true);
        }, ANIMATION_TRANSITION_DELAY);
    }, []);

    useEffect(() => {
        const timer = setInterval(advanceSlide, 10000);
        return () => clearInterval(timer);
    }, [advanceSlide]);

    const carpet = carpetData[currentIndex];

    return (
        <div className="hero-carousel">
            <div className={`hero-carousel-single ${isAnimating ? 'animating' : ''}`}>
                <div className="hero-carpet-card">
                    <div className={`hero-carpet-image-wrapper ${slideFromLeft ? 'slide-from-left' : 'slide-from-right'}`}>
                        <img
                            src={carpet.imageUrl}
                            alt={carpet.title}
                            className="hero-carpet-image"
                        />
                    </div>
                    <div className="hero-carpet-text">
                        <h3 className="hero-carpet-title slide-from-top">
                            {carpet.title}
                        </h3>
                        <p className="hero-carpet-description slide-from-bottom">
                            {carpet.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="hero-carousel-dots">
                {carpetData.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === currentIndex ? 'active' : ''}`}
                        onClick={() => {
                            setIsAnimating(false);
                            setTimeout(() => {
                                setCurrentIndex(i);
                                setIsAnimating(true);
                            }, ANIMATION_TRANSITION_DELAY);
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;