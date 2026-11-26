export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
      <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        {title}
      </h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
}
