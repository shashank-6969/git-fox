import { AlertTriangle, WifiOff, UserX, Inbox } from 'lucide-react';

type ErrorType = 'not-found' | 'rate-limit' | 'network' | 'empty' | 'generic';

interface ErrorMessageProps {
  message: string;
  type?: ErrorType;
  onRetry?: () => void;
}

function detectType(message: string): ErrorType {
  const msg = message.toLowerCase();
  if (msg.includes('not found')) return 'not-found';
  if (msg.includes('rate limit')) return 'rate-limit';
  if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('timeout'))
    return 'network';
  return 'generic';
}

const CONFIG: Record<ErrorType, { icon: React.ReactNode; title: string; color: string }> = {
  'not-found': {
    icon: <UserX size={36} />,
    title: 'User Not Found',
    color: 'text-[#f85149]',
  },
  'rate-limit': {
    icon: <AlertTriangle size={36} />,
    title: 'Rate Limit Exceeded',
    color: 'text-[#d29922]',
  },
  network: {
    icon: <WifiOff size={36} />,
    title: 'Connection Error',
    color: 'text-[#8b949e]',
  },
  empty: {
    icon: <Inbox size={36} />,
    title: 'No Repositories',
    color: 'text-[#8b949e]',
  },
  generic: {
    icon: <AlertTriangle size={36} />,
    title: 'Something Went Wrong',
    color: 'text-[#f85149]',
  },
};

export function ErrorMessage({ message, type, onRetry }: ErrorMessageProps) {
  const resolved = type ?? detectType(message);
  const { icon, title, color } = CONFIG[resolved];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
      <div className={`${color} mb-3 opacity-80`}>{icon}</div>
      <h2 className="text-[#c9d1d9] font-semibold text-lg mb-1">{title}</h2>
      <p className="text-[#8b949e] text-sm max-w-sm">{message}</p>
      {onRetry && (
        <button
          id="error-retry-btn"
          onClick={onRetry}
          className="mt-5 px-5 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-sm rounded-md transition-colors duration-150"
        >
          Try again
        </button>
      )}
    </div>
  );
}
