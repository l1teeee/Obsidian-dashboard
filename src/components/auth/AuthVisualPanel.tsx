type AuthVisualPanelProps = {
  side: 'left' | 'right';
  variant?: 'login' | 'register';
};

export default function AuthVisualPanel({ side }: AuthVisualPanelProps) {
  const radius = side === 'left'
    ? 'rounded-tl-[28px] rounded-bl-[28px]'
    : 'rounded-tr-[28px] rounded-br-[28px]';

  return (
    <aside
      aria-hidden="true"
      data-auth-panel="visual"
      className={`hidden bg-white lg:m-6 lg:block lg:min-h-[calc(100dvh-3rem)] ${radius}`}
    />
  );
}
