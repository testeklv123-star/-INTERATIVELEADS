
import React from 'react';
import { useTenantStore } from '../../stores/tenantStore';

interface DynamicLogoProps {
  type: 'main' | 'center' | 'watermark';
  className?: string;
  alt?: string;
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({ type, className = '', alt }) => {
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  if (!tenantConfig) return null;

  const logoUrl = tenantConfig.theme.logos[`${type}_logo_url`];
  const logoAlt = alt || `${tenantConfig.brand_name} logo`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://picsum.photos/300/150?grayscale';
    e.currentTarget.onerror = null;
  };

  return (
    <img
      src={logoUrl}
      alt={logoAlt}
      className={className}
      onError={handleError}
    />
  );
};

export default DynamicLogo;
