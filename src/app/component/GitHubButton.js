
import { IconButton, Link, Tooltip } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

export default function ThemeTypeButton ({ setThemeType }) {
  const location = 'https://github.com/chrisdigity/mochimap-www';
  const label = 'Contribute to MochiMap';

  return (
    <Link href={location}>
      <Tooltip title={label}>
        <IconButton aria-label={label}>
          <GitHubIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
}
