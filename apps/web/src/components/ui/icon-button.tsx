import { Button, ButtonProps } from '@/components/ui/button';
import { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonProps {
  icon: ElementType;
  label: string;
}

export function IconButton({ icon: Icon, label, className, ...props }: IconButtonProps) {
  return (
    <Button className={cn('w-full', className)} {...props}>
      <Icon className="mr-2 w-5 h-5" />
      {label}
    </Button>
  );
}
