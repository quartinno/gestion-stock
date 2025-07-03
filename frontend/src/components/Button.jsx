import styles from './Button.module.css';
import PropTypes from 'prop-types';

const Button = ({ variant = 'primary', size = 'medium', disabled = false, children, onClick, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Button;