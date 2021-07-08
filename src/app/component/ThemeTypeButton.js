
import { useTheme } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';

export default function ThemeButton ({ switchTheme }) {
  const { DARK } = { DARK: 'dark' };
  const theme = useTheme()?.palette?.type || DARK;
  const label = 'Switch Theme';

  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={switchTheme}>
        {theme === DARK ? <BrightnessHighIcon /> : <NightsStayIcon />}
      </IconButton>
    </Tooltip>
  );
}
