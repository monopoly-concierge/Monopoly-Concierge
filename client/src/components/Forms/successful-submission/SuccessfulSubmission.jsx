import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types'
import altLogo1Black from '../../../assets/logos/alt-logo-1-black.png';
import altLogo1White from '../../../assets/logos/alt-logo-2-white.png';
import './SuccessfulSubmission.css';

const SuccessfulSubmission = ({handleClose, onFooter=false}) => {
    const [isTabletView, setIsTabletView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsTabletView(true);
            } else {
                setIsTabletView(false);
            }
        };
    
        handleResize();
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id='successful-submission-container'>
            <button
                type="button"
                id='successful-submission-close-btn'
                onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                }}
            >
                <CloseIcon 
                    id={isTabletView && !onFooter ? 
                        'successful-submission-x-icon-mobile': 'successful-submission-x-icon'
                    }
                />
            </button>
            <h2 
                id={isTabletView && !onFooter ? 'successful-submission-heading': ''}
                >Submission Successful
            </h2>
            <p
                id={isTabletView && !onFooter ? 'successful-submission-message': ''}    
            >
                Thank you for submitting the inquiry form.
                A team member will be contacting you in the next 24-48 hours with the next steps.
            </p>
            <img src={isTabletView && !onFooter ? (altLogo1White) : (altLogo1Black)} alt='A circle with the words monopoly concierge and a top hat in the center' />
        </section>
    )
}

SuccessfulSubmission.propTypes = {
    handleClose: PropTypes.func.isRequired,
    onFooter: PropTypes.bool
}

export default SuccessfulSubmission