import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const LucideIcon = ({ name, className, size = 20 }: LucideIconProps) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // Fallback to Printer icon if requested icon name doesn't exist
    return <Icons.Printer className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};
