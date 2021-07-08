
import { IconButton, Link, Tooltip } from '@material-ui/core';
import MochimoIcon from './MochimoIcon';

export default function ThemeTypeButton ({ setThemeType }) {
  const location = 'https://mochimo.org';
  const label = 'What is Mochimo?';

  return (
    <Link href={location}>
      <Tooltip title={label}>
        <IconButton aria-label={label}>
          <MochimoIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
}
