type SessionInfoMeta = {
  label: string;
  value: string;
};

type SessionInfoCardProps = {
  title: string;
  description: string;
  metas: SessionInfoMeta[];
};

export function SessionInfoCard({ title, description, metas }: SessionInfoCardProps) {
  return (
    <section className="w-full max-w-5xl rounded-md border border-gray-100 bg-white shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        {metas.map((meta) => (
          <SessionInfoMeta key={meta.label} label={meta.label} value={meta.value} />
        ))}
      </div>
    </section>
  );
}

function SessionInfoMeta({ label, value }: SessionInfoMeta) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

