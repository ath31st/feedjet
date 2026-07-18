import type { LogItem } from '@/entities/log';
import { format } from 'date-fns';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getLevelName } from '../lib/getLogLevelName';
import { getLevelColor } from '../lib/getLevelColor';

interface LogCardProps {
  log: LogItem;
}

const META_KEYS = new Set(['time', 'level', 'source', 'msg']);

export const LogCard = ({ log }: LogCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const extra = Object.fromEntries(
    Object.entries(log).filter(([k]) => !META_KEYS.has(k)),
  );
  const hasExtra = Object.keys(extra).length > 0;

  return (
    <div className="border-(--border) border-b py-2 font-mono text-xs sm:text-sm">
      <button
        type="button"
        className={`flex w-full items-start gap-2 text-left ${
          hasExtra ? 'cursor-pointer' : 'cursor-default'
        }`}
        onClick={() => hasExtra && setExpanded((v) => !v)}
        disabled={!hasExtra}
      >
        <span className="mt-0.5 w-4 shrink-0 text-(--meta-text)">
          {hasExtra ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="text-(--meta-text)">
            {format(new Date(log.time), 'yyyy-MM-dd HH:mm:ss.SSS')}
          </span>{' '}
          <span className={`font-medium ${getLevelColor(log.level)}`}>
            {getLevelName(log.level)}
          </span>{' '}
          <span className="text-(--description-text)">[{log.source}]</span>{' '}
          <span>{log.msg}</span>
        </span>
      </button>

      {expanded && hasExtra && (
        <pre className="mt-1 ml-6 max-w-full overflow-x-auto whitespace-pre-wrap break-all text-(--description-text) text-xs">
          {JSON.stringify(extra, null, 2)}
        </pre>
      )}
    </div>
  );
};
