import React, { useState, useEffect } from 'react';
import { Box, IconButton, Slide, Stack } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import articles from '../../../../data/ChroniclesData';
import altLogo2 from '../../../../assets/logos/alt-logo-1-black.png';
import CategoryModal from '../../../CategoryModal/CategoryModal';
import Buttons from '../../../Buttons/Button';
import ArticleDialogBox from '../../../ArticleDialogBox/ArticleDialogBox';
import ErrorScreen from '../../../ErrorScreen/ErrorScreen';
import './JetArticlesCarousel.css';

const JetArticlesCarousel = () => {
    const allowedCategories = ['PRIVATE JET TRAVEL'];
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState('left');
    const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 767);

    const [isArticleOpen, setIsArticleOpen] = useState(false); //Handles display for articles
    const [articleData, setArticleData] = useState(null);
    const [isErrorScreen, setIsErrorScreen] = useState(false);

    function getCardsPerPage() {
        const width = window.innerWidth;
        if (width <= 767) return 1;
        if (width <= 1024) return 2;
        return 3;
    }

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 767);
            setCardsPerPage(getCardsPerPage());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const allCategories = ['ALL', ...allowedCategories];

    // Only include articles with Jets or Tip category
    const validArticles = articles.filter(article =>
        allowedCategories.includes(article.category)
    );

    const filteredCards =
        selectedCategory === 'ALL'
            ? validArticles
            : validArticles.filter((card) => card.category === selectedCategory);

    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    const handleNext = () => {
        setSlideDirection('left');
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handleBack = () => {
        setSlideDirection('right');
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const startIndex = currentPage * cardsPerPage;
    const visibleCards = filteredCards.slice(startIndex, startIndex + cardsPerPage);

        // Displays the full content of a single article
    const displayFullArticle = async (articleID) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/chronicles/api/${articleID}`
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            let data = await response.json();
            setArticleData(data);
            setIsArticleOpen(true)
            
        } catch {
            setIsErrorScreen(true)
        }
    }

    return (
        <Box className="carousel-container">
            {/* Filter Button */}
            <Box id="filter-button-wrapper">
                <Buttons
                    displayName={<i className="fa-solid fa-sliders"></i>}
                    btnAction={handleOpen}
                    btnIdName="filter-button-modal"
                >
                    Open Modal
                </Buttons>
            </Box>

            {/* Category Modal */}
            <CategoryModal open={open} handleClose={handleClose}>
                <div className="modal-categories">
                    {allCategories.map((category) => (
                        <Buttons
                            key={category}
                            displayName={category}
                            btnClassName={selectedCategory === category ? 'active' : ''}
                            btnAction={() => {
                                setSelectedCategory(category);
                                setCurrentPage(0);
                                handleClose();
                            }}
                        />
                    ))}
                </div>
            </CategoryModal>

            {/* Carousel Navigation */}
            <IconButton onClick={handleBack} className="carousel-nav-btn left">
                <NavigateBeforeIcon className="carousel-icon" />
            </IconButton>

            <Slide direction={slideDirection} in mountOnEnter unmountOnExit>
                <Stack
                    direction="row"
                    spacing={5}
                    justifyContent="center"
                    className="carousel-stack"
                >
                    {visibleCards.map((card) => (
                        <Box key={card.title} className="jet-article-card">
                            <Box className="jet-article-image-container">
                                <img
                                    className="jet-article-logo"
                                    src={altLogo2}
                                    alt="Top hat logo"
                                />
                                <img
                                    className="jet-article-image"
                                    src={card.image}
                                    alt={card.alt}
                                />
                            </Box>
                            <Box className="jet-article-content">
                                <h3 className="jet-article-title">{card.title}</h3>
                                <p className="jet-article-description">{card.description}</p>
                                <a
                                    className="jet-article-link"
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => displayFullArticle(card.id)}
                                >
                                    Read More →
                                </a>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Slide>

            <IconButton onClick={handleNext} className="carousel-nav-btn right">
                <NavigateNextIcon className="carousel-icon" />
            </IconButton>

            {/* Pagination */}
            <Box className="carousel-pagination-container">
                {isLargeScreen ? (
                    <Box className="carousel-dots-container">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <Box
                                key={index}
                                className={`carousel-dot ${currentPage === index ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box className="carousel-page-indicator">
                        <span>{currentPage + 1} / {totalPages}</span>
                    </Box>
                )}
            </Box>

                        {/* Article Display Box */}
                        {articleData && isArticleOpen && (
                            <ArticleDialogBox
                                isOpen={isArticleOpen}
                                handleArticleView={setIsArticleOpen}
                                article={articleData}
                            />
                        )}
            
                        {/* Error Screen */}
                        {isErrorScreen && (
                            <ErrorScreen
                                isOpen={isErrorScreen}
                                handleClose={() => setIsErrorScreen(false)}
                            />
                        )}
        </Box>
    );
};

export default JetArticlesCarousel;
