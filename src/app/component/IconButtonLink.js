
import { IconButton, Link, Tooltip } from '@material-ui/core';

export default function IconButtonLink ({ handleClick, Icon, label, path }) {
  return (
    <Link href={path || '#'} onClick={handleClick}>
      <Tooltip title={label}>
        <IconButton aria-label={label}>
          <Icon />
        </IconButton>
      </Tooltip>
    </Link>
  );
}
