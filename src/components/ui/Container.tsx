import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({ children, className = '', as: Tag = 'div' }: Props) {
  return (
    <Tag className={['container', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
