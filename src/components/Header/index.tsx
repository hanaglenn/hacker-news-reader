import React from 'react';

type Props = {
  title: string;
}

export default function Header({ title }: Props) {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
}
