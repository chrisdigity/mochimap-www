
import { IconButton, Link, Tooltip } from '@material-ui/core';

export default function IconButtonLink ({ action, edge, Icon, label, path }) {
  const isComponent = typeof Icon === 'function' || typeof Icon === 'object';
  const handleClick = action;

  return (
    <Link href={path || '#'} onClick={handleClick}>
      <Tooltip title={label}>
        <IconButton aria-label={label} edge={edge}>
          {isComponent ? <Icon /> : (
            <img src={Icon} width='24' height='24' />
          )}
        </IconButton>
      </Tooltip>
    </Link>
  );
}
