export default function Empty({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-12 text-center">
      {icon && <div className="text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}