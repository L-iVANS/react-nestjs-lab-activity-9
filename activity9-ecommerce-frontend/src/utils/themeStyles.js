// Centralized theme-aware styles to avoid code duplication

export const getGradientBg = (isDarkMode) => ({
  background: isDarkMode
    ? 'linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55), rgb(17, 24, 39))'
    : 'linear-gradient(to bottom right, rgb(224, 231, 255), rgb(255, 255, 255), rgb(224, 231, 255))',
});

export const getToastStyle = (isDarkMode) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: isDarkMode ? '#ef4444' : '#f87171',
  color: '#fff',
  padding: '18px 32px',
  borderRadius: '12px',
  fontSize: '1.25rem',
  fontWeight: 700,
  boxShadow: isDarkMode ? '0 2px 16px rgba(30,41,59,0.7)' : '0 2px 16px rgba(0,0,0,0.15)',
  zIndex: 9999,
  textAlign: 'center',
});

export const getImageNavigationButtonStyle = (isDarkMode) => ({
  background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  fontSize: 32,
  cursor: 'pointer',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  borderRadius: 6,
});

export const getImageContainerStyle = (isDarkMode) => ({
  position: 'relative',
  width: 350,
  height: 350,
  background: isDarkMode ? 'rgba(55, 65, 81, 0.4)' : 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  fontWeight: 600,
  borderRadius: 16,
  boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(99, 102, 241, 0.1)',
  border: isDarkMode ? '1.5px solid rgba(167, 139, 250, 0.3)' : '1.5px solid rgba(99, 102, 241, 0.2)',
  backdropFilter: 'blur(8px)',
});

export const getThumbnailStyle = (isDarkMode, isActive) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  border: isActive 
    ? (isDarkMode ? '2.5px solid #fff' : '2.5px solid #fff')
    : (isDarkMode ? '1.5px solid rgba(255, 255, 255, 0.2)' : '1.5px solid rgba(0, 0, 0, 0.1)'),
  cursor: 'pointer',
  borderRadius: 8,
  background: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.8)',
  transition: 'border 0.2s, background 0.2s',
});

export const getProductInfoContainerStyle = (isDarkMode) => ({
  flex: 1,
  minWidth: 320,
  marginLeft: 32,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  background: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.7)',
  borderRadius: 16,
  padding: 24,
  boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(99, 102, 241, 0.08)',
  border: isDarkMode ? '1.5px solid rgba(167, 139, 250, 0.2)' : '1.5px solid rgba(99, 102, 241, 0.15)',
  backdropFilter: 'blur(8px)',
  color: isDarkMode ? '#f3f4f6' : '#fff',
  transition: 'background 0.2s, color 0.2s',
});

export const getQuantityInputStyle = (isDarkMode) => ({
  width: 40,
  textAlign: 'center',
  fontSize: 16,
  background: isDarkMode ? 'rgba(55, 65, 81, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  color: isDarkMode ? '#f3f4f6' : '#222',
  border: isDarkMode ? '1.5px solid #fff' : '1.5px solid #fff',
  borderRadius: 6,
});

export const getQuantityButtonStyle = (isDarkMode) => ({
  padding: '2px 8px',
  fontSize: 16,
  background: isDarkMode ? 'rgba(55, 65, 81, 0.6)' : 'rgba(255, 255, 255, 0.6)',
  color: isDarkMode ? '#f3f4f6' : '#222',
  border: isDarkMode ? '1px solid #fff' : '1px solid #fff',
  borderRadius: 4,
  fontWeight: 600,
});

export const getAddToCartButtonStyle = (isDarkMode, isDisabled) => ({
  padding: '8px 16px',
  borderRadius: 8,
  border: isDarkMode ? '1.5px solid #fff' : '1.5px solid #1f2937',
  color: isDarkMode ? '#f3f4f6' : '#1f2937',
  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontWeight: 600,
  opacity: isDisabled ? 0.5 : 1,
  boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'background 0.2s, color 0.2s, border 0.2s',
});

export const getBuyNowButtonStyle = (isDarkMode, isDisabled) => ({
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  background: isDarkMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: '#fff',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  fontWeight: 600,
  opacity: isDisabled ? 0.5 : 1,
  boxShadow: isDarkMode ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(16, 185, 129, 0.3)',
  transition: 'background 0.2s, box-shadow 0.2s',
});

export const getInputFieldStyle = (isDarkMode) => ({
  borderColor: isDarkMode ? '#4B5563' : '#D1D9E0',
});

export const getCheckoutContainerStyle = (isDarkMode) => ({
  borderColor: isDarkMode ? 'transparent' : '#7c3aed',
  backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.7)',
});

export const getTextColor = (isDarkMode) => ({
  color: isDarkMode ? '#f3f4f6' : '#1f2937',
});
