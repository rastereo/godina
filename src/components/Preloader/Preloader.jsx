import './Preloader.css';

/**
 *  Прелоадер.
 *
 * @returns {React.ReactElement} Preloader
 */
function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader__container">
        <span className="preloader__round"></span>
      </div>
    </div>
  );
}

export default Preloader;
