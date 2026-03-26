interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Card = ({ children, title, description }: CardProps) => {
  const hasHeader = title && description;

  return (
    <div className="rounded-2xl bg-surface p-8 shadow-md">
      {hasHeader && (
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-neutral-600">{description}</p>
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </div>
  );
};
