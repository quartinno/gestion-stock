import styles from './Card.module.css';
import PropTypes from 'prop-types';

const Card = ({ title, children, footer, className, ...props }) => {
  return (
    <div className={`${styles.card} ${className || ''}`} {...props}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Card;