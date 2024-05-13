import React from 'react';

import theuz from './imgTheuz/theuz.png';

class BackToTop extends React.Component {
    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    render() {
        return (
            <img src={theuz} alt="Theuz" className="top" onClick={this.scrollToTop}/>
        );
    }
}

export default BackToTop;
