const variants = {
  text: 'h-4 rounded',
  title: 'h-8 rounded',
  card: 'h-40 rounded-xl',
  button: 'h-10 rounded-lg',
  avatar: 'h-12 w-12 rounded-full',
};

export const Skeleton = ({ variant = 'text', className = '', count = 1 }) => {
  const skeletonClass = variants[variant] || variants.text;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${skeletonClass} bg-slate-800 animate-pulse ${className}`}
        />
      ))}
    </>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <Skeleton variant="title" className="w-1/3 mb-4" />
      <Skeleton variant="text" className="w-full mb-2" />
      <Skeleton variant="text" className="w-3/4 mb-4" />
      <Skeleton variant="button" className="w-1/2" />
    </div>
  );
};

export const ShipmentSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton variant="title" className="w-1/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};

export const TrackingSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton variant="title" className="w-1/3 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-4 h-4 rounded-full bg-slate-800 animate-pulse" />
            <Skeleton variant="text" className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
