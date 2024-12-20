import React, { lazy, Suspense, useEffect, useState } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div style={{ width: 24, height: 24 }}/>

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<LucideProps> | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      const { default: LoadedIcon } = await dynamicIconImports[name]();
      setIconComponent(() => LoadedIcon);
    };

    loadIcon();
  }, [name]);

  if (!IconComponent) {
    return fallback;
  }

  return <IconComponent {...props} />;
};