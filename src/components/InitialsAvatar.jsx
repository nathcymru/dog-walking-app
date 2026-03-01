import React from 'react';

/**
 * InitialsAvatar component displays either a user's photo or their initials
 * @param {string} fullName - User's full name to extract initials from
 * @param {string} photoUrl - Optional photo URL to display
 * @param {number} sizePx - Size of the avatar in pixels (default: 40)
 * @param {string} ariaLabel - Accessibility label for the avatar
 */
export const InitialsAvatar = ({ fullName = '', photoUrl = '', sizePx = 40, ariaLabel = 'User avatar' }) => {
  const [imageError, setImageError] = React.useState(false);

  // Extract initials from full name
  const getInitials = (name) => {
    if (!name) return '?';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    // Get first letter of first name and first letter of last name
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(fullName);

  const avatarStyle = {
    width: `${sizePx}px`,
    height: `${sizePx}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${sizePx * 0.4}px`,
    fontWeight: 'bold',
    color: 'var(--ion-color-primary-contrast, #fff)',
    backgroundColor: 'var(--ion-color-primary)',
    flexShrink: 0,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  // Reset image error state when photoUrl changes
  React.useEffect(() => {
    setImageError(false);
  }, [photoUrl]);

  const shouldShowImage = photoUrl && !imageError;

  return (
    <div style={avatarStyle} aria-label={ariaLabel} role="img">
      {shouldShowImage ? (
        <img 
          src={photoUrl} 
          alt={fullName} 
          style={imageStyle} 
          onError={() => setImageError(true)} 
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
