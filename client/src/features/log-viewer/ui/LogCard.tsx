import type { LogItem } from '@/entities/log';
import { format } from 'date-fns';
import { getLevelName } from '../lib/getLogLevelName';
import { getLevelColor } from '../lib/getLevelColor';

interface LogCardProps {
  log: LogItem;
}

export const LogCard = ({ log }: LogCardProps) => {
  return (
    <div className="border-(--border) border-b py-2">
      <span>{format(new Date(log.time), 'yyyy-MM-dd HH:mm:ss.SSS')}</span>{' '}
      <span className={`font-medium ${getLevelColor(log.level)}`}>
        {getLevelName(log.level).padEnd(5)}
      </span>{' '}
      <span className="text-(--description-text)">[{log.source}]</span>{' '}
      <span>{log.msg}</span>
      {Object.keys(log).length > 4 && (
        <pre className="mt-1 max-w-full overflow-x-auto whitespace-pre-wrap break-all text-(--description-text) text-sm">
          {JSON.stringify(
            Object.fromEntries(
              Object.entries(log).filter(
                ([k]) => !['time', 'level', 'source', 'msg'].includes(k),
              ),
            ),
            null,
            2,
          )}
        </pre>
      )}
    </div>
  );
};
